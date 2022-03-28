import { Component, ViewChild, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Company } from '../../company/company.service';
import { Option, Options, Balance, Order } from '../commerce.model';
import { CommerceService } from '../commerce.service';
import { CheckoutService } from '../checkout.service';

import { StripeService, StripePaymentElementComponent } from 'ngx-stripe';
import { StripeElementsOptions, PaymentIntent
       } from '@stripe/stripe-js';

@Component({
    selector: 'shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

    @ViewChild(StripePaymentElementComponent)
    paymentElement? : StripePaymentElementComponent = undefined;

    elementsOptions: StripeElementsOptions = {
	locale: 'en'
    };

    public form : FormGroup;

    offer : Options = { offer: {} };
    kinds : string[] = [];

    value : { [kind : string] : number } = {};
    descriptions : { [kind : string] : string } = {};

    order : Order = new Order();

    constructor(
	private service : CheckoutService,
	private commerceService : CommerceService,
	private formBuilder: FormBuilder,
	private snackBar: MatSnackBar,
	private stripeService : StripeService,
	private router : Router,
    ) {
	this.form = this.formBuilder.group({
	    vat: [0],
	    corptax: [0],
	    accounts: [0],
	});
	this.service.onorder().subscribe(o => {

	    this.order = o;

	    this.value = {};
	    this.descriptions = {};

	    for (let item of this.order.items) {
		this.value[item.kind] = item.amount;
//		this.description[item.kind]
	    }
	    
	});
    }

    ngOnInit(): void {
	this.reload();
    }

    vat_rate() {
	return Math.round(100 * this.order.vat_rate);
    }

    some_max() {
	return Object.keys(this.offer.offer).length < 3;
    }

    reload() {
	this.commerceService.get_offer().subscribe(o => {
	    this.offer = o;
	    this.kinds = [];
	    for (let k in this.offer.offer) {
		this.kinds.push(k);
	    }
	});
	this.reset();
    }


    recalc() {
	this.service.set_quantity("vat", this.form.value.vat);
	this.service.set_quantity("corptax", this.form.value.corptax);
	this.service.set_quantity("accounts", this.form.value.accounts);
    }

    checkout() {

	this.router.navigate(["/commerce/checkout"]);

/*

	this.service.place_order().subscribe(b => {

	    // I feel the reset information should come from the checkout
	    // service.
	    this.reload();
	});
	*/

	/*
	this.service.place_order().pipe(
	    switchMap(id => {
		return this.stripeService.redirectToCheckout({sessionId: id})
	    })
	).subscribe(result => {
		console.log(result);
		});*/
/*
	console.log("PLACE ORDER");
	this.create_payment_intent().subscribe(pi => {
	    if (pi == null) return;
	    if (!pi.client_secret) return;
	    console.log("PI>", pi);
	    this.elementsOptions.clientSecret = pi.client_secret;
	    this.stripeService.confirmPayment({
		elements: this.paymentElement!.elements,
		confirmParams: {
		    payment_method_data: {
			billing_details: {
			    name: "accountsmachine.io",
			}
		    }
		},
		redirect: 'if_required',
	    }).subscribe(result => {
		console.log(result);
	    });
	});
*/
    }

    reset() {
	this.form.patchValue({
	    vat: 0, corptax: 0, accounts: 0
	});
	this.recalc();
    }

    order_disabled() {
	return (this.order.total < 1);
    }

    full_credits() {

	let unavail = [];

	if (!this.offer.offer["vat"]) unavail.push("VAT");
	if (!this.offer.offer["corptax"]) unavail.push("corporation tax");
	if (!this.offer.offer["accounts"]) unavail.push("accounts filing");

	if (unavail.length == 0) return "(nothing)";

	let ret = "";

	for (let i = 0; i < unavail.length; i++) {
	    ret += unavail[i];
	    if (i < (unavail.length - 2))
		ret += ", ";
	    else if (i < (unavail.length - 1))
		ret += " and ";
	}

	return ret;

    }

}
