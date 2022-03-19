import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as moment from 'moment';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';

@Component({
    selector: 'corptax-periods',
    templateUrl: './periods.component.html',
    styleUrls: ['./periods.component.scss']
})
export class PeriodsComponent implements OnInit {

    form = this.fb.group({
	period_start_date: ['', [Validators.required]],
	period_end_date: ['', [Validators.required]],
//	prev_start_date: ['', [Validators.required]],
//	prev_end_date: ['', [Validators.required]],
    });

    config : any = {};

    constructor(
	private route : ActivatedRoute,
	private snackBar : MatSnackBar,
	private filing : CorptaxConfigService,
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
//	    prev_start_date: this.to_date(this.config.prev_start_date),
//	    prev_end_date: this.to_date(this.config.prev_end_date),
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

	this.config.period_name = this.form.value.period_start_date.format("YYYY");

	var eop_date = moment(this.form.value.period_start_date);
	var son_date = moment(this.form.value.period_start_date);
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
	    eop_date = this.form.value.period_end_date;
	    one_fy = true;
	} else {
	    // Previous year
	    eop_date.month(3);
	    eop_date.date(5);
	    son_date.month(3);
	    son_date.date(6);
	}

	if (son_date && (son_date > this.form.value.period_end_date)) {
	    one_fy = true;
	}

	this.config.fy1 = {
	    name: this.form.value.period_start_date.format("YYYY"),
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
	    (e : any) => {
		this.snackBar.open("Configuration saved", "dismiss",
				   { duration: 5000 });
	    }
	)

    }

    revert() {
    }

}

