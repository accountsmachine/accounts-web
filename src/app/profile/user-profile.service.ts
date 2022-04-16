
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from '../api.service';

export class UserProfile {
    features : Set<string> = new Set<string>();
    billing_name : string = "";
    billing_city : string = "";
    billing_county : string = "";
    billing_country : string = "";
    billing_postcode : string = "";
    billing_address : string[] = [];
    billing_tel : string = "";
    billing_email : string = "";
    billing_vat : string = "";
    has_feature(x : string) { return this.features.has(x); }
};

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

    profile : UserProfile | null = new UserProfile();

    subject : BehaviorSubject<UserProfile | null> =
	new BehaviorSubject<UserProfile | null>(null);

    chgobs : Subject<boolean> = new Subject<boolean>();

    onload() : Observable<UserProfile | null> {
	return new Observable<UserProfile | null>(obs => {
	    this.subject.subscribe(c => {
		obs.next(c);
	    });
	});
    }

    reset() {
	this.profile = new UserProfile();
	this.subject.next(this.profile);
    }

    onchange() : Observable<UserProfile | null> {
	// FIXME?!
//	this.load().subscribe(e => {});
	return this.subject;
    }

    constructor(
	private api : ApiService,
    ) { }

    load() : Observable<UserProfile> {

	return new Observable<UserProfile>(obs => {

	    this.api.get<UserProfile>(
		"/api/user-account/profile"
	    ).subscribe({
		next: p => {
		    this.profile = p;
		    this.subject.next(p);
		    obs.next(p);
		},
		error: (err) => {
		    this.profile = new UserProfile();
		    obs.error(err);
		},
		complete: () => { }
	    });

	});

    }

    // Must subscribe.
    save() {

	const httpOptions = {
	    headers: new HttpHeaders({
		'Content-Type': 'application/json'
	    })
	};

	let svc = this;

	return this.api.put(
	    "/api/user-account/profile", this.profile,
	    httpOptions
	).pipe(
	    tap({
		error: (err) => {
		},
		complete: () => {
		}
	    })
	);

    }

    change() {
	this.subject.next(this.profile!);
    }

    get billing_name() { return this.profile!.billing_name; }
    set billing_name(c) { this.profile!.billing_name = c; this.change(); }
    get billing_address() { return this.profile!.billing_address; }
    set billing_address(c) { this.profile!.billing_address = c; this.change(); }
    get billing_city() { return this.profile!.billing_city; }
    set billing_city(c) { this.profile!.billing_city = c; this.change(); }
    get billing_county() { return this.profile!.billing_county; }
    set billing_county(c) { this.profile!.billing_county = c; this.change(); }
    get billing_country() { return this.profile!.billing_country; }
    set billing_country(c) { this.profile!.billing_country = c; this.change(); }
    get billing_postcode() { return this.profile!.billing_postcode; }
    set billing_postcode(c) { this.profile!.billing_postcode = c; this.change(); }
    get billing_email() { return this.profile!.billing_email; }
    set billing_email(c) { this.profile!.billing_email = c; this.change(); }
    get billing_tel() { return this.profile!.billing_tel; }
    set billing_tel(c) { this.profile!.billing_tel = c; this.change(); }
    get billing_vat() { return this.profile!.billing_city; }
    set billing_vat(c) { this.profile!.billing_city = c; this.change(); }
					  
}

