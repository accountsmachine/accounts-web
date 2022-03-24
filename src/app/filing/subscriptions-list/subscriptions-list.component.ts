import { Component, OnInit } from '@angular/core';

import { SubscriptionService, Subscription, LoadEvent
       } from '../subscription.service';
import { CompanyService, Company, Companies } from '../../company/company.service';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest } from 'rxjs';

type Row = {
    company : string,
    number : string,
    active : boolean,
    expires : Date | null,
    vat : boolean,
    corptax : boolean,
    accounts : boolean,
};

@Component({
    selector: 'subscriptions-list',
    templateUrl: './subscriptions-list.component.html',
    styleUrls: ['./subscriptions-list.component.scss']
})
export class SubscriptionsListComponent implements OnInit {

    subs : Subscription[] = [];
    companies : Companies = {};

    columns = [
	"company", "number", "active", "expires", "vat", "corptax", "accounts"
    ];

    data : MatTableDataSource<Row> =
	new MatTableDataSource<Row>([]);

    constructor(
	private companyService : CompanyService,
	private svc : SubscriptionService,
    ) {
    }

    ngOnInit(): void {

	this.reload();
	/*

	this.svc.take("12874000", "vat-1-year").subscribe(e =>
	    console.log(e)
	);

	this.svc.take("13939350", "all-2-year").subscribe(e =>
	    console.log(e)
	);
	
	this.svc.take("10503074", "all-2-year").subscribe(e =>
	    console.log(e)
	);
	*/

    }

    update(subs : Subscription[], companies : Companies) {

	console.log("UPDATE");
	console.log(subs);
	console.log(companies);

	let data : Row[] = [];

	for (let k in companies) {

	    let row : Row = {
		company: companies[k].company_name,
		number: companies[k].company_number,
		active: false,
		expires: null,
		vat: false,
		corptax: false,
		accounts: false,
	    };

	    for (let j in subs) {
		if (subs[j].company == k) {
		    if (subs[j].valid) {
			row["active"] = true;
			row["expires"] = new Date(subs[j].expires);
			console.log(subs[j].provides);
			for (let p of subs[j].provides) {
			    if (p == "vat") row.vat = true;
			    if (p == "corptax") row.corptax = true;
			    if (p == "accounts") row.accounts = true;
			}
		    }
		}
	    }

	    console.log("true");

	    data.push(row);

	}

	this.data.data = data;

    }

    reload() {

	combineLatest({
	    subscriptions: this.svc.list(),
	    companies: this.companyService.get_list(),
	}).subscribe(
	    e => {
		this.update(e.subscriptions, e.companies);
	    }
	);

    }


/*
	
	this.companyService.get_list().subscribe(
	    c => {
		this.companies = c;
	    }
	);

	this.svc.list().subscribe(s => {
	    this.subs = s;
	    console.log(s);
	})
    }
*/

}

