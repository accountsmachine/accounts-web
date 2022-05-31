
// All authenticated API requests go through this service.
// Unauthenticated requests do NOT.

// Thus, any auth error can be treated as a need to re-auth.

import { Injectable } from '@angular/core';
import {
    Observable, tap, throwError, map, catchError, ObservableInput, retryWhen,
    take, delay, concat, concatMap,
} from 'rxjs';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';

import { AuthService } from './auth.service';

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

	return new Observable<T>(obs => {

	    let subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    let opts = this.options(options, token);

		    this.http.get<T>(url, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => err.pipe(
			    delay(250),
			    take(3),
			    concatMap(throwError),
			)),
		    ).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { obs.error(e); },
			complete: () => { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error: (e) => { obs.error(e); subs.unsubscribe(); },

		complete: () => { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    private handle_error(error: HttpErrorResponse) {

    	// FIXME: Remove all this logging.
	console.log("Error", error);

	if (error.status === 0) {
	    // A client-side or network error
	    return throwError(() => error);
	}

	// If 401 or 403 error, just logout
        if ([401, 403].includes(error.status) && this.auth.authenticated()) {

	    console.log("401/403 error case");

            // auto logout if 401 or 403 response returned from api
	    this.auth.error("You have been logged out");
            this.auth.logout();

	}

	console.log("API error");

	// The backend returned an unsuccessful response code.
	return throwError(() => error);

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

		    this.http.put<T>(url, data, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => err.pipe(
			    delay(250),
			    take(3),
			    concatMap(throwError),
			)),
		    ).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { obs.error(e); },
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

		    this.http.post<T>(url, data, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => err.pipe(
			    delay(250),
			    take(3),
			    concatMap(throwError),
			)),
		    ).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { obs.error(e); },
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

		    this.http.delete<T>(url, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => err.pipe(
			    delay(250),
			    take(3),
			    concatMap(throwError),
			)),
		    ).subscribe({
			next: (e : any) => { obs.next(e); },
			error: (e : any) => { obs.error(e); },
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

