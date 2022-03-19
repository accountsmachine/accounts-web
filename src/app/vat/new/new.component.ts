import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { VatConfigService } from '../vat-config.service';

@Component({
  selector: 'vat-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

    label = "";
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    constructor(
	private filing : VatConfigService,
	private router : Router,
	private snackBar : MatSnackBar,
	private _formBuilder: FormBuilder,
    ) {     this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
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

