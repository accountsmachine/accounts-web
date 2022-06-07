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
    selector: 'accounts-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

    companies : Companies = {};
    company : Company | null = null;

    form = this.fb.group({
    	company: ['', [Validators.required]],
    });

    config : any = {};

    constructor(
	private route : ActivatedRoute,
	private companyService : CompanyService,
	private snackBar : MatSnackBar,
	private filing : AccountsConfigService,
	private fb : FormBuilder,
    ) {

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

    ngOnInit() : void {
    }

    to_date(d : any) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    company: this.config.company,
	});
    }

    from_date(d : any) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.company = this.form.value.company;

	this.filing.save().subscribe(
	    () => {
		this.snackBar.open("Configuration saved",
				   "dismiss",
				   { duration: 5000 });
	    }
	);

    }

    observations : String[] = [];

    revert() {
    }

}

