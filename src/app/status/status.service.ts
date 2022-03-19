import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, catchError, retry } from 'rxjs';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

export class Status {
    vat : boolean = false;
    corptax : boolean = false;
    accounts : boolean = false;
}

export type Statuses = {
    [key: string]: Status,
};

@Injectable({
    providedIn: 'root'
})
export class StatusService {

    onchange_subject = new BehaviorSubject<Statuses>({});

    onchange() : Observable<Statuses> {
	return this.onchange_subject;
    }

    constructor(private http: HttpClient) {
    }

    get_list() : Observable<Statuses> {

	let url = "/api/status";

    	return this.http.get<any>(url).pipe(
	    retry(3),
	    catchError(this.handleError)
	);

    }

    get(id : string) : Observable<Status> {

	let url = "/api/status/" + id;

    	return this.http.get<any>(url).pipe(
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

