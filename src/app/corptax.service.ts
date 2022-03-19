import { Injectable } from '@angular/core';
import { Observable, of, catchError, retry } from 'rxjs';
import { map, throwError } from 'rxjs';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CorptaxService {

    constructor(private http: HttpClient) { }

    authorize(id : string, gateway_id : string, password : string) {

	let url = "/api/corptax/authorize/" + id;

    	return this.http.post<any>(
	    url, { gateway_id: gateway_id, password: password }
	).pipe(
	    retry(3),
	    catchError(this.handleError)
	);
    }

    deauthorize(c : string) : Observable<void> {

	let url = "/api/corptax/deauthorize/" + c;

    	return this.http.post<any>(
	    url, {}
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
