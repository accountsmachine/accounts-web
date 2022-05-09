import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';

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
	private working : WorkingService,
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
		    this.working.start();
		    this.state.load(params["id"]).subscribe({
			next: (c) => {
			    this.working.stop();
			    if (c) {
		    		this.company = c;
				this.load();
			    }
			},
			error: (e) => {
			    this.working.stop();
			}
		    });
		}
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

	this.working.start();

	this.state.save().subscribe({
	    next: (e) => { this.working.stop(); this.success(); },
	    error: (e) => { this.working.stop(); },
	    complete: () => {},
	});

    }

    public revert() {
	this.load();
    }

}

