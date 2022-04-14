
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

export class Check {
    constructor(
	public id : string,
	public description : string,
	public kind : string,
	public href? : string,
    ) {
    }
};

export class Checklist {
    pending : boolean = false;
    list : Check[] = [];
};

// FIXME: Lots of events, debounce?

@Injectable({
    providedIn: 'root'
})
export class ChecklistService {

//    errors : ValidationError[] = [];
    pending : number = 0;
    checklist : Checklist = new Checklist();

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

	this.checklist.list = [];

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

	let list : Check[] = [];

	if (this.balance && this.balance.credits &&
	    this.balance.credits["vat"] < 1) {
	    list.push(
		new Check(
		    "COMM",
		    "You have no VAT filing credits - " +
			"purchase credits to file this return",
		    "INFO",
		    "/commerce/purchase",
		)
	    );
	}

	if (!this.config.company) {
	    list.push(
		new Check(
		    "CNAME",
		    "You must select a company to file for",
		    "ERROR",
		    "/vat/" + this.id + "/company"
		)
	    );
	} else {

	    if (this.company && !this.company.company_name) {
		list.push(
		    new Check(
			"CNAME",
			"The company configuration does not define a " +
			    "company name",
			"ERROR",
			"/company/" + this.config.company + "/business"
		    )
		);
	    }

	    if (this.company && !this.company.vrn) {
		list.push(
		    new Check(
			"VRN",
			"You must provide a company VAT registration number",
			"ERROR",
			"/company/" + this.config.company + "/tax"
		    )
		);

	    }

	    if (this.company && !this.books_info.time) {
		list.push(
		    new Check(
			"BOOK",
			"You must upload accounting books for your company",
			"ERROR",
			"/books"
		    )
		);

	    }

	}

	if (!this.config.due) {
	    list.push(
		new Check(
		    "PERD",
		    "You must specify a VAT period",
		    "ERROR",
		    "/vat/" + this.id + "/period"
		)
	    );
	}

	if (this.status && ! this.status.vat) {
	    list.push(
		new Check(
		    "CONN",
		    "You must configure the connection to HMRC using " +
			"VAT credentials for your company",
		    "ERROR",
		    "/status"
		)
	    );
	}

	this.checklist.list = list;
	
	this.subject.next(this.checklist);
    }

    subject = new Subject<Checklist>();

    onupdate() : Observable<Checklist> {
	return this.subject.pipe(debounceTime(500));
    }

}

