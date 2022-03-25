
import { Injectable } from '@angular/core';
import { Observable, Subject, of, BehaviorSubject, throwError, map } from 'rxjs';
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

    headers(token : string) {
	const headers = new HttpHeaders();
	return headers.set("Authorization", `Bearer ${token}`);
    }

    options(token : string) {
	return { headers: this.headers(token) };
    }

    add_header(opts : any, token : string) {
	opts.headers = opts.headers.set(
	    "Authorization", `Bearer ${token}`
	);
	return opts;
    }

    get<T>(url: string): Observable<T> {

	return new Observable<T>(obs => {

	    this.auth.get_token().subscribe(token => {

		if (token == null) {
		    obs.error("Not authentication token");
		    return;
		}

		this.http.get<T>(url, this.options(token)).subscribe({
		    next(e : any) { obs.next(e); },
		    error(e : any) { obs.error(e); },
		    complete() { obs.complete(); },
		})

	    });

	});

    }

    put<T>(url: string, data : any, options : any): Observable<T> {

	return new Observable<T>(obs => {

	    this.auth.get_token().subscribe(token => {

		if (token == null) {
		    obs.error("Not authentication token");
		    return;
		}

		let opts = this.add_header(options, token);

		this.http.put<T>(url, data, this.options(token)).subscribe({
		    next(e : any) { obs.next(e); },
		    error(e : any) { obs.error(e); },
		    complete() { obs.complete(); },
		})

	    });

	});

    }

    delete<T>(url: string): Observable<T> {

	return new Observable<T>(obs => {

	    this.auth.get_token().subscribe(token => {

		if (token == null) {
		    obs.error("Not authentication token");
		    return;
		}

		this.http.delete<T>(url, this.options(token)).subscribe({
		    next(e : any) { obs.next(e); },
		    error(e : any) { obs.error(e); },
		    complete() { obs.complete(); },
		})

	    });

	});

    }

}

