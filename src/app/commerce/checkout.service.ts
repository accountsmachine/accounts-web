import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';

import { Options, Order, ItemLine, ItemQuantities,
         CryptoEstimate, CryptoPayment, CryptoPaymentStatus,
         CryptoCurrencies
       } from './commerce.model';
import { CommerceService } from './commerce.service';

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {
    private commerce = inject(CommerceService);


    receipt_subject = new BehaviorSubject<string | null>(null);
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

    constructor() {

	this.reset();

	combineLatest({
	    offer: this.offer_subject,
	    q: this.quantity_subject,
	}).subscribe(
	    _ev => {
		this.recalc();
		this.order_subject.next(this._order);
	    }
	);

    }

    reset() {
        this._quantities = {};
	this.quantity_subject.next(this._quantities);
        this.reload_offer();
    }

    reload_offer() {
	this.commerce.get_offer().subscribe(
	    o => {
		this._offer = o;
		this.offer_subject.next(o);
	    }
	);
    }


    recalc() {

	if (!this._offer) {
	    return;
	}

	const items : ItemLine[] = [];

	let subtotal = 0;

	for (const kind in this._quantities) {

	    if (this._quantities[kind] == 0) continue;

	    if (! this._offer.offer[kind]) {
		//console.log("Can't recalculate for an item not in offer.");
		return;
	    }

	    const item : ItemLine = {
		kind: kind,
		description: this._offer.offer[kind].description,
		quantity: this._quantities[kind],
		amount: 0,
		discount: 0,
	    };

	    if (this._offer.offer[kind].adjustment) {
		item.adjustment = this._offer.offer[kind].adjustment;
	    }

	    let price;
	    let discount;

	    for (const o of this._offer.offer[kind].offer) {
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
	    
	const vat = Math.round(subtotal * this._offer.vat_rate);
	const total = subtotal + vat;

	this._order = {
	    items: items,
	    subtotal: subtotal,
	    vat: vat,
	    vat_rate: this._offer.vat_rate,
	    total: total,
	};

	this.order_subject.next(this._order);

    }

    tx_id? : string;

    create_order() : Observable<string> {
	return new Observable<string>(obs => {
	    this.commerce.create_order(this._order).subscribe(
		b => {
		    this.tx_id = b;
		    obs.next(b);
		}
	    );
	});
    }

    create_payment(id : string) : Observable<string> {
	return this.commerce.create_payment(id);
    }

    complete_payment(id: string) : Observable<string> {

	return new Observable<string>(obs => {

	    this.commerce.complete_order(id).subscribe({
		next: (b) => {
		    // Re-fetch offer.
		    this.reset();
		    obs.next(b);
		},
		error: (err : Error) => {
		    obs.error(err)
		},
		complete: () => { obs.complete() }
	    });

	});

    }

    complete_free_order() : Observable<string> {

	return new Observable<string>(obs => {

	    this.commerce.complete_free_order(this._order).subscribe({
		next: (b) => {
		    // Re-fetch offer.
		    this.reset();
		    obs.next(b);
		},
		error: (err : Error) => {
		    obs.error(err)
		},
		complete: () => { obs.complete() }
	    });

	});

    }

    get_crypto_currencies() : Observable<CryptoCurrencies> {
	return this.commerce.get_currencies();
    }

    get_crypto_estimate(cur : string) : Observable<CryptoEstimate> {
	return this.commerce.get_crypto_estimate(this._order, cur);
    }

    create_crypto_payment(cur : string) : Observable<CryptoPayment> {
	return this.commerce.create_crypto_payment(this._order, cur);
    }

    get_crypto_payment_status(id : string) : Observable<CryptoPaymentStatus> {
	return this.commerce.get_crypto_payment_status(id);
    }

    get_crypto_minimum(cur : string) : Observable<number> {
	return this.commerce.get_crypto_minimum(cur);
    }

}

