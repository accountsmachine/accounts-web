import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { AccountInclusion } from '../mapping.service';

class Row {
    account : string = "";
};

@Component({
    selector: 'accounts-selection',
    templateUrl: './accounts-selection.component.html',
    styleUrls: ['./accounts-selection.component.scss']
})
export class AccountsSelectionComponent implements OnInit {

    groupId = 0;

    get nextGroup() {
        this.groupId ++;
	return this.currentGroup;
    }

    get currentGroup() : string {
        return "g" + this.groupId.toString();
    }

    unmap(acc : string) {

	this.data.mapping = this.data.mapping.filter(
	    (row : AccountInclusion) => row.account !== acc
	);

    }

    map(acc : string, reversed : boolean) {

	this.data.mapping = this.data.mapping.filter(
	    (row : AccountInclusion) => row.account !== acc
	);

	this.data.mapping.push(new AccountInclusion(acc, reversed));

    }

    @ViewChild(MatPaginator) paginator? : MatPaginator;
    @ViewChild(MatSort) sort? : MatSort;

    columns = ['account', 'actions'];

    accounts : MatTableDataSource<Row> = new MatTableDataSource<Row>([]);

    apply_filter(f : any) {
	let filt = f!.value.trim().toLowerCase();
	this.accounts.filter = filt;
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
	this.configure();
    }

    configure() {

	if (!this.sort) return;

	setTimeout( () => {
	    this.sort!.sort(<MatSortable>{
		"id": "box",
		"start": "asc",
	    });
	}, 0);

	this.accounts.paginator = this.paginator!;
	this.accounts.sort = this.sort;

    }

    key : string;
    line : string;
    all : string[];

    constructor(
	public dialogRef: MatDialogRef<AccountsSelectionComponent>,
	@Inject(MAT_DIALOG_DATA) public data : {
	    proceed: boolean,
	    key : string,
	    line : string,
	    accounts : string[],
	    mapping : AccountInclusion[],
	},
    ) {
	this.line = this.data.line;
	this.key = this.data.key;
        this.all = this.data.accounts;

        this.accounts.data = this.data.accounts.map(
	    a => {
		let r = new Row();
		r.account = a;
		return r;
	    }
	);

    }

}

