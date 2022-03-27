import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, combineLatest } from 'rxjs';

import { Option, Options, Balance, Order, ItemLine, ItemQuantities
       } from './commerce.model';
import { CommerceService } from './commerce.service';

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    _quantities : ItemQuantities = {};
    _offer : Options = { offer: {} };
    _order : Order = new Order();

    quantity_subject = new BehaviorSubject<ItemQuantities>(this._quantities);
    offer_subject = new BehaviorSubject<Options>(this._offer);
    order_subject = new BehaviorSubject<Order>(this._order);

    set_quantity(kind : string, quantity : number) {
	this._quantities[kind] = quantity;
	this.quantity_subject.next(this._quantities);
    }

    onquantities() {
	return this.quantity_subject;
    }

    onoffer() {
	return this.offer_subject;
    }

    onorder() {
	return this.order_subject;
    }

    constructor(
	private commerce : CommerceService,
    ) {

	this.reload();

	combineLatest({
	    offer: this.offer_subject,
	    q: this.quantity_subject,
	}).subscribe(
	    ev => {
		this.recalc();
		this.order_subject.next(this._order);
	    }
	);

    }

    reload() {
	this.commerce.get_offer().subscribe(
	    o => {
		this._offer = o;
		this.offer_subject.next(o);
	    }
	);
    }

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

    recalc() {

	if (!this._offer) {
//	    console.log("Can't recalculate with no offer");
	    return;
	}

	let items : ItemLine[] = [];

	let subtotal = 0;

	for (let kind in this._quantities) {

	    if (this._quantities[kind] == 0) continue;

	    if (! this._offer.offer[kind]) {
		//console.log("Can't recalculate for an item not in offer.");
		return;
	    }

	    let item : ItemLine = {
		kind: kind,
		description: this._offer.offer[kind].description,
		quantity: this._quantities[kind],
		amount: 0,
		discount: 0,
	    };

	    let price;
	    let discount;

	    for (let o of this._offer.offer[kind].offer) {
		if (o.quantity == this._quantities[kind]) {
		    price = o.price;
		    discount = o.discount;
		}
	    }

	    if (price == undefined) {
//		console.log("Wasn't offered a price for this quantity.")
		return;
	    }

	    if (price)
		item.amount = price;

	    if (discount)
		item.discount = discount;

	    items.push(item);

	    subtotal += price;

	}

	if (this._offer.vat_rate == undefined) {
//	    console.log("No VAT rate");
	    return;
	}
	    
	let vat = Math.round(subtotal * this._offer.vat_rate);
	let total = subtotal + vat;

	this._order = {
	    items: items,
	    subtotal: subtotal,
	    vat: vat,
	    vat_rate: this._offer.vat_rate,
	    total: total,
	};

	this.order_subject.next(this._order);

    }

    place_order() : Observable<string> {

	return new Observable<string>(obs => {

	    this.commerce.place_order(this._order).subscribe(
		b => {

		    // Re-fetch offer.
		    this.reload();
		    obs.next(b);
		}
	    );

	});

    }

}

