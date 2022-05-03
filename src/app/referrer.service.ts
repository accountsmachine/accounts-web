
import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferrerService {

    _subject = new BehaviorSubject<string>("");

    onchange() : Observable<string> {
	return new Observable<string>(obs => {
	    this._subject.subscribe(e => {
		obs.next(e);
	    });
	});
    }

    constructor() {
    }

    publish(token : string) {
	this._subject.next(token);
    }

}

