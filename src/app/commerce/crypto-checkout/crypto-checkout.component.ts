import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, interval, catchError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { CheckoutService } from '../checkout.service';
import { Order } from '../commerce.model';

@Component({
    selector: 'app-checkout',
    templateUrl: './crypto-checkout.component.html',
    styleUrls: ['./crypto-checkout.component.scss']
})
export class CryptoCheckoutComponent implements OnInit {

    public form : FormGroup;

    estimate : number = 0.0;
    minimum : number = 0.0;

    pay_amount? : number;
    actually_paid? : number;
    pay_address? : string;
    payment_id? : string;
    pay_currency? : string;
    order_id? : string;
    payment_status? : string;

    currencies : string[] = ["eth"];

    valid = false;

    order : Order  = new Order();

    est_subs : any = null;
    status_subs : any = null;
    ord_subs : any = null;

    constructor(
	private service : CheckoutService,
	private router : Router,
	private snackBar: MatSnackBar,
	private formBuilder: FormBuilder,
    ) {
	this.form = this.formBuilder.group({
	    currency: ["eth"],
	});
    
    }

    ngOnInit(): void {

	this.est_subs = interval(30000).subscribe({
	    next: (e: any) => {
		if (!this.pay_address) {
		    this.adjust_estimate();
		    this.adjust_minimum();
		}
	    },
	    error: (e) => { console.log("estimate", e); },
	    complete: () => {},
	});

	this.status_subs = interval(5000).subscribe({
	    next: (e: any) => {
		if (this.payment_id) {
		    if (this.payment_status != "finished") {
			this.service.get_crypto_payment_status(
			    this.payment_id
			).subscribe(
			    (e : any) => {
				this.payment_status = e["payment_status"];
				this.actually_paid = e["actually_paid"];
				if (e["payment_status"] == "finished") {
				    // Nothing to do?
				}
			    }
			)
		    }
		}
	    },
	    error: (e) => { console.log("status", e); },
	    complete: () => {},
	});

	this.service.get_crypto_currencies().subscribe({
	    next: (c : any) => {
		this.currencies = c.currencies.sort();
	    },
	    error: (err) => {
		console.log("crypto-currencies", err);
	    },
	    complete: () => {},
	});

	this.ord_subs = this.service.onorder().subscribe(o => {
	    this.order = o;
	    this.adjust_estimate();
	    this.adjust_minimum();
	});

    }

    ngOnDestroy() : void {
	if (this.est_subs)
	    this.est_subs.unsubscribe();
	if (this.status_subs)
	    this.status_subs.unsubscribe();
	if (this.ord_subs)
	    this.ord_subs.unsubscribe();
    }

    place_order() {

	let currency = this.form.value.currency;

	this.service.create_crypto_payment(currency).subscribe({
	    next: (e : any) => {
		this.pay_address = e["pay_address"];
		this.pay_amount = e["pay_amount"];
		this.actually_paid = e["actually_paid"];
		this.payment_id = e["payment_id"];
		this.pay_currency = e["pay_currency"];
		this.order_id = e["order_id"];
		this.payment_status = e["payment_status"];
	    },
	    error: (err) => {
		console.log("place-order");
		this.error(err)
	    },
	    complete: () => {},
	});

    }

    back() {
	this.router.navigate(["/commerce/purchase"]);
    }

    change() {
	this.adjust_estimate();
	this.adjust_minimum();
    }

    check_min() {
	this.valid = this.estimate > this.minimum;
    }

    adjust_estimate() {

	let currency = this.form.value.currency;

	this.service.get_crypto_estimate(currency).subscribe({
	    next: (e : any) => {
		this.estimate = e["estimated_amount"];
		this.check_min();
	    },
	    error: (err) => {
		console.log("adjust-estimate");
		this.estimate = 0;
		this.valid = false;
		this.error(err);
	    },
	    complete: () => {},
	});


    }

    adjust_minimum() {

	let currency = this.form.value.currency;

	this.service.get_crypto_minimum(currency).subscribe({
	    next: (e : any) => {
		this.minimum = e;
		this.check_min();
	    },
	    error: (err) => {
		console.log("adjust-minimum");
		this.valid = false;
		this.error(err);
	    },
	    complete: () => {},
	});


    }

    error(err : any) {
	if (err && err.error) {
	    if (err.error.message) {
		this.snackBar.open(err.error.message,
				   "dismiss", { duration: 5000 });
		return;
	    }
	    if (err.error) {
		this.snackBar.open(err.error,
				   "dismiss", { duration: 5000 });
		return;
	    }
	}
	this.snackBar.open(err.toString(), "dismiss", { duration: 5000 });
    }

}

