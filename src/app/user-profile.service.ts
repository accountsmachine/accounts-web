import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';

export class UserProfile {
    features : Set<string> = new Set<string>();
    constructor(features : string[]) {
	this.features = new Set(features);
    }
    has_feature(x : string) { return this.features.has(x); }
};

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

    profile : UserProfile = new UserProfile([]);

    onload_subject = new BehaviorSubject<UserProfile>(new UserProfile([]));

    onload() : Observable<UserProfile> {
	this.load().subscribe(e => {});
	return this.onload_subject;
    }

    constructor() { }

    load() : Observable<UserProfile> {

	let up = new UserProfile(
	    ["vat", "corptax", "company", "books", "accounts", "creds",
	     "status"]
	);

	return of(up).pipe(
	    tap((e : UserProfile) => {
		this.profile = e;
		this.onload_subject.next(e);
	    })
	);
	
    }

}

