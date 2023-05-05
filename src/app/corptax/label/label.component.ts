import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as moment from 'moment';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';

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

