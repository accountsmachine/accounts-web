import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { VatConfigService } from '../vat-config.service';

@Component({
  selector: 'vat-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

    label = "";

    constructor(
	private filing : VatConfigService,
	private router : Router,
	private snackBar : MatSnackBar,
    ) {
    }

    ngOnInit(): void {
    }

    cancel() {
	this.router.navigate(["/filing"]);
    }

    create() {

	if (this.label == "") {
	    this.snackBar.open("Invalid configuration label", "dismiss",
			       { duration: 5000 });
	    return;
	}

	this.filing.create(this.label).subscribe(
	    id => {
		this.snackBar.open("Configuration created", "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/vat/" + id + "/company"]);
	    });

    }

}

