import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Company } from '../../company/company.service';
import { Option, Options, Balance, Order } from '../commerce.model';
import { CommerceService } from '../commerce.service';
import { CheckoutService } from '../checkout.service';
import { StripePaymentService } from '../stripe.service';

import { StripeService, StripePaymentElementComponent
       } from 'ngx-stripe';
import { StripeElementsOptions, PaymentIntent
       } from '@stripe/stripe-js';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    @ViewChild(StripePaymentElementComponent)
    paymentElement? : StripePaymentElementComponent = undefined;

    constructor(
	private service : CheckoutService,
	private stripeService : StripeService,
	private router : Router,
	public payments : StripePaymentService,
    ) { }

    payment_intent : PaymentIntent | null = null;

    ngOnInit(): void {
	this.service.create_order().subscribe(txid => {
	    this.service.create_payment(txid).subscribe(pid => {
		this.payments.set_payment_id(pid);
	    });
	});
    }

    place_order() {
	this.payments.confirm(this.paymentElement).subscribe(pid => {
	    this.service.complete_payment(pid).subscribe(bal => {
		this.router.navigate(["/commerce/complete"]);
	    });
	});
    }

    back() {
	this.router.navigate(["/commerce/shop"]);
    }

    create_payment() : Observable<PaymentIntent> {
	return new Observable<PaymentIntent>((obs : any) => {
	    this.service.create_order().subscribe(ev => {
		obs.next(ev);
	    })
	});
    }

}

