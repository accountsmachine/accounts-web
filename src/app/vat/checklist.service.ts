
import { Injectable, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { VatConfigService } from './vat-config.service';
import { Company, CompanyService } from '../company/company.service';
import { CommerceService } from '../commerce/commerce.service';
import { Balance } from '../commerce/commerce.model';
import { Status, StatusService } from '../status/status.service';
import { BooksService } from '../books/books.service';
import { VatConfig } from './vat-config';
import { Check, Checklist } from '../checklist/checklist.model'

@Injectable({
    providedIn: 'root'
})
export class ChecklistService {
    private filing = inject(VatConfigService);
    private companyService = inject(CompanyService);
    private commerce = inject(CommerceService);
    private statusService = inject(StatusService);
    private books = inject(BooksService);


    _outstanding = 0;

    get outstanding() {
	return this._outstanding;
    }

    set outstanding(val : number) {
	this._outstanding = val;
    }

    id  = "";
    config : VatConfig = {};
    company : Company = new Company();
    balance : Balance;
    status : Status = new Status();
    books_info : { time?: string } = {};

    constructor() {
 	this.balance = {
	    vat: 0, corptax: 0, accounts: 0
	};
   }

    load(id : string) {

	// This pushes the pending = true update.
	const cl = new Checklist();
	cl.list = [];
	cl.pending = true;
	this.subject.next(cl);

	this.id = id;

	this.commerce.balance().subscribe({
	    next: bal => {
		this.balance = bal;
	    },
	    error: _e => {
		this.balance = { vat: 0, corptax: 0, accounts: 0 };
	    }
	});

	this.outstanding += 1;
	this.filing.load(id).subscribe({
	    next: e => {

		this.config = e.config;
		this.outstanding -= 1;

		if ("company" in this.config) {

		    this.company = new Company();
		    this.status = new Status();
		    this.books_info = {};

		    this.outstanding += 1;
		    this.companyService.load(this.config.company!).subscribe({
			next: cmp => {
			    this.company = cmp ?? new Company();
			    this.outstanding -= 1;
			    this.validate();
			},
			error: () => {
			    this.company = new Company();
			    this.outstanding -= 1;
			    this.validate();
			}
		    });

		    this.outstanding += 1;
		    this.statusService.get(this.config.company!).subscribe({
			next: st => {
			    this.status = st;
			    this.outstanding -= 1;
			    this.validate();
			},
			error: (_e) => {
			    this.status = new Status();
			    this.outstanding -= 1;
			    this.validate();
			}
		    });

		    this.outstanding += 1;
		    this.books.get_books_info(this.config.company!).subscribe({
			next: info => {
			    this.books_info = info as { time?: string };
			    this.outstanding -= 1;
			    this.validate();
			},
			error: (_e) => {
			    this.books_info = {};
			    this.outstanding -= 1;
			    this.validate();
			},
		    });

		} else {
		    this.company = new Company();
		    this.status = new Status();
		    this.books_info = {};
		}

		this.validate();

	    },

	    error: (_e) => {
		this.company = new Company();
		this.status = new Status();
		this.books_info = {};
		this.outstanding -= 1;
		this.validate();
	    }

	});

    }

    validate() {

	const list : Check[] = [];

	if (this.balance && this.balance.vat > 0) {
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
		    "Company selected"
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
		    "The company name is specified"
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

	let complete = true;
	for(const elt of list) {
	    if (elt.kind != "OK") {
		complete = false;
		break;
	    }
	}

	const cl = new Checklist();
	cl.list = list;
	cl.pending = this.outstanding > 0;
	cl.complete = complete;

	this.subject.next(cl);

    }

    subject = new Subject<Checklist>();

    onupdate() : Observable<Checklist> {
	return this.subject.pipe(debounceTime(100));
    }

}

