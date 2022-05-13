import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CheckoutService } from '../checkout.service';
import { PaymentService } from '../stripe.service';

import { StripePaymentElementComponent } from 'ngx-stripe';
import { PaymentIntent } from '@stripe/stripe-js';

@Component({
    selector: 'app-checkout',
    templateUrl: './credit-card-checkout.component.html',
    styleUrls: ['./credit-card-checkout.component.scss']
})
export class CreditCardCheckoutComponent implements OnInit {

    @ViewChild(StripePaymentElementComponent)
    paymentElement? : StripePaymentElementComponent = undefined;

    constructor(
	private service : CheckoutService,
	private router : Router,
	private snackBar: MatSnackBar,
	public payments : PaymentService,
    ) { }

    ngOnInit(): void {
	this.service.create_order().subscribe(txid => {
	    this.service.create_payment(txid).subscribe(pid => {
		this.payments.set_payment_id(pid);
	    });
	});
    }

    stripe() { return this.payments.get_stripe(); }

    place_order() {

	let cmp = this;

	this.payments.confirm(this.paymentElement).subscribe({
	    next(pid) {

		cmp.service.complete_payment(pid).subscribe({
		    next(bal) {
			cmp.router.navigate(["/commerce/complete"]);
		    },
		    error(err) {
			cmp.error(err);
		    },
		    complete() {}
		});

	    },
	    error(err) { cmp.error(err); },
	    complete() {}
	});

    }

    back() {
	this.router.navigate(["/commerce/purchase"]);
    }

    create_payment() : Observable<PaymentIntent> {

	let cmp = this;

	return new Observable<PaymentIntent>((obs : any) => {

	    this.service.create_order().subscribe({
		next(ev) { obs.next(ev); },
		error(err) { cmp.error(err); },
		complete() {}
	    });

	});

    }

    error(err : any) {
	console.log(err);
	if (err.error) {
	    if (err.error.message) {
		this.snackBar.open(err.error.message,
				   "dismiss", { duration: 5000 });
		return;
	    }
	}
	this.snackBar.open("An error occured", "dismiss", { duration: 5000 });
    }

}

