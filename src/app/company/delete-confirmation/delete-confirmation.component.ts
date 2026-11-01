import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { Company } from '../company.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-delete-confirmation',
    templateUrl: './delete-confirmation.component.html',
    styleUrls: ['./delete-confirmation.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class DeleteConfirmationComponent {
    dialogRef = inject<MatDialogRef<DeleteConfirmationComponent>>(MatDialogRef);
    data = inject<{
    id: string;
    company: Company;
}>(MAT_DIALOG_DATA);


    no() {
	this.dialogRef.close();
    }

}

