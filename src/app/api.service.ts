
// All authenticated API requests go through this service.
// Unauthenticated requests do NOT.

// Thus, any auth error can be treated as a need to re-auth.

import { Injectable, inject } from '@angular/core';
import {
    Observable, throwError, map, catchError, retryWhen, delay,
} from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';

interface HttpRequestOptions {
  headers?: HttpHeaders;
  [key: string]: unknown;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private auth = inject(AuthService);
    private http = inject(HttpClient);


    // Delay between retries (ms), and number of tries.
    delay = 150;
    retries = 3;

    headers(headers : HttpHeaders | null, token : string) {
	if (headers == null) headers = new HttpHeaders();

	return headers.set(
	    "Authorization", `Bearer ${token}`
	);
    }

    options(options : HttpRequestOptions | null | undefined, token : string) {
	if (options) {
	    options.headers = this.headers(options.headers ?? null, token);
	    return options;
	}

	return { headers: this.headers(null, token) };
    }

    get<T>(url: string, options? : HttpRequestOptions): Observable<T> {

	return new Observable<T>(obs => {

	    const subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    const opts = this.options(options, token);

		    this.http.get<T>(url, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => {
			    let retries = 0;
			    return err.pipe(
				delay(this.delay),
				map((err : Error) => {
				    if (retries++ > this.retries) {
					throw err;
				    } else {
					return err;
				    }
				}),
			    );
			}),
		    ).subscribe({
			next: (e) => { obs.next(e); },
			error: (e) => {
			    obs.error(e);
			},
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

    put<T>(url: string, data : unknown, options? : HttpRequestOptions): Observable<T> {

	return new Observable<T>(obs => {

	    const subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    const opts = this.options(options, token);

		    this.http.put<T>(url, data, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => {
			    let retries = 0;
			    return err.pipe(
				delay(this.delay),
				map((err : Error) => {
				    if (retries++ > this.retries) {
					throw err;
				    } else {
					return err;
				    }
				}),
			    );
			}),
		    ).subscribe({
			next: (e) => { obs.next(e); },
			error: (e) => { obs.error(e); },
			complete: () => { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error: (e) => { obs.error(e); subs.unsubscribe(); },

		complete: () => { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    post<T>(url: string, data : unknown, options? : HttpRequestOptions): Observable<T> {

	return new Observable<T>(obs => {

	    const subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    const opts = this.options(options, token);

		    this.http.post<T>(url, data, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => {
			    let retries = 0;
			    return err.pipe(
				delay(this.delay),
				map((err : Error) => {
				    if (retries++ > this.retries) {
					throw err;
				    } else {
					return err;
				    }
				}),
			    );
			}),
		    ).subscribe({
			next: (e) => { obs.next(e); },
			error: (e) => { obs.error(e); },
			complete: () => { obs.complete(); },
		    })

		    subs.unsubscribe();

		},

		error: (e) => { obs.error(e); subs.unsubscribe(); },

		complete: () => { obs.complete(); subs.unsubscribe(); }

	    });

	})

    }

    delete<T>(url: string, options? : HttpRequestOptions): Observable<T> {

	return new Observable<T>(obs => {

	    const subs = this.auth.get_token().subscribe({

		next: (token) => {

		    if (token == null) {
			obs.error("Not authentication token");
			obs.complete();
			return;
		    }

		    const opts = this.options(options, token);

		    this.http.delete<T>(url, opts).pipe(
			catchError((err) => this.handle_error(err)),
			retryWhen(err => {
			    let retries = 0;
			    return err.pipe(
				delay(this.delay),
				map((err : Error) => {
				    if (retries++ > this.retries) {
					throw err;
				    } else {
					return err;
				    }
				}),
			    );
			}),
		    ).subscribe({
			next: (e) => { obs.next(e); },
			error: (e) => { obs.error(e); },
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

