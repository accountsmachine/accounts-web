import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';

@Component({
  selector: 'address-config',
  templateUrl: './address-config.component.html',
  styleUrls: ['./address-config.component.scss']
})
export class AddressConfigComponent implements OnInit {

    form = this.fb.group({
	contact_name: ['', [Validators.required]],
	contact_address0: ['', [Validators.required]],
	contact_address1: [''],
	contact_address2: [''],
	contact_city: ['', [Validators.required]],
	contact_county: ['', [Validators.required]],
	contact_country: ['', [Validators.required]],
	contact_postcode: ['', [Validators.required]],
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
	    contact_name: this.company.contact_name,
	    contact_city: this.company.contact_city,
	    contact_county: this.company.contact_county,
	    contact_country: this.company.contact_country,
	    contact_postcode: this.company.contact_postcode,
	});

	for(var i = 0; i < 3; i++) {
	    if (this.company.contact_address.length > i) {
		this.form.get("contact_address" + i)!.setValue(
		    this.company.contact_address[i]
		);
	    } else {
		this.form.get("contact_address" + i)!.setValue("");
	    }
	}

    }

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.state.load(params["id"]).subscribe(c => {
			if (c) {
			    this.company = c;
			    this.load();
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
	this.company.contact_name = this.form.value.contact_name;
	this.company.contact_address = [];
	if (this.form.value.contact_address0)
	    this.company.contact_address.push(this.form.value.contact_address0);
	if (this.form.value.contact_address1)
	    this.company.contact_address.push(this.form.value.contact_address1);
	if (this.form.value.contact_address2)
	    this.company.contact_address.push(this.form.value.contact_address2);
	this.company.contact_city = this.form.value.contact_city;
	this.company.contact_county = this.form.value.contact_county;
	this.company.contact_country = this.form.value.contact_country;
	this.company.contact_postcode = this.form.value.contact_postcode;

	this.state.save().subscribe(
	    e => this.success()
	);
    }

    public revert() {
	this.load();
    }

}

