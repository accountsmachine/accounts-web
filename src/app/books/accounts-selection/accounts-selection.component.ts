import { Component, OnInit, Inject } from '@angular/core';
import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

import { AccountInclusion } from '../books.service';

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
    reversed : Set<string>;

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

	this.selected = new Set<string>(
	    this.data.mapping.map((a) => a.account)
	);

	this.reversed = new Set<string>(
	    this.data.mapping.filter(
		(a) => a.reversed
	    ).map(
		(a) => a.account
	    )
	);

    }

    no() {
	this.dialogRef.close();
    }

    yes() {

	let am : AccountInclusion[] = [];

	for (let k of this.selected.keys())
	    am.push(new AccountInclusion(k, this.reversed.has(k)));

        return {
	    proceed: true,
	    key: this.data.key,
	    line: this.data.line,
	    mapping: am,
	};
    }

    set(x : string) { this.selected.add(x); }
    unset(x : string) { this.selected.delete(x); }

    choose(x : string) {
        if (this.selected.has(x)) {
	    if (this.reversed.has(x)) {
	        this.selected.delete(x);
	    } else {
		this.reversed.add(x);
	    }
	} else {
	    this.selected.add(x);
	    this.reversed.delete(x);
	}
    }

}

