import { Component, OnInit, Inject } from '@angular/core';
import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-disconnect-confirmation',
  templateUrl: './disconnect-confirmation.component.html',
  styleUrls: ['./disconnect-confirmation.component.scss']
})
export class DisconnectConfirmationComponent implements OnInit {

    ngOnInit(): void {
    }

    constructor(
	public dialogRef: MatDialogRef<DisconnectConfirmationComponent>,
	@Inject(MAT_DIALOG_DATA) public data : any,
    ) {
    }

    no() {
	this.dialogRef.close();
    }

}

