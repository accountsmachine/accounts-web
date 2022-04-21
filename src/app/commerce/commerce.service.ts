
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
        vat: 0, corptax: 0, accounts: 0,
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

    onbalance() : Observable<Balance> {

	return new Observable(obs => {
	    this.balance_subject.subscribe(b => obs.next(b));
	});

    }

    create_order(order : any) : Observable<any> {

	let url = "/api/commerce/create-order";

	return this.api.post<any>(url, order);

    }

    complete_order(id : string) : Observable<any> {

	let url = "/api/commerce/complete-order/" + id;

	return new Observable<any>(obs => {

	    this.api.post<any>(url, {}).subscribe(b => {
		this.update_balance();
		obs.next(b);
	    });

	});

    }

    create_payment(id : string) : Observable<any> {
	let url = "/api/commerce/create-payment/" + id;

	return this.api.post<any>(url, {});

    }

}

