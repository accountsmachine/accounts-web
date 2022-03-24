
import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, Subject, throwError, map, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import * as moment from 'moment';

export type Subscription = {
    id : string,
    company : string,
    uid : string,
    email : string,
    kind : string,
    opened : string,
    expires : string,
    purchaser : string,
    address : string[],
    postcode : string,
    country : string,
    valid : boolean,
    billing_country : string,
    vat_rate : number,
    vat_number : string,
    status? : string,
    provides : string[],
};

export type Option = {
    name : string,
    price : number,
    comprised : Subscription[],
};

export type LoadEvent = {
    id : string,
    subscription : Subscription,
};

@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {

    id : string = "";
    subs : Subscription | null = null;

    constructor(
	private http: HttpClient,
    ) {
    }

    unload() {
	this.id = "";
	this.subs = null;
    }

    list() : Observable<Subscription[]> {

	let url = "/api/subscriptions";

	return new Observable<Subscription[]>(obs => {

	    this.http.get<Subscription[]>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(res => {

		let f : Subscription[] = [];
		for (var id in res) {
		    f.push(res[id]);
		    res[id]["id"] = id;
		}

		obs.next(f);

	    });

	});
					   
    }

    get_options(company : string) : Observable<Option[]> {

	let url = "/api/subscriptions/" + company + "/options";

	return new Observable<Option[]>(obs => {

	    this.http.get<Option[]>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(res => {
	        obs.next(res);
	    });

	});
					   
    }

    private onload_subject : Subject<LoadEvent> = new Subject<LoadEvent>();

    // Triggered on create and save.
    onload() : Observable<LoadEvent> {
	return new Observable<LoadEvent>(obs => {
	    if (this.id != "" && this.subs)
		obs.next({id: this.id, subscription: this.subs});
	    this.onload_subject.subscribe(e => {
		obs.next(e);
	    });
	});
    }

    // Must subscribe, returns a ConfigEvent when loaded.  Only triggers
    // onload event if a new config is loaded.
    load(id : string) : Observable<LoadEvent> {

	if (id == this.id) {
	    if (this.subs)
		return of<LoadEvent>({id: this.id, subscription: this.subs});
	}

	let url = "/api/subscription/" + id;

	return new Observable(obs => {

	    this.http.get<Subscription>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(subs => {
		this.id = id;
		this.subs = subs;
		this.onload_subject.next({id: this.id, subscription: this.subs});
		obs.next({id: this.id, subscription: this.subs});
	    });

	});

    }

    take(company : string, kind : string) {

	let url = "/api/subscription/" + company + "/" + kind;

	return new Observable<string>(obs => {

	    return this.http.post<string>(url, {}).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(e => {
		obs.next(e);
	    });
	});

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

    create(company : string, kind : string) : Subscription {

	let now = moment.utc();

	let expires = now.clone();

	if (kind.endsWith("-6-months")) expires.add(6, "months");
	if (kind.endsWith("-1-year")) expires.add(1, "years");
	if (kind.endsWith("-2-year")) expires.add(2, "years");

	let obj : Subscription = {
	    id: "",
	    company: company,
	    uid: "",
	    email: "",
	    kind: kind,
	    opened: now.format(),
	    expires: expires.format(),
	    purchaser: "",
	    address: [],
	    postcode: "",
	    country: "",
	    valid: true,
	    billing_country: "",
	    vat_rate: 20,
	    vat_number: "",
	    provides: [],
	};

	if (kind.startsWith("vat-")) obj.provides = ["vat"];
	if (kind.startsWith("corptax-")) obj.provides = ["corptax"];
	if (kind.startsWith("accounts-")) obj.provides = ["accounts"];
	if (kind.startsWith("all-")) obj.provides = ["vat", "corptax", "accounts"];

	return obj;

    }

}

