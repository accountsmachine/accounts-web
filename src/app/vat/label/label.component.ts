import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';

@Component({
    selector: 'label',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {

    form = this.fb.group({
	label: ['', [Validators.required]],
    });

    config : any = {};

    constructor(
	private route : ActivatedRoute,
	private snackBar : MatSnackBar,
	private filing : VatConfigService,
	private fb : FormBuilder,
	public working : WorkingService,
    ) {

	this.route.params.subscribe(
	    params => {

		this.working.start();

		this.filing.load(params["id"]).subscribe({
		    next: e => {
			this.config = e.config;
			this.load();
			this.working.stop();
		    },
		    error: err => {
			this.working.stop();
		    },
		    complete: () => {
		    },
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
	    label: this.config.label,
	});
    }

    from_date(d : any) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.label = this.form.value.label;

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

}

