
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { VatConfig } from './vat-config';
import { VatConfigService } from './vat-config.service';
import { Company, CompanyService } from '../company/company.service';
import { CommerceService } from '../commerce/commerce.service';
import { Balance } from '../commerce/commerce.model';
import { StatusService } from '../status/status.service';
import { BooksService } from '../books/books.service';

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
    books_info : any = {};

    constructor(
	private filing : VatConfigService,
	private companyService : CompanyService,
	private commerce : CommerceService,
	private statusService : StatusService,
	private books : BooksService,
    ) {
 	this.balance = {
	    email: "", uid: "", credits: { vat: 0, corptax: 0, accounts: 0 }
	};
   }

    load(id : string) {

	this.errors = [];

	this.id = id;

	this.commerce.onbalance().subscribe({
	    next: bal => { this.balance = bal; },
	    error: e => {
		this.balance = {
		    email: "", uid: "",
		    credits: { vat: 0, corptax: 0, accounts: 0 }
		};
	    }
	});

	this.commerce.update_balance();

	this.filing.load(id).subscribe(e => {

	    this.config = e.config;

	    if ("company" in this.config) {
		this.company = {};
		this.status = {};
		this.books_info = {};
		this.companyService.load(this.config.company).subscribe({
		    next: cmp => {
			this.company = cmp;
			this.validate();
		    },
		    error: () => {
			this.company = {};
			this.validate();
		    }
		});
		this.statusService.get(this.config.company).subscribe({
		    next: st => {
			this.status = st;
			this.validate();
		    },
		    error: (e) => {
			this.status = {};
			this.validate();
		    }
		});
		this.books.get_books_info(this.config.company).subscribe({
		    next: info => {
			this.books_info = info;
			this.validate();
		    },
		    error: (e) => {
			this.books_info = {};
			this.validate();
		    },
		});
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

	if (!this.config.company) {
	    errors.push(
		new ValidationError(
		    "CNAME",
		    "You must select a company to file for",
		    "ERROR",
		    "/vat/" + this.id + "/company"
		)
	    );
	} else {

	    if (this.company && !this.company.company_name) {
		errors.push(
		    new ValidationError(
			"CNAME",
			"The company configuration does not define a " +
			    "company name",
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

	    if (this.company && !this.books_info.time) {
		errors.push(
		    new ValidationError(
			"BOOK",
			"You must upload accounting books for your company",
			"ERROR",
			"/books"
		    )
		);

	    }

	}

	if (!this.config.due) {
	    errors.push(
		new ValidationError(
		    "PERD",
		    "You must specify a VAT period",
		    "ERROR",
		    "/vat/" + this.id + "/period"
		)
	    );
	}

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
	return this.subject.pipe(debounceTime(500));
    }

}

