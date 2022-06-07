import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'business-config',
    templateUrl: './business-config.component.html',
    styleUrls: ['./business-config.component.scss']
})
export class BusinessConfigComponent implements OnInit {

    readonly chipSeparatorKeysCodes = [ENTER, COMMA] as const;

    form = this.fb.group({
	company_name: ['', [Validators.required]],
	company_number: [{value: '', disabled: true}, [
	    Validators.required, Validators.pattern("[0-9]{8}")
	]],
	registration_date: ['', [Validators.required]],
	country: ['', [Validators.required]],
	form: ['', [Validators.required]],
	is_dormant: [false, [Validators.required]],
	directors: [],
	jurisdiction: ['', [Validators.required]],
    });

    constructor(
	private route : ActivatedRoute,
	private state: CompanyService,
	private snackBar: MatSnackBar,
	private fb: UntypedFormBuilder,
	private working : WorkingService,
    ) {
	this.company = new Company();
    }

    company : Company;

    to_date(d : any) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    company_name: this.company.company_name,
	    company_number: this.company.company_number,
	    registration_date: this.to_date(this.company.registration_date),
	    country: this.company.country,
	    form: this.company.form,
	    is_dormant: this.company.is_dormant,
	    jurisdiction: this.company.jurisdiction,
	});

	this.directors.setValue(this.company.directors);
	this.directors.updateValueAndValidity();

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

    from_date(d : any) {
	return d.format("YYYY-MM-DD");
    }

    public submit() {
	this.company.company_name = this.form.value.company_name;

	// Convert date to ISO string.
	this.company.registration_date =
	    this.from_date(this.form.value.registration_date);

	this.company.country = this.form.value.country;
	this.company.form = this.form.value.form;
	this.company.is_dormant = this.form.value.is_dormant;
	this.company.directors = this.directors.value;
	this.company.jurisdiction = this.form.value.jurisdiction;

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

    addDirector(event: MatChipInputEvent): void {
	const value = (event.value || '').trim();

	if (value) {
	    this.directors.setValue([...this.directors.value, value]);
	    this.directors.updateValueAndValidity();
	}

	// Clear the input value
	event.chipInput!.clear();

    }

    removeDirector(value: string): void {

	const index = this.directors.value.indexOf(value);

	if (index >= 0) {
	    this.directors.value.splice(index, 1);
	    this.directors.updateValueAndValidity();
	}

    }

    get directors() {
	return this.form.get("directors")!;
    }
    
}

