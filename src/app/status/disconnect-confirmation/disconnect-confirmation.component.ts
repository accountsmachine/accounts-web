import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-disconnect-confirmation',
    templateUrl: './disconnect-confirmation.component.html',
    styleUrls: ['./disconnect-confirmation.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class DisconnectConfirmationComponent {
    dialogRef = inject<MatDialogRef<DisconnectConfirmationComponent>>(MatDialogRef);
    data = inject(MAT_DIALOG_DATA);


    no() {
	this.dialogRef.close();
    }

}

