import { Component, OnInit, Inject } from '@angular/core';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

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

    select(acc: string, x : any) {
	if (x.value == "add") {
	    this.mapping.set(acc, false);
	} else if (x.value == "reverse") {
	    this.mapping.set(acc, true);
	} else {
	    this.mapping.delete(acc);
	}
    }

    ngOnInit(): void {
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

