
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { VatConfig } from './vat-config';
import { VatConfigService } from './vat-config.service';
import { Company, CompanyService } from '../company/company.service';
import { CommerceService } from '../commerce/commerce.service';
import { Balance } from '../commerce/commerce.model';

export class ValidationError {
    constructor(
	public id : string,
	public description : string,
	public kind : string,
	public href? : string,
    ) {
    }
};

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    errors : ValidationError[] = [];

    id : string = "";
    config : any = {};
    company : any = {};
    balance : Balance;

    constructor(
	private filing : VatConfigService,
	private companyService : CompanyService,
	private commerce : CommerceService,
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
		this.companyService.load(this.config["company"]).subscribe(
		    cmp => {
			this.company = cmp;
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
		    "CREDS",
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

	if (!this.config.start) {
	    errors.push(
		new ValidationError(
		    "PERS",
		    "There is no period start date, specify a period",
		    "ERROR",
		    "/vat/" + this.id + "/period"
		)
	    );
	}

//	this.

/*
	this.errors = [
	    new ValidationError(
		"VAL-1",
		"The VAT record contains no accounts data.",
		"ERROR",
		"/vat/09f6f85f-5570-4c60-aa84-2e06cc3b3f60/company",
	    ),
	    new ValidationError(
		"VAL-2",
		"Company not defined.",
		"ERROR",
		"/vat/09f6f85f-5570-4c60-aa84-2e06cc3b3f60/company",
	    ),
	    new ValidationError(
		"VAL-3",
		"Company not defined.",
		"INFO",
	    ),
	    new ValidationError(
		"VAL-4",
		"Company not defined.",
		"WARNING",
		"/vat/09f6f85f-5570-4c60-aa84-2e06cc3b3f60/company",
	    ),
	];
*/

	this.errors = errors;
	
	this.subject.next(this.errors);
    }

    subject = new Subject<ValidationError[]>();

    onupdate() : Observable<ValidationError[]> {
	return  this.subject;
    }

}

