import { Injectable } from '@angular/core';
import { Observable, of, catchError, retry } from 'rxjs';
import { map, throwError } from 'rxjs';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import { DeviceIdService } from './../device-id.service';

export type Obligation = {
    status: string,
    periodKey: string,
    start: Date,
    end: Date,
    received?: Date,
    due: Date,
};

export type Payment = {
    amount: number,
    received: Date,
};

export type Liability = {
    type: string,
    originalAmount: number,
    outstandingAmount?: number,
    taxPeriod: {
	from: Date,
	to: Date,
    },
    due: Date,
};

export type Return = {
    periodKey: string,
    vatDueSales: number,
    vatDueAcquisitions: number,
    totalVatDue: number,
    vatReclaimedCurrPeriod: number,
    netVatDue: number,
    totalValueSalesExVAT: number,
    totalValuePurchasesExVAT: number,
    totalValueGoodsSuppliedExVAT: number,
    totalAcquisitionsExVAT: number,
};

@Injectable({
    providedIn: 'root'
})
export class VatService {

    constructor(
	private http : HttpClient,
	private device : DeviceIdService,
    ) {
    }

    code = "";
    state = "";

    options = {
	headers: new HttpHeaders({
	    "X-Device-ID": this.device.get_id(),
	    "X-Device-TZ": this.device.get_tz(),
	    "X-Screen": this.device.get_screen_params(),
	})
    };

    getObligations(
	cid : string, start : string, end : string
    ) : Observable<Obligation[]> {

	let url = "/api/vat/obligations/" + cid;
	url = url + "?start=" + start;
	url = url + "&end=" + end;

    	return this.http.get<Obligation[]>(
	    url, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);
    }

    getOpenObligations(cid : string) : Observable<Obligation[]> {

	let url = "/api/vat/open-obligations/" + cid;

    	return this.http.get<Obligation[]>(
	    url, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);
    }

    getPayments(
	cid : string, start : string, end : string
    ) : Observable<Payment[]> {
	let url = "/api/vat/payments/" + cid;
	url = url + "?start=" + start;
	url = url + "&end=" + end;

    	return this.http.get<Payment[]>(
	    url, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);
    }

    getLiabilities(
	cid : string, start : string, end : string
    ) : Observable<Liability[]> {
	let url = "/api/vat/liabilities/" + cid;
	url = url + "?start=" + start;
	url = url + "&end=" + end;

    	return this.http.get<Liability[]>(
	    url, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);
    }

    getReturns(
	cid : string, start : string, end : string
    ) : Observable<Return[]> {
	let url = "/api/vat/returns/" + cid;
	url = url + "?start=" + start;
	url = url + "&end=" + end;

    	return this.http.get<Return[]>(
	    url, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);
     }

    receiveToken(code : any, state : any) {
	this.code = code;
	this.state = state;
    }

    authenticated() : boolean {
        return this.code != "";
    }

    get_auth_url(c : string) : Observable<string> {

	let url = "/api/vat/authorize/" + c;

    	return this.http.get<any>(
	    url, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError),
	    map(e => e.url)
	);

    }

    deauthorize(c : string) : Observable<void> {

	let url = "/api/vat/deauthorize/" + c;

    	return this.http.post<any>(
	    url, {}, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);

    }

    submit(id : string) {

	let url = "/api/vat/submit/" + id;

    	return this.http.post<any>(
	    url, {}, this.options
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);

    }

    private handleError(error: HttpErrorResponse) {
	console.log(error);
	if (error.status === 0) {
	    // A client-side or network error
	    console.error('An error occurred:', error.error);
	} else {
	    // The backend returned an unsuccessful response code.
	    console.error(
		`Backend returned code ${error.status}, body was: `,
		error.error);
	}

	// Return an observable with a user-facing error message.
	return throwError(() =>
	    new Error('Something bad happened; please try again later.'));
    }

}

