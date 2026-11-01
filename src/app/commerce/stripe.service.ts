import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { StripeFactoryService, StripeInstance,
         StripePaymentElementComponent
       } from 'ngx-stripe';
import { StripeElementsOptions
       } from '@stripe/stripe-js';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'any'
})
export class PaymentService {
    private stripeFactory = inject(StripeFactoryService);
    private api = inject(ApiService);


    _strp? : StripeInstance;

    elementsOptions: StripeElementsOptions = {
	locale: 'en',

	// Seems to be ignored.
	appearance: {
	    theme: 'stripe'
	}

    };

    get_stripe() { return this._strp!; }

    constructor()
    {
	const url = "/api/commerce/payment-key";
	this.api.get<{ key: string }>(url).subscribe(resp => {
	    const key = resp.key;
	    this._strp = this.stripeFactory.create(key);
	});
    }

    confirm(element : StripePaymentElementComponent | undefined) {
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

			const status = result.paymentIntent.status;
		    
			if (status != "succeeded") {
			    obs.error(result);
			    return;
			}
		    
			const id = result.paymentIntent.id;

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

