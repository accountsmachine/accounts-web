import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { CompanyService, Company } from '../../company/company.service';
import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'accounts-authorisation',
    templateUrl: './authorisation.component.html',
    styleUrls: ['./authorisation.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatHint, MatSelect, MatOption, MatButton]
})
export class AuthorisationComponent {
    private route = inject(ActivatedRoute);
    private companyService = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private filing = inject(AccountsConfigService);
    private fb = inject(FormBuilder);


    company : Company | null = null;

    directors : { ix : number, name : string }[] = [];

    form = this.fb.group({
	report_date: ['' as string | moment.Moment, [Validators.required]],
	authorisation_date: ['' as string | moment.Moment, [Validators.required]],
	balance_sheet_date: ['' as string | moment.Moment, [Validators.required]],
	director_authorising: ['', [Validators.required]],
    });

    config : AccountsConfig = {};

    constructor() {


	this.companyService.onload().subscribe((e : Company | null) => {

	    if (e == null) return;

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

    to_date(d : string | undefined) {
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

    from_date(d : moment.Moment) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.filing.report_date =
	    this.from_date(this.form.value.report_date as moment.Moment);
	this.filing.authorisation_date =
	    this.from_date(this.form.value.authorisation_date as moment.Moment);
	this.filing.balance_sheet_date =
	    this.from_date(this.form.value.balance_sheet_date as moment.Moment);

	this.filing.director_authorising = this.form.value.director_authorising;

	for (const dir of this.directors) {
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

