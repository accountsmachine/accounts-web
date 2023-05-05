import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'activities-config',
    templateUrl: './activities-config.component.html',
    styleUrls: ['./activities-config.component.scss']
})
export class ActivitiesConfigComponent implements OnInit {

    readonly chipSeparatorKeysCodes = [ENTER, COMMA] as const;

    form = new FormGroup({
	sector: new FormControl('', [Validators.required]),
	activities: new FormControl<string>('', [Validators.required]),
	sic_codes: new FormControl<string[]>([]),
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

	if (this.form.value.sector)
	    this.company.sector = this.form.value.sector;
	else
	    this.company.sector = "";

	if (this.form.value.activities)
	    this.company.activities = this.form.value.activities;
	else
	    this.company.activities = "";

	if (this.sic_codes.value)
	    this.company.sic_codes = this.sic_codes.value;
	else
	    this.company.sic_codes = [];

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

    addSIC(event: MatChipInputEvent): void {

	if (this.sic_codes.value) {

	    const value = (event.value || '').trim();

	    if (value) {
		this.sic_codes.setValue([...this.sic_codes.value, value]);
		this.sic_codes.updateValueAndValidity();
	    }

	    // Clear the input value
	    event.chipInput!.clear();

	}

    }

    removeSIC(value: string): void {

	if (this.sic_codes.value) {

	    const index = this.sic_codes.value.indexOf(value);

	    if (index >= 0) {
		this.sic_codes.value.splice(index, 1);
		this.sic_codes.updateValueAndValidity();
	    }

	}

    }

    get sic_codes() {
	return this.form.get("sic_codes")!;
    }
    
}

