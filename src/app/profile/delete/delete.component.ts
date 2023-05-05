import { Component, OnInit } from '@angular/core';

import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

import { AuthService, AuthState } from '../../auth.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';

@Component({
    selector: 'delete-account',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

    username = "";
    username2 = "";

    constructor(
	private auth : AuthService,
	private dialog : MatDialog,
    ) {
    }

    ngOnInit(): void {
    }

    delete() {
	const dialogRef = this.dialog.open(
	    DeleteConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.proceed) {
		    console.log("Proceeding with delete.");
		    this.auth.delete_user();
		}
	    }
	});
    }

}



