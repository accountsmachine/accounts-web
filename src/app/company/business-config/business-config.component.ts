import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'business-config',
    templateUrl: './business-config.component.html',
    styleUrls: ['./business-config.component.scss']
})
export class BusinessConfigComponent implements OnInit {

    readonly chipSeparatorKeysCodes = [ENTER, COMMA] as const;

    form = new FormGroup({
	company_name: new FormControl('', [Validators.required]),
	company_number: new FormControl({value: '', disabled: true}, [
//	    Validators.required, Validators.pattern("[0-9]{8}")
	]),
	registration_date: new FormControl<any>('', [Validators.required]),
	owner: new FormControl('', []),
	country: new FormControl('', []),
	form: new FormControl('', []),
	is_dormant: new FormControl<boolean>(false, []),
	directors: new FormControl<string[]>([]),
	jurisdiction: new FormControl<string>('', []),
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

    to_date(d : any) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    company_name: this.company.company_name,
	    company_number: this.company.company_number,
	    registration_date: this.to_date(this.company.registration_date),
	    owner: this.company.owner,
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

	if (this.form.value.company_name)
	    this.company.company_name = this.form.value.company_name;
	else
	    this.company.company_name = "";

	// Convert date to ISO string.
	this.company.registration_date =
	    this.from_date(this.form.value.registration_date);

	if (this.form.value.country)
	    this.company.country = this.form.value.country;
	else
	    this.company.country = "";

	if (this.form.value.owner)
	    this.company.owner = this.form.value.owner;
	else
	    this.company.owner = "";

	if (this.form.value.form)
	    this.company.form = this.form.value.form;
	else
	    this.company.form = "";

	if (this.form.value.is_dormant)
	    this.company.is_dormant = this.form.value.is_dormant;
	else
	    this.company.is_dormant = false;

	if (this.directors.value)
	    this.company.directors = this.directors.value;
	else
	    this.company.directors = [];

	if (this.form.value.jurisdiction)
	    this.company.jurisdiction = this.form.value.jurisdiction;
	else
	    this.company.jurisdiction = "";

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

	if (this.directors && this.directors.value) {

	    const value = (event.value || '').trim();

	    if (value) {
		this.directors.setValue([...this.directors.value, value]);
		this.directors.updateValueAndValidity();
	    }

	    // Clear the input value
	    event.chipInput!.clear();

	}

    }

    removeDirector(value: string): void {

	if (this.directors.value) {

	    const index = this.directors.value.indexOf(value);

	    if (index >= 0) {
		this.directors.value.splice(index, 1);
		this.directors.updateValueAndValidity();
	    }

	}

    }

    get directors() {
	return this.form.get("directors")!;
    }
    
}

