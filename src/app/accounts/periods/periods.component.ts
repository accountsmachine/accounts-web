import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'accounts-periods',
    templateUrl: './periods.component.html',
    styleUrls: ['./periods.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatHint, MatButton]
})
export class PeriodsComponent {
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private filing = inject(AccountsConfigService);
    private fb = inject(FormBuilder);


    form = this.fb.group({
	period_start_date: ['' as string | moment.Moment, [Validators.required]],
	period_end_date: ['' as string | moment.Moment, [Validators.required]],
	prev_start_date: ['' as string | moment.Moment, [Validators.required]],
	prev_end_date: ['' as string | moment.Moment, [Validators.required]],
    });

    config : AccountsConfig = {};

    constructor() {

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();
		});
	    }
	);

    }

    to_date(d : string | undefined) {
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

    from_date(d : string | moment.Moment | null | undefined) {
	return moment(d ?? undefined).format("YYYY-MM-DD");
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

	this.config.period_name = (this.form.value.period_start_date as moment.Moment).format("YYYY");
	this.config.prev_name = (this.form.value.prev_start_date as moment.Moment).format("YYYY");

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
	const now = this.from_date(moment());

	if (now == this.from_date(this.form.value.period_end_date)) {
	    let e = (this.form.value.period_start_date as moment.Moment).clone();
	    e = e.add(1, 'year');
	    e = e.subtract(1, 'day');
	    this.form.patchValue({
		period_end_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_start_date)) {
	    let e = (this.form.value.period_start_date as moment.Moment).clone();
	    e = e.subtract(1, 'year');
	    this.form.patchValue({
		prev_start_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_end_date)) {
	    let e = (this.form.value.period_start_date as moment.Moment).clone();
	    e = e.subtract(1, 'day');
	    this.form.patchValue({
		prev_end_date: e
	    });
	}
	
    }

    end_change() {

	// For some reason, the default date is today.
	const now = this.from_date(moment());

	if (now == this.from_date(this.form.value.period_start_date)) {
	    let e = (this.form.value.period_end_date as moment.Moment).clone();
	    e = e.subtract(1, 'year');
	    e = e.add(1, 'day');
	    this.form.patchValue({
		period_start_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_start_date)) {
	    let e = (this.form.value.period_start_date as moment.Moment).clone();
	    e = e.subtract(1, 'year');
	    this.form.patchValue({
		prev_start_date: e
	    });
	}
	
	if (now == this.from_date(this.form.value.prev_end_date)) {
	    let e = (this.form.value.period_start_date as moment.Moment).clone();
	    e = e.subtract(1, 'day');
	    this.form.patchValue({
		prev_end_date: e
	    });
	}

    }

}

