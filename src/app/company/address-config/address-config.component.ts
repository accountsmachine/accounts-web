import { Component, OnInit } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';

@Component({
  selector: 'address-config',
  templateUrl: './address-config.component.html',
  styleUrls: ['./address-config.component.scss']
})
export class AddressConfigComponent implements OnInit {

    form = new FormGroup({
	contact_name: new FormControl<string>('', [Validators.required]),
	contact_address0: new FormControl<string>('', [Validators.required]),
	contact_address1: new FormControl<string>(''),
	contact_address2: new FormControl<string>(''),
	contact_city: new FormControl<string>('', [Validators.required]),

	// County is considered optional in addresses
	contact_county: new FormControl<string>('', []),
	contact_country: new FormControl<string>('', [Validators.required]),
	contact_postcode: new FormControl<string>('', [Validators.required]),
    });

    constructor(
	private route : ActivatedRoute,
	private state: CompanyService,
	private snackBar: MatSnackBar,
	private working : WorkingService,
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
    	if (this.form.value.contact_name)
	    this.company.contact_name = this.form.value.contact_name;
	else
	    this.company.contact_name = "";
	
	this.company.contact_address = [];
	if (this.form.value.contact_address0)
	    this.company.contact_address.push(this.form.value.contact_address0);
	if (this.form.value.contact_address1)
	    this.company.contact_address.push(this.form.value.contact_address1);
	if (this.form.value.contact_address2)
	    this.company.contact_address.push(this.form.value.contact_address2);

	if (this.form.value.contact_city)
	    this.company.contact_city = this.form.value.contact_city;
	else
	    this.company.contact_city = "";
	
	if (this.form.value.contact_county)
	    this.company.contact_county = this.form.value.contact_county;
	else
	    this.company.contact_county = "";
	
	if (this.form.value.contact_country)
	    this.company.contact_country = this.form.value.contact_country;
	else
	    this.company.contact_country = "";
	
	if (this.form.value.contact_postcode)
	    this.company.contact_postcode = this.form.value.contact_postcode;
	else
	    this.company.contact_postcode = "";

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

