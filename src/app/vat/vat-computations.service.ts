
// FIXME: Should cache information.

import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, Subject, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { VatConfig } from './vat-config';

export class VatComputations {
    PeriodStart : string = "";
    PeriodEnd : string = "";
    VatDueSales : number = 0;
    VatDueAcquisitions : number = 0;
    TotalVatDue : number = 0;
    VatReclaimedCurrPeriod : number = 0;
    NetVatDue : number = 0;
    TotalValueSalesExVAT : number = 0;
    TotalValuePurchasesExVAT : number = 0;
    TotalValueGoodsSuppliedExVAT : number = 0;
    TotalAcquisitionsExVAT : number = 0;
};

@Injectable({
    providedIn: 'root'
})
export class VatComputationsService {

    config : any | null = null;
    record : VatComputations = new VatComputations();

    onload_subject : Subject<VatComputations> = new Subject<VatComputations>();

    onload() {
	return new Observable<VatComputations>(obs => {
	    this.onload_subject.subscribe(e => obs.next(e));
	});
    }

    constructor(
	private http: HttpClient,
    ) {

    }

    load(id : string) {
	let url = "/api/vat/compute/" + id;

	return new Observable<VatComputations>(obs => {
	    this.http.post<VatComputations>(url, {}).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(
		(rec : VatComputations) => {
		    this.record = rec;
		    this.onload_subject.next(rec);
		    obs.next(rec);
		}
	    );
	});
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

