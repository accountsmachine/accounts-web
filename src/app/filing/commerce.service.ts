
import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, Subject, throwError, map, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

import { ApiService } from '../api.service';

export type Transaction = {
    id : string,
    company : string,
    uid : string,
    email : string,
    kind : string,
    opened : string,
    expires : string,
    purchaser : string,
    address : string[],
    postcode : string,
    country : string,
    valid : boolean,
    billing_country : string,
    vat_rate : number,
    vat_number : string,
    status? : string,
    provides : string[],
};

export type Balance = {
    uid : string,
    email : string,
    credits : {
	[kind : string] : number
    }
};

export type Option = {
};

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

	return new Observable<Transaction[]>(obs => {

	    this.api.get<Transaction[]>(url).subscribe(
		tx => obs.next(tx)
	    )

	});

    }

    get_options() : Observable<Option[]> {

	let url = "/api/commerce/options";

	return new Observable<Option[]>(obs => {

	    this.api.get<Option[]>(url).subscribe(
		tx => obs.next(tx)
	    )

	});

    }

    get_balance() : Observable<Balance> {

	let url = "/api/commerce/balance";

	return new Observable<Balance>(obs => {

	    this.api.get<Balance>(url).subscribe(
		tx => obs.next(tx)
	    )

	});

    }

    purchase(kind : string, count : number) : Observable<Balance> {

	let url = "/api/commerce/purchase/" + kind;

	return new Observable<Balance>(obs => {

	    this.api.post<Balance>(url, { count: count }).subscribe(
		tx => obs.next(tx)
	    )

	});

    }

}

