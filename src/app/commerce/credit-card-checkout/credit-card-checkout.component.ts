import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CheckoutService } from '../checkout.service';
import { PaymentService } from '../stripe.service';

import { StripePaymentElementComponent } from 'ngx-stripe';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { OrderComponent } from '../order/order.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-checkout',
    templateUrl: './credit-card-checkout.component.html',
    styleUrls: ['./credit-card-checkout.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, OrderComponent, StripePaymentElementComponent, MatButton, MatIcon]
})
export class CreditCardCheckoutComponent implements OnInit {
    private service = inject(CheckoutService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    payments = inject(PaymentService);


    @ViewChild(StripePaymentElementComponent)
    paymentElement? : StripePaymentElementComponent = undefined;

    ngOnInit(): void {
	this.service.create_order().subscribe(txid => {
	    this.service.create_payment(txid).subscribe(pid => {
		this.payments.set_payment_id(pid);
	    });
	});
    }

    stripe() { return this.payments.get_stripe(); }

    place_order() {

	this.payments.confirm(this.paymentElement).subscribe({

	    next: (pid) => {

		this.service.complete_payment(pid).subscribe({
		    next: (_bal) => {
			this.router.navigate(["/commerce/complete"]);
		    },
		    error: (err) => {
			this.error(err);
		    },
		    complete: () => {}
		});
		
	    },
	    error: (err) => { this.error(err); },
	    complete: () => {}
	});

    }

    back() {
	this.router.navigate(["/commerce/purchase"]);
    }

    create_payment() : Observable<string> {

	return new Observable<string>((obs) => {

	    this.service.create_order().subscribe({
		next: (ev) => { obs.next(ev); },
		error: (err) => { this.error(err); },
		complete: () => {}
	    });

	});

    }

    error(err : HttpErrorResponse) {
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

