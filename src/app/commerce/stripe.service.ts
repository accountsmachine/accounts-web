import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StripeFactoryService, StripeInstance, StripePaymentElementComponent
       } from 'ngx-stripe';
import { StripeElementsOptions, PaymentIntent
       } from '@stripe/stripe-js';

import { ApiService } from '../api.service';
import { CheckoutService } from './checkout.service';

@Injectable({
    providedIn: 'any'
})
export class PaymentService {

    _strp? : StripeInstance;

    elementsOptions: StripeElementsOptions = {
	locale: 'en',

	// Seems to be ignored.
	appearance: {
	    theme: 'stripe'
	}

    };

    get_stripe() { return this._strp!; }

    constructor(
	private stripeFactory : StripeFactoryService,
	private api : ApiService,
    )
    {
	let url = "/api/commerce/payment-key";
	this.api.get<any>(url).subscribe(resp => {
	    let key = resp["key"];
	    this._strp = this.stripeFactory.create(key);
	});
    }

    confirm(element : any) {
	return new Observable<string>(obs => {
	    if (!this._strp) {
		obs.error("Stripe is not initialised!");
		return;
	    }
	    this._strp.confirmPayment({
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

