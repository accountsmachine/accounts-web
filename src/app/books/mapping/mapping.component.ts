import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountBalance, BooksService } from '../books.service';
import { MappingService, Mapping, AccountInclusion } from '../mapping.service';

import {
    AccountsSelectionComponent
} from '../accounts-selection/accounts-selection.component';

class Row {
    key : string = "";
    line : string = "";
    box : number = 0;
    accounts : string[] = [];
    mapping : AccountInclusion[] = [];
};

@Component({
    selector: 'mapping',
    templateUrl: './mapping.component.html',
    styleUrls: ['./mapping.component.scss']
})
export class MappingComponent implements OnInit, AfterViewInit {

    mapping : MatTableDataSource<Row> = new MatTableDataSource<Row>([]);

    id : string = "";

    book_mapping? : Mapping;
    accounts? : AccountBalance[];

    @ViewChild(MatPaginator) paginator? : MatPaginator;
    @ViewChild(MatSort) sort? : MatSort;

    columns = ['line', 'box', 'accounts'];

    constructor(
	private route : ActivatedRoute,
	private router : Router,
	private snackBar : MatSnackBar,
	private dialog : MatDialog,
	private booksService : BooksService,
	private mappingService : MappingService,
    )
    {
    }

    ngOnInit() {}

    configure() {

	if (!this.mapping) return;
	if (!this.sort) return;

	setTimeout( () => {
	    this.sort!.sort(<MatSortable>{
		"id": "box",
		"start": "asc",
	    });
	}, 0);

	this.mapping.paginator = this.paginator!;
	this.mapping.sort = this.sort;

    }

    ngAfterViewInit(): void {

	this.configure();

	this.route.params.subscribe(
	    params => {
		if (params["id"]) {

		    let id = params["id"];
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

	let accounts = new Set(this.accounts.map((a) => a.account));

	let data : Row[] = [];

	for (let key in this.book_mapping) {

	    let r = new Row();

	    r.key = key;
	    r.line = this.mappingService.vat_desc(key);
	    r.box = this.mappingService.vat_box(key);
	    r.mapping = this.book_mapping[key];
	    r.accounts = [];

	    let m = [];

	    // This is used to keep track of if we've modified the mapping
	    // because of a mis-match between accounts file and the
	    // mapping record.
	    let mismatch = false;

	    for (let acct of r.mapping) {

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

    apply_filter(f : any) {
	let filt = f!.value.trim().toLowerCase();
	this.mapping.filter = filt;
    }

    select(row : any) {

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

	dialogRef.afterClosed().subscribe((result : any) => {

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

