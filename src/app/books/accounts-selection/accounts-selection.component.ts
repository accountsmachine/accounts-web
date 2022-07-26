import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'accounts-selection',
    templateUrl: './accounts-selection.component.html',
    styleUrls: ['./accounts-selection.component.scss']
})
export class AccountsSelectionComponent implements OnInit {

    ngOnInit(): void {
    }

    key : string;
    line : string;
    all : string[];
    selected : Set<string>;

    constructor(
	public dialogRef: MatDialogRef<AccountsSelectionComponent>,
	@Inject(MAT_DIALOG_DATA) public data : {
	    proceed: boolean,
	    key : string,
	    line : string,
	    accounts : string[],
	    selected : string[],
	},
    ) {
	this.line = this.data.line;
	this.key = this.data.key;
        this.all = this.data.accounts;
	this.selected = new Set<string>(this.data.selected);
    }

    no() {
	this.dialogRef.close();
    }

    yes() {
        return {
	    proceed: true,
	    key: this.data.key,
	    line: this.data.line,
	    selected: this.selected
	};
    }

    set(x : string) { this.selected.add(x); }
    unset(x : string) { this.selected.delete(x); }

}

