import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AccountBalance, BooksService, Mapping } from '../books.service';

import {
    AccountsSelectionComponent
} from '../accounts-selection/accounts-selection.component';

class Row {
    line : string = "";
    accounts : string[] = [];
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

    accounts : AccountBalance[] = [];

    @ViewChild(MatPaginator) paginator? : MatPaginator;
    @ViewChild(MatSort) sort? : MatSort;

    columns = ['line', 'accounts'];

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
	this.mapping!.paginator = this.paginator!;
	this.mapping!.sort = this.sort!;
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

			    let data : Row[] = [];

			    for (let key in mapping) {

				let r = new Row();

				r.line = key;
				r.accounts = mapping[key];

				data.push(r);

			    }

			    this.mapping.data = data;

			}
		    );

		    this.booksService.get_books_detail(id).subscribe(
			(e : AccountBalance[]) => {
			    this.accounts = e;
			}
		    );

		}
	    }
	);

    }

    apply_filter(f : any) {
	let filt = f!.value.trim().toLowerCase();
	this.mapping.filter = filt;
    }

    select(row : any) {
	let thing = this.accounts.map((a) => a.account );
	const dialogRef = this.dialog.open(
	    AccountsSelectionComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    line: row.line,
		    selected: row.accounts,
		    accounts: this.accounts.map((a) => a.account)
		},
	    }
	);

	dialogRef.afterClosed().subscribe((result : any) => {

	    if (result) {

		if (result.proceed) {

		    for(let row of this.mapping.data) {
			if (row.line == result.line) {
			    row.accounts = Array.from(result.selected.values());
			}
		    }

		    let m = new Mapping();

		    for (let row of this.mapping.data) {
			m[row.line] = row.accounts;
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

