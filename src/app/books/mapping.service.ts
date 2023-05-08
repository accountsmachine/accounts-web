
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, throwError, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from '../api.service';

export class AccountInclusion {
    constructor(a : string, r : boolean) {
        this.account = a; this.reversed = r;
    }
    account : string = "";
    reversed : boolean = false;
}

export class Mapping {
    [account : string] : AccountInclusion[];
}

@Injectable({
    providedIn: 'root'
})
export class MappingService {

    id : string = "";
    mapping : Mapping | null = null;

    constructor(private api : ApiService) { }

    subject : BehaviorSubject<Mapping | null> =
	new BehaviorSubject<Mapping | null>(null);

    onload() : Observable<Mapping | null> {
	return new Observable<Mapping | null>(obs => {
	    this.subject.subscribe(c => {
		if (c) obs.next(c);
	    });
	});
    }

    set(account : string, mapping : AccountInclusion[]) {

	if (this.mapping == null) throw "No mapping to update";

	this.mapping[account] = mapping;

	return this.save();

    }

    load(id : string) : Observable<Mapping> {

	if (id == "") throw "Load not possible, id must not be empty string";

	if (id == this.id) {

	    if (this.mapping == null)
		throw "Internal error, should not be null";
	    
	    return of(this.mapping);

	}

	return new Observable<Mapping>(obs => {

	    this.api.get<Mapping>(
		"/api/books/" + id + "/mapping"
	    ).subscribe({
		next: (mapping : Mapping) => {
		    this.id = id;
		    this.mapping = mapping;
		    this.subject.next(mapping);
		    obs.next(mapping);
		},
		error: (err) => {
		    this.mapping = null;
		    this.id = "";
		    obs.error(err);
		    this.subject.next(null);
		}
	    });

	});

    }

    save() {

	if (this.id == "") throw "Save not possible, no mapping loaded";

	const httpOptions = {
	    headers: new HttpHeaders({
		'Content-Type': 'application/json'
	    })
	};

	let svc = this;

	return this.api.put(
	    "/api/books/" + this.id + "/mapping",
	    this.mapping,
	    httpOptions
	);

    }

}

