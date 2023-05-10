import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';

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
	console.log("UNMAP ", acc);
	if (this.mapping.has(acc))
	    this.mapping.delete(acc);
    }

    map(acc : string, reversed : boolean) {
	console.log(acc, reversed);
	this.mapping.set(acc, reversed);
    }

    select(acc: string, x : any) {
	if (x.value == "add") {
	    this.mapping.set(acc, false);
	} else if (x.value == "reverse") {
	    this.mapping.set(acc, true);
	} else {
	    this.mapping.delete(acc);
	}
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

	console.log("AVI");
	this.configure();

    }

    configure() {

	if (!this.mapping) return;
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
    mapping : Map<string, boolean>;

    constructor(
	public dialogRef: MatDialogRef<AccountsSelectionComponent>,
	@Inject(MAT_DIALOG_DATA) public data : {
	    proceed: boolean,
	    key : string,
	    line : string,
	    accounts : string[],
	    mapping : Map<string, boolean>,
	},
    ) {
	this.line = this.data.line;
	this.key = this.data.key;
        this.all = this.data.accounts;
	this.mapping = this.data.mapping;

        this.accounts.data = this.data.accounts.map(
	    a => {
		let r = new Row();
		r.account = a;
		return r;
	    }
	);

    }

    value(acc : string) {
	if (this.mapping.has(acc))
	    if (this.mapping.get(acc)) {
		return "reverse";
	    } else {
		return "add";
	    }
	return "ignore";
    }

}

