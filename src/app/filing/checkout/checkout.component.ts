import { Component, OnInit } from '@angular/core';

import { CheckoutService, CheckoutEvent } from '../checkout.service';
import { Company } from '../../company/company.service';
import { Subscription, SubscriptionService } from '../subscription.service';

@Component({
    selector: 'checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    company : Company | null = null;
    subscription : Subscription | null = null;
    subscriptions : Subscription[] = [];
    selected_subscription : Subscription | null = null;

    options : Subscription[] = [];

    state = "none";

    constructor(
	private service : CheckoutService,
	private subscriptionService : SubscriptionService,
    ) { }

    ngOnInit(): void {

	this.service.onevent().subscribe((ev : CheckoutEvent) => {

	    this.subscription = ev.subscription;
	    this.subscriptions = ev.subscriptions;
	    this.company = ev.company;

	    if (ev.event == "select-company") {

		if (this.company == null) return;

		this.state = "company";

		let cid = this.company.company_number;

		this.options = [
		    this.subscriptionService.create(cid, "vat-1-year"),
		    this.subscriptionService.create(cid, "all-1-year"),
		    this.subscriptionService.create(cid, "vat-2-year"),
		    this.subscriptionService.create(cid, "all-2-year")
		];
		
	    }

	    if (ev.event == "select-subscription") {
		this.state = "subscription";
	    }

	});

    }

    select_subscription(subs : Subscription) {
	this.selected_subscription = subs;
	console.log("NOW ", subs);
	this.service.push("select-subscription");
    }

    back() {
	this.service.push("select-company");
    }

    checkout() {
    }

}

