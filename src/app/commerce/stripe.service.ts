import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StripeService, StripePaymentElementComponent
       } from 'ngx-stripe';
import { StripeElementsOptions, PaymentIntent
       } from '@stripe/stripe-js';

import { CheckoutService } from './checkout.service';

@Injectable({
    providedIn: 'any'
})
export class StripePaymentService {

    elementsOptions: StripeElementsOptions = {
	locale: 'en',

	// Seems to be ignored.
	appearance: {
	    theme: 'stripe'
	}

    };

    constructor(
	private stripeService : StripeService,
    )
    {
    }

    confirm(element : any) {
	return new Observable<string>(obs => {
	    this.stripeService.confirmPayment({
		elements: element!.elements,
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
			obs.next(id);
			console.log("Complete order!");
			return;
		    }
		
		    console.log("Client secret is NULL?!!");

		}
	    });
	});

    }

    get_payment_id() {
	return this.elementsOptions.clientSecret;
    }

    set_payment_id(id : string) {
	this.elementsOptions.clientSecret = id;
    }

}

