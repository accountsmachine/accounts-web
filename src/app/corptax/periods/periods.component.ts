import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'corptax-periods',
    templateUrl: './periods.component.html',
    styleUrls: ['./periods.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatHint, MatButton]
})
export class PeriodsComponent {
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private filing = inject(CorptaxConfigService);


    // FIXME: What type?
    form = new FormGroup({
	period_start_date: new FormControl<moment.Moment | string>('', [Validators.required]),
	period_end_date: new FormControl<moment.Moment | string>('', [Validators.required]),
    });

    config : CorptaxConfig = {};

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
//	    prev_start_date: this.to_date(this.config.prev_start_date),
//	    prev_end_date: this.to_date(this.config.prev_end_date),
	});
    }

    from_date(d : moment.Moment) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	const start = this.form.value.period_start_date as moment.Moment;
	const end = this.form.value.period_end_date as moment.Moment;

	this.config.period_start_date =
	    this.from_date(start);
	this.config.period_end_date =
	    this.from_date(end);

	this.config.period_name = start.format("YYYY");

	let eop_date = moment(start);
	const son_date = moment(start);
	let one_fy = false;

	if (son_date.month() > 3) {
	    // Next year
	    eop_date.year(eop_date.year() + 1);
	    eop_date.month(3);
	    eop_date.date(5);
	    son_date.year(son_date.year() + 1);
	    son_date.month(3);
	    son_date.date(6);
	} else if (son_date.month() == 3 && son_date.date() > 6) {
	    // Next year
	    eop_date.year(eop_date.year() + 1);
	    eop_date.month(3);
	    eop_date.date(5);
	    son_date.year(son_date.year() + 1);
	    son_date.month(3);
	    son_date.date(6);
	} else if (son_date.month() == 3 && son_date.date() == 6) {
	    eop_date = moment(end);
	    one_fy = true;
	} else {
	    // Previous year
	    eop_date.month(3);
	    eop_date.date(5);
	    son_date.month(3);
	    son_date.date(6);
	}

	if (son_date && (son_date > end)) {
	    one_fy = true;
	}

	this.config.fy1 = {
	    name: start.format("YYYY"),
	    start: this.config.period_start_date,
	    end: this.from_date(eop_date),
	};

	if (!one_fy) {
	    this.config.fy2 = {
		name: son_date.format("YYYY"),
		start: this.from_date(son_date),
		end: this.config.period_end_date,
	    };
	}

	this.filing.save().subscribe(
	    () => {
		this.snackBar.open("Configuration saved", "dismiss",
				   { duration: 5000 });
	    }
	)

    }

    revert() {
    }

}

