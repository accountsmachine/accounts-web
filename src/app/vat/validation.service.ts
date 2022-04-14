
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { VatConfig } from './vat-config';
import { VatConfigService } from './vat-config.service';
import { Company, CompanyService } from '../company/company.service';
import { CommerceService } from '../commerce/commerce.service';
import { Balance } from '../commerce/commerce.model';
import { StatusService } from '../status/status.service';

export class ValidationError {
    constructor(
	public id : string,
	public description : string,
	public kind : string,
	public href? : string,
    ) {
    }
};

// FIXME: Lots of events, debounce?

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    errors : ValidationError[] = [];

    id : string = "";
    config : any = {};
    company : any = {};
    balance : Balance;
    status : any;

    constructor(
	private filing : VatConfigService,
	private companyService : CompanyService,
	private commerce : CommerceService,
	private statusService : StatusService,
    ) {
 	this.balance = {
	    email: "", uid: "", credits: { vat: 0, corptax: 0, accounts: 0 }
	};
   }

    load(id : string) {

	this.id = id;

	this.filing.load(id).subscribe(e => {

	    this.config = e.config;

	    if ("company" in this.config) {
		this.company = {};
		this.companyService.load(this.config.company).subscribe(
		    cmp => {
			this.company = cmp;
			this.validate();
		    }
		);
		this.statusService.get(this.config.company).subscribe(
		    st => {
			console.log(st);
			this.status = st;
			this.validate();
		    }
		);
	    } else {
		this.company = {};
	    }

	    this.validate();
	});

    }

    validate() {

	let errors = [];

	if (this.balance && this.balance.credits &&
	    this.balance.credits["vat"] < 1) {
	    errors.push(
		new ValidationError(
		    "COMM",
		    "You have no VAT filing credits - " +
		    "purchase credits to file this return",
		    "INFO",
		    "/commerce/purchase",
		)
	    );
	}

	if (this.company && !this.company.company_name) {
	    errors.push(
		new ValidationError(
		    "CNAME",
		    "The company configuration does not define a company name",
		    "ERROR",
		    "/company/" + this.config.company + "/business"
		)
	    );
	}

	if (this.company && !this.company.vrn) {
	    errors.push(
		new ValidationError(
		    "VRN",
		    "You must provide a company VAT registration number",
		    "ERROR",
		    "/company/" + this.config.company + "/tax"
		)
	    );
	}

	if (!this.config.due) {
	    errors.push(
		new ValidationError(
		    "PERD",
		    "There is no period start date, specify a period",
		    "ERROR",
		    "/vat/" + this.id + "/period"
		)
	    );
	}

	console.log(this.status);
	if (this.status && ! this.status.vat) {
	    errors.push(
		new ValidationError(
		    "CONN",
		    "You must configure the connection to HMRC using " +
			"VAT credentials for your company",
		    "ERROR",
		    "/status"
		)
	    );
	}

	this.errors = errors;
	
	this.subject.next(this.errors);
    }

    subject = new Subject<ValidationError[]>();

    onupdate() : Observable<ValidationError[]> {
	return  this.subject;
    }

}

