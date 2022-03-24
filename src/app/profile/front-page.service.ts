import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

export enum FrontState {
    LOGIN,
    REGISTERING,
    FORGOTTEN_PASSWORD,
    VERIFYING_EMAIL,
    APPLICATION,
};

@Injectable({
  providedIn: 'root'
})
export class FrontPageService {

    _subject = new BehaviorSubject<FrontState>(FrontState.APPLICATION);

    onchange() : Observable<FrontState> {
	return new Observable<FrontState>(obs => {
	    this._subject.subscribe(e => {
		obs.next(e);
	    });
	});
    }

    constructor() {
    }

    login() {
	this._subject.next(FrontState.LOGIN);
    }

    registering() {
	this._subject.next(FrontState.REGISTERING);
    }

    forgotten_password() {
	this._subject.next(FrontState.FORGOTTEN_PASSWORD);
    }

    verifying_email() {
	this._subject.next(FrontState.VERIFYING_EMAIL);
    }

    application() {
	this._subject.next(FrontState.APPLICATION);
    }

}

