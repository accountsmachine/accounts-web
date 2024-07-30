import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import moment from 'moment';

import { CompanyService, Company, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';

@Component({
    selector: 'vat-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

    companies : Companies = {};

    form = this.fb.group({
    	company: ['', [Validators.required]],
    });

    id = "";
    config : any = {};

    constructor(
	private route : ActivatedRoute,
	private router : Router,
	private companyService : CompanyService,
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
			this.working.stop();
			this.id = params["id"];
			if (e.config.state != "draft")
			    this.router.navigate(
				["/vat/" + this.id + "/report"]
			    );
			this.config = e.config;
			this.load();
		    },
		    error: err => {
			this.working.stop();
		    },
		    complete: () => {
		    },
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

