import { Component, OnInit, EventEmitter } from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CheckoutService, CheckoutEvent } from '../checkout.service';
import { Company } from '../../company/company.service';
import { Subscription, SubscriptionService } from '../subscription.service';

@Component({
    selector: 'checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    public form : FormGroup;

    company : Company | null = null;
    subscription : Subscription | null = null;
    subscriptions : Subscription[] = [];
    selected_subscription : Subscription | null = null;

    vat_event = new EventEmitter<MatButtonToggleChange>();
    corptax_event : EventEmitter<string> = new EventEmitter<string>();
    accounts_event : EventEmitter<string> = new EventEmitter<string>();

    options : Subscription[] = [];

    state = "none";

    constructor(
	private service : CheckoutService,
	private subscriptionService : SubscriptionService,
	private formBuilder: FormBuilder,
    ) {
	this.form = this.formBuilder.group({
	    vat: [12],
	    corptax: [12],
	    accounts: [12],
	});
    }

    doit() {
	console.log(this.form.value.vat,
		    this.form.value.corptax,
		    this.form.value.accounts);
    }

    months() {
	let m = [];
	for(let i = 0; i < 30; i++) m.push(i);
	return m;
    }

    ngOnInit(): void {

	this.service.onevent().subscribe((ev : CheckoutEvent) => {

	    this.subscription = ev.subscription;
	    this.subscriptions = ev.subscriptions;
	    this.company = ev.company;

	    if (ev.event == "select-company") {

		if (this.company == null) return;

		this.state = "company";

		let cid = this.company.company_number;

		this.subscriptionService.get_options(cid).subscribe(
		    (e : any) => {
			for (let option of e) {
			    console.log(option);
			}
		    }
		);
		
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

	this.vat_event.subscribe((thing : MatButtonToggleChange) => {
	    console.log(thing.value);
	});

    }

    chg(val : any) {
	console.log(val);
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

