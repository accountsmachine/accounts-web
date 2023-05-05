import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { VatService } from '../vat.service';

@Component({
    selector: 'vat-period',
    templateUrl: './period.component.html',
    styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {

    form = this.fb.group({
	period_key: ['', [Validators.required]],
    });

    config : any = {};

    // FIXME: Should subscribe to vat.
    obligations : any = [];

    constructor(
	private route : ActivatedRoute,
	private snackBar : MatSnackBar,
	private filing : VatConfigService,
	private vat : VatService,
	private fb : FormBuilder,
	public working : WorkingService,
    ) {

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();

		    if (this.config.company) {

			this.working.start();

			this.vat.getOpenObligations(
			    this.config.company
			).subscribe({
			    next: obl => {
			    	this.obligations = obl;
				this.working.stop();
			    },
			    error: err => {
				this.working.stop();
			    },
			    complete: () => {
			    },
			});
		    }

		});
	    }
	);

    }

    ngOnInit() : void {
    }

    load() {
	this.form.patchValue({
	    period_key: this.config.period_key,
	});
    }

    submit() {

	this.config.period_key = this.form.value.period_key;

	for(var ob of this.obligations) {
	    if (ob.periodKey == this.config.period_key) {
		this.config.start = ob.start;
		this.config.end = ob.end;
		this.config.due = ob.due;
	    }
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

