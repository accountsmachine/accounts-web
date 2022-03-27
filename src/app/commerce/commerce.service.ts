
import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, map, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

import { ApiService } from '../api.service';

import { Balance, Option, Options, Transaction } from './commerce.model';

@Injectable({
    providedIn: 'root'
})
export class CommerceService {

    balance_subject = new BehaviorSubject<Balance>({
	uid: "",
	email : "",
	credits: {}
    });

    constructor(
	private api : ApiService,
    ) {
	this.update_balance();
    }

    update_balance() {
	let url = "/api/commerce/balance";

	this.api.get<Balance>(url).subscribe((b : Balance) =>
	    this.balance_subject.next(b)
	);
    }

    get_transactions() : Observable<Transaction[]> {

	let url = "/api/commerce/transactions";

	return new Observable<Transaction[]>(obs => {

	    this.api.get<Transaction[]>(url).subscribe(
		tx => obs.next(tx)
	    )

	});

    }

    get_transaction(id : string) : Observable<Transaction> {

	let url = "/api/commerce/transaction/" + id;

	return new Observable<Transaction>(obs => {

	    this.api.get<Transaction>(url).subscribe(
		tx => obs.next(tx)
	    )

	});

    }

    get_offer() : Observable<Options> {

	let url = "/api/commerce/offer";

	return new Observable<Options>(obs => {

	    this.api.get<Options>(url).subscribe(
		tx => obs.next(tx)
	    )

	});

    }

    onbalance() : Observable<Balance> {

	return new Observable(obs => {
	    this.balance_subject.subscribe(b => obs.next(b));
	});

    }

    place_order(order : any) : Observable<Balance> {

	let url = "/api/commerce/place-order";

	return new Observable<Balance>(obs => {

	    this.api.post<Balance>(url, order).subscribe(b => {
		this.balance_subject.next(b);
		obs.next(b);
	    });

	});

    }

}

