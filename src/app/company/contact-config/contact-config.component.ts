import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';

@Component({
  selector: 'contact-config',
  templateUrl: './contact-config.component.html',
  styleUrls: ['./contact-config.component.scss']
})
export class ContactConfigComponent implements OnInit {

    form = this.fb.group({
	contact_email: ['', [Validators.required, Validators.email]],
	contact_tel_country: ['', [
	    Validators.required, Validators.pattern("\\+[0-9]+")
	]],
	contact_tel_area: ['', [
	    Validators.required, Validators.pattern("[0-9]+")
	]],
	contact_tel_number: ['', [
	    Validators.required, Validators.pattern("[0-9]+")
	]],
	contact_tel_type: ['', [
	    Validators.required, 
	]],
    });

    constructor(
	private route : ActivatedRoute,
	private state: CompanyService,
	private snackBar: MatSnackBar,
	private fb: FormBuilder,
    ) {
	this.company = new Company();
    }

    company : Company;

    load() {
	this.form.patchValue({
	    contact_email: this.company.contact_email,
	    contact_tel_country: this.company.contact_tel_country,
	    contact_tel_area: this.company.contact_tel_area,
	    contact_tel_number: this.company.contact_tel_number,
	    contact_tel_type: this.company.contact_tel_type,
	});
    }

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.state.load(params["id"]);
		}
	    }
	);

	this.state.subscribe(
	    (company : any) => {
		this.company = company;
		this.load();
	    }
	);	
    }

    public success() {
	let snack = this.snackBar.open("Configuration saved", "dismiss",
				       { duration: 5000 });
    }

    public submit() {
	this.company.contact_email = this.form.value.contact_email;
	this.company.contact_tel_country = this.form.value.contact_tel_country;
	this.company.contact_tel_area = this.form.value.contact_tel_area;
	this.company.contact_tel_number = this.form.value.contact_tel_number;
	this.company.contact_tel_type = this.form.value.contact_tel_type;

	this.state.save().subscribe(
	    e => this.success()
	);
    }

    public revert() {
	this.load();
    }

}

