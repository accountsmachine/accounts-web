
import { Injectable } from '@angular/core';
import { Observable, tap, throwError, map, catchError, ObservableInput } from 'rxjs';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import { AuthService } from './profile/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(
	private auth : AuthService,
	private http : HttpClient,
    ) {
    }

    headers(headers : any, token : string) {
	if (headers == null) headers = new HttpHeaders();

	return headers.set(
	    "Authorization", `Bearer ${token}`
	);
    }

    options(options : any, token : string) {
	if (options) {
	    options.headers = this.headers(options.headers, token);
	    return options;
	}

	return { headers: this.headers(null, token) };
    }

    get<T>(url: string, options? : any): Observable<T> {

	let svc = this;

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next(token) {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = svc.options(options, token);

		    svc.http.get<T>(url, opts).subscribe({
			next(e : any) { obs.next(e); },
			error(e : any) { obs.error(e); },
			complete() { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error(e) { obs.error(e); subs.unsubscribe(); },

		complete() { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    private handleError(error: HttpErrorResponse) {
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

    put<T>(url: string, data : any, options? : any): Observable<T> {

	let svc = this;

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next(token) {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = svc.options(options, token);

		    svc.http.put<T>(url, data, opts).subscribe({
			next(e : any) { obs.next(e); },
			error(e : any) { obs.error(e); },
			complete() { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error(e) { obs.error(e); subs.unsubscribe(); },

		complete() { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    post<T>(url: string, data : any, options? : any): Observable<T> {

	let svc = this;

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next(token) {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = svc.options(options, token);

		    svc.http.post<T>(url, data, opts).subscribe({
			next(e : any) { obs.next(e); },
			error(e : any) { obs.error(e); },
			complete() { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error(e) { obs.error(e); subs.unsubscribe(); },

		complete() { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    delete<T>(url: string, options? : any): Observable<T> {

	let svc = this;

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next(token) {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = svc.options(options, token);

		    svc.http.delete<T>(url, opts).subscribe({
			next(e : any) { obs.next(e); },
			error(e : any) { obs.error(e); },
			complete() { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error(e) { obs.error(e); subs.unsubscribe(); },

		complete() { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

}

