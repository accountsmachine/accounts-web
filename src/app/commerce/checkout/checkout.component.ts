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

    elementsOptions: StripeElementsOptions = {
	locale: 'en',

	// Seems to be ignored.
	appearance: {
	    theme: 'stripe'
	}

    };

    constructor(
	private service : CheckoutService,
	private stripeService : StripeService,
	private router : Router,
	private payments : StripePaymentService,
    ) { }

    payment_intent : PaymentIntent | null = null;

    ngOnInit(): void {

	this.service.create_order().subscribe(txid => {
	    this.service.create_payment(txid).subscribe(pid => {
		this.elementsOptions.clientSecret = pid;
	    });
	});
	    
//	    this.elementsOptions.clientSecret = pi.client_secret;
//	});

//	this.payments.

	/*
	this.create_payment_intent().subscribe(pi => {
	    if (pi && pi.client_secret) {
		this.elementsOptions.clientSecret = pi.client_secret;
		this.payment_intent = pi;
	    } else {
		this.payment_intent = null;
	    }
	});
*/
    }

    place_order() {
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

	    if (result && result.paymentIntent) {

		let status = result.paymentIntent.status;
		console.log("Status>", status);

		let id = result.paymentIntent.id;

		if (status != "succeeded") {
		    console.log("FIXME: Payment failed");
		    return;
		}

		if (id) {
		    console.log("ID>", id);
		    this.service.complete_payment(id).subscribe(res => {
			console.log("Complete order is done.");
			console.log(res);
		    });
		    return;
		}
		
		console.log("Client secret is NULL?!!");

	    }
	});

    }

    back() {
	this.router.navigate(["/commerce/shop"]);
    }
/*
    create_payment_intent() : Observable<PaymentIntent> {
	return new Observable<PaymentIntent>((obs : any) => {
	    this.service.create_order().subscribe(ev => {
		obs.next(ev);
	    })
	});
	}*/

    create_payment() : Observable<PaymentIntent> {
	return new Observable<PaymentIntent>((obs : any) => {
	    this.service.create_order().subscribe(ev => {
		obs.next(ev);
	    })
	});
    }


}
