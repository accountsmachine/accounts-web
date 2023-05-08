import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import * as moment from 'moment';

import { CompanyService, Company, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { ConfigurationService } from '../../configuration.service';
import { CalculationService, Calculation } from '../calculation.service';

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent {

    debug : string = "debug";

    record : Calculation = new Calculation();

    companies : Companies = {};

    id : string = "";
    config : any = {};

    company : any = {};

    get_config(id : string) {

	this.working.start();

	this.filing.load(id).subscribe({

	    next: e => {

		this.working.stop();

                if (e.config.company) {
		    this.get_company(e.config.company);
		} else {
		    this.company = {};
		}

		this.id = e.id;
	    	this.config = e.config;

		this.get_comps(e.id);
	    },

	    error: e => {

		this.working.stop();

		this.id = "";
		this.config = {};
	    }

	});

    }

    get_company(id : string) {

	this.working.start();

	this.companyService.load(id).subscribe({

	    next: c => {
		this.working.stop();
		this.company = c;
	    },

	    error: e => {
		this.working.stop();
		this.company = {};
	    },

	});
    }

    get_comps(id : string) {

	this.working.start();

	this.calcs.load(id).subscribe({

	    next: record => {
		this.working.stop();
		this.load_comps(record);
	    },

	    error: e => {
		this.working.stop();
		this.record = new Calculation();
	    }

	});

    }

    load_comps(record : Calculation) {

	console.log(record);

	this.debug = JSON.stringify(record, null, 4);
	this.record = record;

    }

    constructor(
	private route : ActivatedRoute,
	private filing : VatConfigService,
	private companyService : CompanyService,
	private router : Router,
	private calcs : CalculationService,
	private working : WorkingService,
	private configSvc : ConfigurationService,
    ) {

	this.route.params.subscribe(params => {
	    this.get_config(params["id"]);
	});
    }

    ngOnInit() : void {
    }

}

