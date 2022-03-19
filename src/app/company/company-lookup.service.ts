
// FIXME: Need to handle 'not found' better.

import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, Subject, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CompanyLookupService {

    get(crn : string) : Observable<any> {

	let url = "/api/company-reg/" + crn;

	return this.http.get<any>(url).pipe(
	    retry(3),
	    catchError(this.handleError)
	);

    }

    constructor(
	private http : HttpClient,
    ) {
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

