import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Subscription, SubscriptionService } from './subscription.service';
import { CompanyService, Company, Companies } from '../company/company.service';

export type CheckoutEvent = {
    event : string,
    company : Company | null,
    subscriptions : Subscription[],
    subscription : Subscription | null,
};

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    subject : Subject<CheckoutEvent> = new Subject<CheckoutEvent>();

    subscriptions : Subscription[] = [];

    subscription : Subscription | null = null;

    company : Company | null = null;

    constructor(
	private subscriptionService : SubscriptionService,
	private companyService : CompanyService,
    ) {

	subscriptionService.list().subscribe(s => this.subscriptions = s);

	this.companyService.onload().subscribe((c : Company | null) => {
	    this.company = c;
	    this.push("select-company");
	});

    }

    onevent() : Observable<CheckoutEvent> {
	return this.subject;
    }

    push(e : string) {
	this.subject.next({
	    event : e,
	    subscription : this.subscription,
	    subscriptions : this.subscriptions,
	    company : this.company,
	});
    }

    select_company(c : string) {
	this.companyService.load(c);
    }

    select_subscription(kind : string) {

	if (this.company == null) {
	    console.log("Can't select subscription on null company, ignored");
	    return;
	}

	this.subscription = this.subscriptionService.create(
	    kind, this.company.company_number
	);

	this.push("select-subscription");

    }

}

