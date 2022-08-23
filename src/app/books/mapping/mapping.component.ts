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

import {
    AccountBalance, BooksService, Mapping, AccountInclusion
} from '../books.service';

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

    mapping : MatTableDataSource<Row> =
	new MatTableDataSource<Row>([]);

    id : string = "";

    vat_box : { [key : string] : number } = {
        "vat-output-sales": 1,
	"vat-output-acquisitions": 2,
	"vat-input": 4,
  	"total-vatex-sales": 6,
	"total-vatex-purchases": 7,
	"total-vatex-goods-supplied": 8,
	"total-vatex-acquisitions": 9,
    };

    vat_desc : { [key : string] : string } = {
        "vat-output-sales": "VAT due on sales",
	"vat-output-acquisitions": "VAT due on acquisitions",
	"vat-input": "VAT reclaimed on purchases",
  	"total-vatex-sales": "Total sales ex. VAT",
	"total-vatex-purchases": "Total purchases ex. VAT",
	"total-vatex-goods-supplied": "Total goods supplied to EU ex. VAT",
	"total-vatex-acquisitions": "Total acquisitions of goods from EU ex. VAT",
    };

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

		    this.booksService.get_mapping(id).subscribe(
			(mapping : Mapping) => {
			    this.book_mapping = mapping;
			    this.update_table();
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

	// This is used to keep track of if we've modified the mapping
	// because of a mis-match between accounts file and the
	// mapping record.
	let mismatch = false;

	let accounts = new Set(this.accounts.map((a) => a.account));

	let data : Row[] = [];

	for (let key in this.book_mapping) {

	    let r = new Row();

	    r.key = key;
	    r.line = this.vat_desc[key];
	    r.box = this.vat_box[key];
	    r.mapping = this.book_mapping[key];
	    r.accounts = [];

	    let m = [];

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
		r.mapping = m;
		this.book_mapping[key] = m;
	    }

	    // Note, the mismatch statement will be true, once any
	    // mismatch has been detected on a line.  Not a problem,
	    // because it's always safe to run.

	    data.push(r);

	}

	// Write back book mapping.
	if (mismatch) {
	    this.booksService.put_mapping(
		this.id, this.book_mapping
	    ).subscribe(() => {
	    });
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
		width: '450px',
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

	    if (result) {

		if (result.proceed) {

		    for(let row of this.mapping.data) {
			if (row.key == result.key) {
			    row.mapping = result.mapping;
			    row.accounts = row.mapping.map((a) => a.account);
			}
		    }

		    let m = new Mapping();

		    for (let row of this.mapping.data) {
			m[row.key] = row.mapping;
		    }

		    this.booksService.put_mapping(this.id, m).subscribe(
			() => {
			    this.snackBar.open(
				"Mapping updated", "dismiss",
				{ duration: 2000 });
			}
		    );

		}
	    }
	});
    }

}

