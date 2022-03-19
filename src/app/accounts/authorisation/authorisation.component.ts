import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as moment from 'moment';

import { CompanyService, Company, Companies } from '../../company/company.service';
import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';

@Component({
    selector: 'accounts-authorisation',
    templateUrl: './authorisation.component.html',
    styleUrls: ['./authorisation.component.scss']
})
export class AuthorisationComponent implements OnInit {

    company : Company | null = null;

    directors : { ix : number, name : string }[] = [];

    form = this.fb.group({
	report_date: ['', [Validators.required]],
	authorisation_date: ['', [Validators.required]],
	balance_sheet_date: ['', [Validators.required]],
	director_authorising: ['', [Validators.required]],
    });

    config : AccountsConfig = {};

    constructor(
	private route : ActivatedRoute,
	private companyService : CompanyService,
	private snackBar : MatSnackBar,
	private filing : AccountsConfigService,
	private fb : FormBuilder,
    ) {


	this.companyService.subscribe((e : Company) => {
	    this.company = e;

	    this.directors = [];
	    for (let i = 0; i < e.directors.length; i++) {
		this.directors.push(
		    {
			ix: i,
			name: e.directors[i]
		    }
		);
	    }

	});

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();
		    if (this.config.company) {
			this.companyService.load(this.config.company);
		    }
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

	if (!this.config.report_date) {
	    if (this.config.period_end_date) {
		this.config.report_date =
		    this.config.period_end_date;
	    }
	}

	if (!this.config.authorisation_date) {
	    if (this.config.period_end_date) {
		this.config.authorisation_date =
		    this.config.period_end_date;
	    }
	}

	if (!this.config.balance_sheet_date) {
	    if (this.config.period_end_date) {
		this.config.balance_sheet_date =
		    this.config.period_end_date;
	    }
	}

	this.form.patchValue({
	    report_date: this.to_date(this.config.report_date),
	    authorisation_date: this.to_date(this.config.authorisation_date),
	    balance_sheet_date: this.to_date(this.config.balance_sheet_date),
	    director_authorising: this.config.director_authorising,
	});
    }

    from_date(d : any) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.filing.report_date =
	    this.from_date(this.form.value.report_date);
	this.filing.authorisation_date =
	    this.from_date(this.form.value.authorisation_date);
	this.filing.balance_sheet_date =
	    this.from_date(this.form.value.balance_sheet_date);

	this.filing.director_authorising = this.form.value.director_authorising;

	for (let dir of this.directors) {
	    if (this.form.value.director_authorising == dir.name) {
		this.filing.director_authorising_ord = dir.ix + 1;
	    }
	}

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

