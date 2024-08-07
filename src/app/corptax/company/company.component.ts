import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';
import { CompanyService, Company, Companies } from '../../company/company.service';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';

@Component({
    selector: 'corptax-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

    companies : Companies = {};

    form = this.fb.group({
    	company: ['', [Validators.required]],
    });

    config : any = {};

    constructor(
	private route : ActivatedRoute,
	private companyService : CompanyService,
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

	this.companyService.get_list().subscribe(
	    e => {
		this.companies = e;
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
	    company: this.config.company,
	});
    }

    from_date(d : any) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.company = this.form.value.company;

	this.filing.save().subscribe(
	    e => {
		this.snackBar.open("Configuration saved", "dismiss",
				   { duration: 5000 });
	    }
	)
    }

    revert() {
    }

}

