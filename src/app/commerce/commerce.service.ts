
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

import { Balance, Option, Options, Order, Transaction } from './commerce.model';

@Injectable({
    providedIn: 'root'
})
export class CommerceService {

    constructor(
	private api : ApiService,
    ) {
    }

    get_transactions() : Observable<Transaction[]> {

	let url = "/api/commerce/transactions";

	return this.api.get<Transaction[]>(url);

    }

    get_transaction(id : string) : Observable<Transaction> {

	let url = "/api/commerce/transaction/" + id;

	return this.api.get<Transaction>(url);

    }

    get_offer() : Observable<Options> {

	let url = "/api/commerce/offer";

	return this.api.get<Options>(url);

    }

    balance() : Observable<Balance> {

    	let url = "/api/commerce/balance";

	return this.api.get<Balance>(url);

    }

    create_order(order : any) : Observable<any> {

	let url = "/api/commerce/create-order";

	return this.api.post<any>(url, order);

    }

    complete_order(id : string) : Observable<any> {

	let url = "/api/commerce/complete-order/" + id;

	return new Observable<any>(obs => {

	    this.api.post<any>(url, {}).subscribe(b => {
		obs.next(b);
	    });

	});

    }

    create_payment(id : string) : Observable<any> {
	let url = "/api/commerce/create-payment/" + id;

	return this.api.post<any>(url, {});

    }

    get_currencies() : Observable<string[]> {

	let url = "/api/crypto/currencies";

	return this.api.get<string[]>(url);

    }

    get_crypto_estimate(order : Order, cur : string) : Observable<string[]> {

	let url = "/api/crypto/estimate";

	return this.api.post<any>(
	    url,
	    {
		order: order,
		currency : cur,
	    }
	);

    }

    get_crypto_minimum(cur : string) : Observable<string[]> {

	let url = "/api/crypto/minimum";

	return this.api.post<any>(
	    url,
	    {
		currency : cur,
	    }
	);

    }

    create_crypto_payment(order : Order, cur : string) : Observable<string[]> {

	let url = "/api/crypto/payment";

	return this.api.post<any>(
	    url,
	    {
		order: order,
		currency : cur,
	    }
	);

    }

    get_crypto_payment_status(id : string) : Observable<string[]> {

	let url = "/api/crypto/payment/" + id;

	return this.api.get<any>(url);

    }

}

