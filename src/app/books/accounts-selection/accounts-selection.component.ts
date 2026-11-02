import { Component, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable, MatSortHeader } from '@angular/material/sort';
import { AccountInclusion } from '../mapping.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

class Row {
    account  = "";
};

@Component({
    selector: 'accounts-selection',
    templateUrl: './accounts-selection.component.html',
    styleUrls: ['./accounts-selection.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatIcon, MatButton, MatFormField, MatInput, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatIconButton, MatRowDef, MatRow, MatPaginator, MatDialogActions, MatDialogClose]
})
export class AccountsSelectionComponent implements AfterViewInit {
    dialogRef = inject<MatDialogRef<AccountsSelectionComponent>>(MatDialogRef);
    data = inject<{
    proceed: boolean;
    key: string;
    line: string;
    accounts: string[];
    mapping: AccountInclusion[];
}>(MAT_DIALOG_DATA);


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

    apply_filter(f : HTMLInputElement) {
	const filt = f.value.trim().toLowerCase();
	this.accounts.filter = filt;
    }

    ngAfterViewInit(): void {
	this.configure();
    }

    configure() {

	if (!this.sort) return;

	setTimeout( () => {
	    this.sort!.sort(({
		"id": "box",
		"start": "asc",
	    } as MatSortable));
	}, 0);

	this.accounts.paginator = this.paginator!;
	this.accounts.sort = this.sort;

    }

    key : string;
    line : string;
    all : string[];

    constructor() {
	this.line = this.data.line;
	this.key = this.data.key;
        this.all = this.data.accounts;

        this.accounts.data = this.data.accounts.map(
	    a => {
		const r = new Row();
		r.account = a;
		return r;
	    }
	);

    }

}

