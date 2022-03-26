import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { CommerceService, Option, Options, Balance } from './commerce.service';

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    offer : Options = {};

    vat_count = 0;
    corptax_count = 0;
    accounts_count = 0;

    tax_applied : string = "";
    tax_rate : number = 0;

    vat_price : number = 0;
    corptax_price : number = 0;
    accounts_price : number = 0;

    vat_discount : number = 0;
    corptax_discount : number = 0;
    accounts_discount : number = 0;

    subtotal_price : number = 0;
    tax_price : number = 0;
    total_price : number = 0;

    constructor(
	private commerce : CommerceService,
    ) {
        this.reload();
    }

    reload() {

	this.commerce.get_offer().subscribe(o => {
	    this.offer = o;
	});

	this.reset();

    }

    reset() {
	this.vat_count = 0;
	this.corptax_count = 0;
	this.accounts_count = 0;
	this.recalc();
    }

    recalc() {

	this.vat_price = this.corptax_price = this.accounts_price = 0;
	this.vat_discount = this.corptax_discount = this.accounts_discount = 0;

	if (this.offer.vat) {
	    for (let item of this.offer.vat.offer)
		if (this.vat_count == item.credits) {
		    this.vat_price = item.price;
		    this.vat_discount = item.discount;
		}
	    }

	if (this.offer.corptax)
	    for (let item of this.offer.corptax.offer) {
		if (this.corptax_count == item.credits) {
		    this.corptax_price = item.price;
		    this.corptax_discount = item.discount;
		}
	    }
	if (this.offer.accounts)
	    for (let item of this.offer.accounts.offer) {
		if (this.accounts_count == item.credits) {
		    this.accounts_price = item.price;
		    this.accounts_discount = item.discount;
		}
	    }

	this.tax_rate = this.offer.vat_tax_rate!;

	this.tax_applied = "VAT @ " + Math.round(this.tax_rate * 100) + "%";
	
	this.subtotal_price =
	    this.vat_price + this.corptax_price + this.accounts_price;

	this.tax_price = Math.round(this.tax_rate * this.subtotal_price);

	this.total_price = this.subtotal_price + this.tax_price;
    }

    place_order() : Observable<Balance> {

	let items = [];

	if (this.vat_count) {
	    items.push({
		kind: "vat", quantity: this.vat_count,
		amount: this.vat_price })
	}

	if (this.corptax_count) {
	    items.push({
		kind: "corptax", quantity: this.corptax_count,
		amount: this.corptax_price })
	}

	if (this.accounts_count) {
	    items.push({
		kind: "accounts", quantity: this.accounts_count,
		amount: this.accounts_price })
	}

	let order = {
	    items: items,
	    subtotal: this.subtotal_price,
	    tax: this.tax_price,
	    total: this.total_price,
	    vat_rate: this.tax_rate,
	}

	return new Observable<Balance>(obs => {

	    this.commerce.place_order(order).subscribe(
		b => {
		    this.reload();
		    obs.next(b);
		}
	    );

	});

    }

}

