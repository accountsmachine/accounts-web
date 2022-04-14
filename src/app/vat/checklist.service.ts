
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
	public kind : string,
	public description? : string,
	public href? : string,
    ) {
    }
};

export class Checklist {
    pending : boolean = false;
    complete : boolean = false;
    list : Check[] = [];
};

@Injectable({
    providedIn: 'root'
})
export class ChecklistService {

    checklist : Checklist;

    _outstanding = 0;

    get outstanding() {
	return this._outstanding;
    }

    set outstanding(val : number) {
	this._outstanding = val;
    }

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
	this.checklist = new Checklist();
   }

    load(id : string) {

	// This pushes the pending = true update.
	this.checklist.list = [];
	this.checklist.pending = true;
	this.subject.next(this.checklist);

	this.id = id;

	this.commerce.onbalance().subscribe({
	    next: bal => {
		this.balance = bal;
	    },
	    error: e => {
		this.balance = {
		    email: "", uid: "",
		    credits: { vat: 0, corptax: 0, accounts: 0 }
		};
	    }
	});

	this.commerce.update_balance();

	this.outstanding += 1;
	this.filing.load(id).subscribe({
	    next: e => {

		this.config = e.config;
		this.outstanding -= 1;

		if ("company" in this.config) {

		    this.company = {};
		    this.status = {};
		    this.books_info = {};

		    this.outstanding += 1;
		    this.companyService.load(this.config.company).subscribe({
			next: cmp => {
			    this.company = cmp;
			    this.outstanding -= 1;
			    this.validate();
			},
			error: () => {
			    this.company = {};
			    this.outstanding -= 1;
			    this.validate();
			}
		    });

		    this.outstanding += 1;
		    this.statusService.get(this.config.company).subscribe({
			next: st => {
			    this.status = st;
			    this.outstanding -= 1;
			    this.validate();
			},
			error: (e) => {
			    this.status = {};
			    this.outstanding -= 1;
			    this.validate();
			}
		    });

		    this.outstanding += 1;
		    this.books.get_books_info(this.config.company).subscribe({
			next: info => {
			    this.books_info = info;
			    this.outstanding -= 1;
			    this.validate();
			},
			error: (e) => {
			    this.books_info = {};
			    this.outstanding -= 1;
			    this.validate();
			},
		    });

		} else {
		    this.company = {};
		}

		this.validate();

	    },

	    error: (e) => {
		this.company = {};
		this.outstanding -= 1;
		this.validate();
	    }

	});

    }

    validate() {

	let list : Check[] = [];

	if (this.balance && this.balance.credits &&
	    this.balance.credits["vat"] > 0) {
	    list.push(
		new Check(
		    "PAY",
		    "OK",
		    "You have VAT filing credits available",
		)
	    );
	} else {
	    list.push(
		new Check(
		    "PAY",
		    "INFO",
		    "You have no VAT filing credits - " +
			"purchase credits to file this return",
		    "/commerce/purchase",
		)
	    );
	}

	if (this.config.company) {
	    list.push(
		new Check(
		    "CNAME",
		    "OK",
		    "Company selected."
		)
	    );
	} else {
	    list.push(
		new Check(
		    "CNAME",
		    "ERROR",
		    "You must select a company to file for",
		    "/vat/" + this.id + "/company"
		)
	    );
	};

	if  (this.company && this.company.company_name) {
	    list.push(
		new Check(
		    "CNAME",
		    "OK",
		    "The company name is specified."
		)
	    );
	} else {
	    list.push(
		new Check(
		    "CNAME",
		    "ERROR",
		    "The company configuration does not define a " +
			"company name",
		    "/company/" + this.config.company + "/business"
		)
	    );
	}

	if (this.company && this.company.vrn) {
	    list.push(
		new Check(
		    "VRN",
		    "OK",
		    "Company VRN specified",
		)
	    );
	} else {
	    list.push(
		new Check(
		    "VRN",
		    "ERROR",
		    "You must provide a company VAT registration number",
		    "/company/" + this.config.company + "/tax"
		)
	    );
	}	    

	if (this.status && this.status.vat) {
	    list.push(
		new Check(
		    "CONN",
		    "OK",
		    "The connection to HMRC VAT has been set up"
		)
	    );
	} else {
	    list.push(
		new Check(
		    "CONN",
		    "ERROR",
		    "You must configure the connection to HMRC using " +
			"VAT credentials for your company",
		    "/status"
		)
	    );
	}

	if (this.books_info.time) {
	    list.push(
		new Check(
		    "BOOK",
		    "OK",
		    "Accounting books uploaded"
		)
	    );
	} else {
	    list.push(
		new Check(
		    "BOOK",
		    "ERROR",
		    "You must upload accounting books for your company",
		    "/books"
		)
	    );
	}

	if (this.config.due) {
	    list.push(
		new Check(
		    "PERD",
		    "OK",
		    "VAT period specified"
		)
	    );
	} else {
	    list.push(
		new Check(
		    "PERD",
		    "ERROR",
		    "You must specify a VAT period",
		    "/vat/" + this.id + "/period"
		)
	    );
	}

	this.checklist.complete = true;
	for(let elt of list) {
	    if (elt.kind != "OK") {
		this.checklist.complete = false;
		break;
	    }
	}

	this.checklist.list = list;


	this.checklist.pending = this.outstanding > 0;
	
	this.subject.next(this.checklist);
    }

    subject = new Subject<Checklist>();

    onupdate() : Observable<Checklist> {
	return this.subject.pipe(debounceTime(500));
    }

}

