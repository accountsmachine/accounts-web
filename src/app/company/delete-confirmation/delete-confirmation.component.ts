import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { CompanyService, Company, Companies } from '../company.service';

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
	@Inject(MAT_DIALOG_DATA) public data : {
	    id : string, company : Company
	},
    ) {
    }

    no() {
	this.dialogRef.close();
    }

}

