import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

export enum FrontState {
    LOGIN,
    REGISTERING,
    FORGOTTEN_PASSWORD,
    VERIFYING_EMAIL,
    APPLICATION,
    VIEWING_PROFILE,
    UPDATING_PROFILE,
    CHANGING_EMAIL,
    CHANGING_PASSWORD,
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

    profile() {
	this._subject.next(FrontState.VIEWING_PROFILE);
    }

    updating_profile() {
	this._subject.next(FrontState.UPDATING_PROFILE);
    }

    changing_email() {
	this._subject.next(FrontState.CHANGING_EMAIL);
    }

    changing_password() {
	this._subject.next(FrontState.CHANGING_PASSWORD);
    }

}

