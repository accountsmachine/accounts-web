
import { Injectable } from '@angular/core';
import {
    Observable, tap, throwError, map, catchError, ObservableInput, retryWhen,
} from 'rxjs';
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

    error(thing : Error) {

	// If 401 or 403 error, just logout
	if (thing instanceof HttpErrorResponse) {
            if ([401, 403].includes(thing.status) &&
		this.auth.authenticated()) {
                // auto logout if 401 or 403 response returned from api
		this.auth.error("You have been logged out");
                this.auth.logout();
            }
	}

	return thing;
    }

    get<T>(url: string, options? : any): Observable<T> {

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = this.options(options, token);

		    this.http.get<T>(url, opts).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { return obs.error(this.error(e)); },
			complete: () => { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error: (e) => { obs.error(e); subs.unsubscribe(); },

		complete: () => { obs.complete(); subs.unsubscribe(); }

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

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = this.options(options, token);

		    this.http.put<T>(url, data, opts).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { return obs.error(this.error(e)); },
			complete: () => { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error: (e) => { obs.error(e); subs.unsubscribe(); },

		complete: () => { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    post<T>(url: string, data : any, options? : any): Observable<T> {

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = this.options(options, token);

		    this.http.post<T>(url, data, opts).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { return obs.error(this.error(e)); },
			complete: () => { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error: (e) => { obs.error(e); subs.unsubscribe(); },

		complete: () => { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    delete<T>(url: string, options? : any): Observable<T> {

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = this.options(options, token);

		    this.http.delete<T>(url, opts).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { return obs.error(this.error(e)); },
			complete: () => { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error: (e) => { obs.error(e); subs.unsubscribe(); },

		complete: () => { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

}

