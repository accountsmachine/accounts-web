import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';

@Component({
    selector: 'accounts-periods',
    templateUrl: './periods.component.html',
    styleUrls: ['./periods.component.scss']
})
export class PeriodsComponent implements OnInit {

    form = this.fb.group({
	period_start_date: ['' as any, [Validators.required]],
	period_end_date: ['' as any, [Validators.required]],
	prev_start_date: ['' as any, [Validators.required]],
	prev_end_date: ['' as any, [Validators.required]],
    });

    config : any = {};

    constructor(
	private route : ActivatedRoute,
	private snackBar : MatSnackBar,
	private filing : AccountsConfigService,
	private fb : FormBuilder,
    ) {

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();
		});
	    }
	);

    }

    ngOnInit() : void {
    }

    to_date(d : any) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    period_start_date: this.to_date(this.config.period_start_date),
	    period_end_date: this.to_date(this.config.period_end_date),
	    prev_start_date: this.to_date(this.config.prev_start_date),
	    prev_end_date: this.to_date(this.config.prev_end_date),
	});
    }

    from_date(d : any) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.period_start_date =
	    this.from_date(this.form.value.period_start_date);
	this.config.period_end_date =
	    this.from_date(this.form.value.period_end_date);
	this.config.prev_start_date =
	    this.from_date(this.form.value.prev_start_date);
	this.config.prev_end_date =
	    this.from_date(this.form.value.prev_end_date);

	this.config.period_name = this.form.value.period_start_date.format("YYYY");
	this.config.prev_name = this.form.value.prev_start_date.format("YYYY");

	this.filing.save().subscribe(
	    () => {
		this.snackBar.open("Configuration saved",
				   "dismiss",
				   { duration: 5000 });
	    }
	);

    }

    revert() {
    }

    start_change() {

	// For some reason, the default date is today.
	let now = this.from_date(moment());

	if (now == this.from_date(this.form.value.period_end_date)) {
	    let e = this.form.value.period_start_date.clone();
	    e = e.add(1, 'year');
	    e = e.subtract(1, 'day');
	    this.form.patchValue({
		period_end_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_start_date)) {
	    let e = this.form.value.period_start_date.clone();
	    e = e.subtract(1, 'year');
	    this.form.patchValue({
		prev_start_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_end_date)) {
	    let e = this.form.value.period_start_date.clone();
	    e = e.subtract(1, 'day');
	    this.form.patchValue({
		prev_end_date: e
	    });
	}
	
    }

    end_change() {

	// For some reason, the default date is today.
	let now = this.from_date(moment());

	if (now == this.from_date(this.form.value.period_start_date)) {
	    let e = this.form.value.period_end_date.clone();
	    e = e.subtract(1, 'year');
	    e = e.add(1, 'day');
	    this.form.patchValue({
		period_start_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_start_date)) {
	    let e = this.form.value.period_start_date.clone();
	    e = e.subtract(1, 'year');
	    this.form.patchValue({
		prev_start_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_end_date)) {
	    let e = this.form.value.period_start_date.clone();
	    e = e.subtract(1, 'day');
	    this.form.patchValue({
		prev_end_date: e
	    });
	}

    }

}

