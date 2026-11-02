import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, MatSortHeader } from '@angular/material/sort';
import {
    MatDialog
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountBalance, BooksService } from '../books.service';
import { MappingService, Mapping, AccountInclusion } from '../mapping.service';

import {
    AccountsSelectionComponent
} from '../accounts-selection/accounts-selection.component';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';

class Row {
    key  = "";
    line  = "";
    box  = 0;
    accounts : string[] = [];
    mapping : AccountInclusion[] = [];
};

@Component({
    selector: 'mapping',
    templateUrl: './mapping.component.html',
    styleUrls: ['./mapping.component.scss'],
    imports: [MatFormField, MatInput, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatRipple, MatPaginator]
})
export class MappingComponent implements AfterViewInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);
    private booksService = inject(BooksService);
    private mappingService = inject(MappingService);


    mapping : MatTableDataSource<Row> = new MatTableDataSource<Row>([]);

    id  = "";

    book_mapping? : Mapping;
    accounts? : AccountBalance[];

    @ViewChild(MatPaginator) paginator? : MatPaginator;
    @ViewChild(MatSort) sort? : MatSort;

    columns = ['line', 'box', 'accounts'];

    configure() {

	if (!this.mapping) return;
	if (!this.sort) return;

	setTimeout( () => {
	    this.sort!.sort(({
		"id": "box",
		"start": "asc",
	    } as MatSortable));
	}, 0);

	this.mapping.paginator = this.paginator!;
	this.mapping.sort = this.sort;

    }

    ngAfterViewInit(): void {

	this.configure();

	this.route.params.subscribe(
	    params => {
		if (params["id"]) {

		    const id = params["id"];
		    this.id = id;

		    this.mappingService.load(id).subscribe(
			(mapping : Mapping) => {
			    if (mapping) {
				this.book_mapping = mapping;
				this.update_table();
			    }
			}
		    );

		    this.booksService.get_books_detail(id).subscribe(
			(e : AccountBalance[]) => {
			    this.accounts = e;
			    this.update_table();
			}
		    );

		}
	    }
	);

    }

    update_table() {

	if (!this.accounts) return;
	if (!this.book_mapping) return;

	const accounts = new Set(this.accounts.map((a) => a.account));

	const data : Row[] = [];

	for (const key in this.book_mapping) {

	    const r = new Row();

	    r.key = key;
	    r.line = this.mappingService.vat_desc(key);
	    r.box = this.mappingService.vat_box(key);
	    r.mapping = this.book_mapping[key];
	    r.accounts = [];

	    const m = [];

	    // This is used to keep track of if we've modified the mapping
	    // because of a mis-match between accounts file and the
	    // mapping record.
	    let mismatch = false;

	    for (const acct of r.mapping) {

		if (accounts.has(acct.account)) {

		    m.push(acct);
		    r.accounts.push(acct.account);

		} else {

		    // Account in mapping doesn't exist in the accounts books
		    // It has been removed.
		    mismatch = true;

		}

	    }

	    // If there was a mismatch, update the book mapping, it's
	    // going to get posted back.
	    if (mismatch) {
		this.mappingService.set(key, this.book_mapping[key]).subscribe(
		    () => {}
		);
	    }

	    data.push(r);

	}

	this.mapping.data = data;

    }

    apply_filter(f : EventTarget | null) {
	const filt = (f as HTMLInputElement).value.trim().toLowerCase();
	this.mapping.filter = filt;
    }

    select(row : Row) {

	if (!this.accounts) return;

	const dialogRef = this.dialog.open(
	    AccountsSelectionComponent, {
		width: '750px',
		data: {
		    proceed: false,
		    line: row.line,
		    key: row.key,
		    mapping: row.mapping,
		    accounts: this.accounts.map((a) => a.account)
		},
	    }
	);

	dialogRef.afterClosed().subscribe((result: { proceed: boolean; mapping: AccountInclusion[]; key: string } | undefined) => {

	    // Shouldn't happen
	    if (this.book_mapping == null) return;

	    if (result && result.proceed) {

		if (!result.mapping) return;
		if (!result.key) return;

		this.book_mapping[result.key] = result.mapping;
		this.update_table();

		this.mappingService.set(result.key, result.mapping).subscribe(
		    () => {
			this.snackBar.open(
			    "Mapping updated", "dismiss",
			    { duration: 2000 }
			);
		    }
		);

	    }

	});

    }

}

