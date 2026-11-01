import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { CompanyService, Company, Companies } from '../../company/company.service';
import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { KeyValuePipe } from '@angular/common';

@Component({
    selector: 'accounts-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatHint, MatButton, KeyValuePipe]
})
export class CompanyComponent {
    private route = inject(ActivatedRoute);
    private companyService = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private filing = inject(AccountsConfigService);
    private fb = inject(FormBuilder);


    companies : Companies = {};
    company : Company | null = null;

    form = this.fb.group({
    	company: ['', [Validators.required]],
    });

    config : AccountsConfig = {};

    constructor() {

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();
		    if (this.config.company)
		    	this.companyService.load(this.config.company);
		});
	    }
	);

	this.companyService.get_list().subscribe(
	    e => {
		this.companies = e;
	    }
	);

	this.companyService.onload().subscribe((e : Company | null) => {
	    if (e)
	    this.company = e;
	});

    }

    to_date(d : string | undefined) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    company: this.config.company,
	});
    }

    from_date(d : moment.Moment) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.company = this.form.value.company ?? undefined;

	this.filing.save().subscribe(
	    () => {
		this.snackBar.open("Configuration saved",
				   "dismiss",
				   { duration: 5000 });
	    }
	);

    }

    observations : string[] = [];

    revert() {
    }

}

