import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';

@Component({
    selector: 'activities-config',
    templateUrl: './activities-config.component.html',
    styleUrls: ['./activities-config.component.scss']
})
export class ActivitiesConfigComponent implements OnInit {

    readonly chipSeparatorKeysCodes = [ENTER, COMMA] as const;

    form = this.fb.group({
	sector: ['', [Validators.required]],
	activities: ['', [Validators.required]],
	sic_codes: [],
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
	    sector: this.company.sector,
	    activities: this.company.activities,
	});

	this.sic_codes.setValue(this.company.sic_codes);
	this.sic_codes.updateValueAndValidity();

    }

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.state.load(params["id"]);
		}
	    }
	);

	this.state.onload().subscribe(
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
	this.company.sector = this.form.value.sector;
	this.company.activities = this.form.value.activities;
	this.company.sic_codes = this.sic_codes.value;

	this.state.save().subscribe(
	    e => this.success()
	);
    }

    public revert() {
	this.load();
    }

    addSIC(event: MatChipInputEvent): void {
	const value = (event.value || '').trim();

	if (value) {
	    this.sic_codes.setValue([...this.sic_codes.value, value]);
	    this.sic_codes.updateValueAndValidity();
	}

	// Clear the input value
	event.chipInput!.clear();

    }

    removeSIC(value: string): void {

	const index = this.sic_codes.value.indexOf(value);

	if (index >= 0) {
	    this.sic_codes.value.splice(index, 1);
	    this.sic_codes.updateValueAndValidity();
	}

    }

    get sic_codes() {
	return this.form.get("sic_codes")!;
    }
    
}

