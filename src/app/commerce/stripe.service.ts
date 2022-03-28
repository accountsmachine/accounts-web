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
	    }).subscribe({
		next(result) {
		    if (result && result.paymentIntent) {

			let status = result.paymentIntent.status;
		    
			if (status != "succeeded") {
			    obs.error(result);
			    return;
			}
		    
			let id = result.paymentIntent.id;

			if (id) {
			    obs.next(id);
			    return;
			}

			console.log("Client secret is null?");

		    } else
			obs.error(result);

		},

		error(err) {
		    obs.error(err);
		},
		complete() { obs.complete() }
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

