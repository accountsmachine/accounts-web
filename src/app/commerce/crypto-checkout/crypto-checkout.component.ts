import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CheckoutService } from '../checkout.service';
import { Order } from '../commerce.model';

//import { PaymentService } from '../stripe.service';
//import { StripePaymentElementComponent } from 'ngx-stripe';
//import { PaymentIntent } from '@stripe/stripe-js';

@Component({
    selector: 'app-checkout',
    templateUrl: './crypto-checkout.component.html',
    styleUrls: ['./crypto-checkout.component.scss']
})
export class CryptoCheckoutComponent implements OnInit {

//    @ViewChild(StripePaymentElementComponent)
//    paymentElement? : StripePaymentElementComponent = undefined;

    public form : FormGroup;

    constructor(
	private service : CheckoutService,
	private router : Router,
	private snackBar: MatSnackBar,
	private formBuilder: FormBuilder,
//	public payments : PaymentService,
    ) {
	this.form = this.formBuilder.group({
	    currency: ["eth"],
	});
    
    }

    currencies : string[] = ["eth"];

    order : Order  = new Order();

    ngOnInit(): void {
	/*
	this.service.create_order().subscribe(txid => {
	    this.service.create_payment(txid).subscribe(pid => {
		this.payments.set_payment_id(pid);
	    });
	});*/
	this.service.get_crypto_currencies().subscribe({
	    next: (c : any) => {
		this.currencies = c.currencies;
	    },
	    error: (err) => {
	    },
	    complete: () => {},
	});

	this.service.onorder().subscribe(o => {
	    this.order = o;
	    this.adjust_estimate();
	});

    }

//    stripe() { return this.payments.get_stripe(); }

    place_order() {

/*
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
*/
    }

    back() {
	this.router.navigate(["/commerce/purchase"]);
    }

    change() {
	this.adjust_estimate();
    }

    estimate : number = 0.0;

    adjust_estimate() {

	let currency = this.form.value.currency;

	this.service.get_crypto_estimate(currency).subscribe({
	    next: (e : any) => {
		this.estimate = e["estimated_amount"];
	    },
	    error: (err) => {
		this.error(err)
	    },
	    complete: () => {},
	});


    }

    create_payment() {
//    create_payment() : Observable<void> {
/*
	let cmp = this;

	return new Observable<PaymentIntent>((obs : any) => {

	    this.service.create_order().subscribe({
		next(ev) { obs.next(ev); },
		error(err) { cmp.error(err); },
		complete() {}
	    });

	});
*/
	throw "Not implemetned";
    }

    error(err : any) {
	console.log(err);
	console.log("BUNCHY");
	if (err && err.error) {
	    if (err.error.message) {
		this.snackBar.open(err.error.message,
				   "dismiss", { duration: 5000 });
		return;
	    }
	}
	console.log("BUNCHY2");
	this.snackBar.open(err.toString(), "dismiss", { duration: 5000 });
    }

}

