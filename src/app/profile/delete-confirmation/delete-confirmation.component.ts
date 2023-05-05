import { Component, OnInit, Inject } from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit {

    ngOnInit(): void {
    }

    constructor(
	public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
	@Inject(MAT_DIALOG_DATA) public data : any,
    ) {
    }

    no() {
	this.dialogRef.close();
    }

}

