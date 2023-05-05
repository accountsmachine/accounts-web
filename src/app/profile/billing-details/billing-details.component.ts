
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Validators } from '@angular/forms';
import { UserProfile, UserProfileService } from '../user-profile.service';

@Component({
    selector: 'app-billing-details',
    templateUrl: './billing-details.component.html',
    styleUrls: ['./billing-details.component.scss']
})
export class BillingDetailsComponent implements OnInit {
/*
    form = this.fb.group({
	billing_name: ['', [Validators.required]],
	billing_address0: ['', [Validators.required]],
	billing_address1: [''],
	billing_address2: [''],
	billing_city: ['', [Validators.required]],
	billing_county: [''],
	billing_country: ['', [Validators.required]],
	billing_postcode: ['', [Validators.required]],
	billing_email: ['', [Validators.required]],
	billing_tel: ['', [Validators.required]],
	billing_vat: [''],
    });
*/
    form = new FormGroup({
	billing_name: new FormControl<string | null>('', [Validators.required]),
	billing_address0: new FormControl<string>('', [Validators.required]),
	billing_address1: new FormControl<string>(''),
	billing_address2: new FormControl<string>(''),
	billing_city: new FormControl('', [Validators.required]),
	billing_county: new FormControl(''),
	billing_country: new FormControl('', [Validators.required]),
	billing_postcode: new FormControl('', [Validators.required]),
	billing_email: new FormControl('', [Validators.required]),
	billing_tel: new FormControl('', [Validators.required]),
	billing_vat: new FormControl<string | null>(''),
    });

    profile : UserProfile = new UserProfile();

    load() {

	this.form.patchValue({
	    billing_name: this.profile.billing_name,
	    billing_city: this.profile.billing_city,
	    billing_county: this.profile.billing_county,
	    billing_country: this.profile.billing_country,
	    billing_postcode: this.profile.billing_postcode,
	    billing_email: this.profile.billing_email,
	    billing_tel: this.profile.billing_tel,
	    billing_vat: this.profile.billing_vat,
	});

	for(var i = 0; i < 3; i++) {
	    if (this.profile.billing_address.length > i) {
		this.form.get("billing_address" + i)!.setValue(
		    this.profile.billing_address[i]
		);
	    } else {
		this.form.get("billing_address" + i)!.setValue("");
	    }
	}

    }

    constructor(
	private snackBar: MatSnackBar,
	private fb: FormBuilder,
	private profileSvc : UserProfileService,
    ) {
    }

    ngOnInit(): void {
	this.profileSvc.load().subscribe({
	    next: prof => {
		this.profile = prof;
		this.load();
	    }
	});
    }

    public success() {
	let snack = this.snackBar.open("Profile saved", "dismiss",
				       { duration: 5000 });
    }

    public submit() {

	if (this.form.value.billing_name)
	    this.profile.billing_name = this.form.value.billing_name;
	else
	    this.profile.billing_name = "";

	this.profile.billing_address = [];
	if (this.form.value.billing_address0)
	    this.profile.billing_address.push(this.form.value.billing_address0);
	if (this.form.value.billing_address1)
	    this.profile.billing_address.push(this.form.value.billing_address1);
	if (this.form.value.billing_address2)
	    this.profile.billing_address.push(this.form.value.billing_address2);

	if (this.form.value.billing_city)
	    this.profile.billing_city = this.form.value.billing_city;
	else
	    this.profile.billing_city = "";

	if (this.form.value.billing_county)
	    this.profile.billing_county = this.form.value.billing_county;
	else
	    this.profile.billing_county = "";

	if (this.form.value.billing_country)
	    this.profile.billing_country = this.form.value.billing_country;
	else
	    this.profile.billing_country = "";

	if (this.form.value.billing_postcode)
	    this.profile.billing_postcode = this.form.value.billing_postcode;
	else
	    this.profile.billing_postcode = "";

	if (this.form.value.billing_email)
	    this.profile.billing_email = this.form.value.billing_email;
	else
	    this.profile.billing_email = "";

	if (this.form.value.billing_tel)
	    this.profile.billing_tel = this.form.value.billing_tel;
	else
	    this.profile.billing_tel = "";

	if (this.form.value.billing_vat)
	    this.profile.billing_vat = this.form.value.billing_vat;
	else
	    this.profile.billing_vat = "";

	this.profileSvc.save().subscribe(
	    e => this.success()
	);

    }

    public revert() {
	this.load();
    }

}

