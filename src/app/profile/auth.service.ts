import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
//import { Router } from '@angular/router';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { tap } from 'rxjs/operators';


import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {
    onAuthStateChanged
} from 'firebase/auth';

export enum AuthState {
    UNINITIALISED,
    UNAUTHENTICATED,
    UNVERIFIED,
    AUTHENTICATED,
}
    

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    _auth : any | null = null;
    _user : any | null = null;
    _token : any | null = null;

    onuser_subject = new BehaviorSubject<string | null>(null);
    onauth_subject = new BehaviorSubject<any>(null);
    onstatechange_subject = new BehaviorSubject<AuthState>(AuthState.UNINITIALISED);
    onerr_subject = new Subject<string>();

    auth_state : AuthState = AuthState.UNINITIALISED;

    constructor(
	private http : HttpClient,
	public fireAuth : AngularFireAuth,
    ) {
	this.fireAuth.authState.subscribe((e : any) => {
	    this.set_auth(e);
	});
    }

    client_id = "xx";
    client_secret = "yy";
    url = "/api/oauth/token";

    onuser() : Observable<string | null> {
	return new Observable<string | null>(obs => {
	    this.onuser_subject.subscribe(e => {
		obs.next(e);
	    });
	});
    }

    onstatechange() : Observable<AuthState> {
	return new Observable<AuthState>(obs => {
	    this.onstatechange_subject.subscribe(e => {
		obs.next(e);
	    });
	});
    }

    onauth() : Observable<any> {
	return new Observable<any>(obs => {
	    this.onauth_subject.subscribe((e : any) => {
		obs.next(e);
	    });
	});
    }

    onerr() : Observable<string> {
	return new Observable<string>(obs => {
	    this.onerr_subject.subscribe(e => {
		obs.next(e);
	    });
	});
    }

    set_auth(auth : any | null) {

	this._auth = auth;

	let prev_state = (this._auth != null);

	if (auth) {
	    if (auth.emailVerified)
		this.auth_state = AuthState.AUTHENTICATED;
	    else
		this.auth_state = AuthState.UNVERIFIED;
	    this._user = auth.uid;
	    this._token = auth.auth.currentUser.accessToken;
	} else {
	    this.auth_state = AuthState.UNAUTHENTICATED;
	    this._user = null;
	    this._token = null;
	}

	this.onauth_subject.next(auth);
	this.onuser_subject.next(this._user);
	this.onstatechange_subject.next(this.auth_state);


    }

    login(user : string, password : string) {
	return new Observable<any>(obs => {
	    this.fireAuth.signInWithEmailAndPassword(
		user, password
	    ).then(
		(result) => {
		    obs.next(result);
		}
	    ).catch(
		(error) => {
		    this.onerr_subject.next(error.message);
		}
	    );
	});
    }

    create_user(user : string, password : string) {
	return new Observable<any>(obs => {
	 this.fireAuth.
		createUserWithEmailAndPassword(user, password).
		then((result) => {
		    obs.next(result);
		}).
		catch((error) => {
		    this.onerr_subject.next(error.message);
		});
	});
    }

    logout() {
	this.fireAuth.signOut();
//	this.set_auth(null);
    }

    get_token() : Observable<string | null> {
	return new Observable<string | null>(obs => {
	    this._auth.auth.currentUser.getIdToken(
	    ).then(
		(t : any) => obs.next(t)
	    ).catch(
		(error : any) => {
		    obs.error(error.message);
		}
	    )
	});
    }

    email_reset(user : string) : Observable<void> {
	return new Observable<void>(obs => {
	    this.fireAuth.sendPasswordResetEmail(
		user
	    ).then(
		(t : any) => {
		    this.onerr_subject.next(
			"A password reset email has been emailed to you."
		    );
		    obs.next()
		}
	    ).catch(
		(error : any) => {
		    obs.error(error.message);
		}
	    )
	});
    }

    change_name(name : string) : Observable<void> {
	return new Observable<void>(obs => {
	    this.fireAuth.currentUser.then(res =>
		    res!.updateProfile(
			{ displayName: name }

		    ).then(
			(t : any) => {
			    this.onerr_subject.next(
				"Profile saved"
			    );
			    obs.next()
			}
		    ).catch(
			(error : any) => {
			    obs.error(error.message);
			}
		    )
	    )
	});

    }
    
    change_email(email : string) : Observable<void> {
	return new Observable<void>(obs => {
	    this.fireAuth.currentUser.then(res =>
		    res!.updateEmail(
			email
		    ).then(
			(t : any) => {
			    this.onerr_subject.next(
				"Profile saved"
			    );
			    obs.next()
			}
		    ).catch(
			(error : any) => {
			    obs.error(error.message);
			}
		    )
	    )
	});

    }
    
    send_email_verification() : Observable<void> {
	return new Observable<void>(obs => {
	    this.fireAuth.currentUser.then(res =>
		    res!.sendEmailVerification(
		    ).then(
			(t : any) => {
			    this.onerr_subject.next(
				"Verification sent"
			    );
			    obs.next()
			}
		    ).catch(
			(error : any) => {
			    obs.error(error.message);
			}
		    )
	    )
	});

    }
    
    change_password(password : string) : Observable<void> {
	return new Observable<void>(obs => {
	    this.fireAuth.currentUser.then(res =>
		res!.updatePassword(
		    password
		    ).then(
			(t : any) => {
			    this.onerr_subject.next(
				"Password set"
			    );
			    obs.next()
			}
		    ).catch(
			(error : any) => {
			    obs.error(error.message);
			}
		    )
	    )
	});

    }
    
    delete_user() : Observable<void> {
	return new Observable<void>(obs => {
	    this.fireAuth.currentUser.then(res =>
		res!.delete(
		    ).then(
			(t : any) => {
			    this.onerr_subject.next(
				"Account is deleted"
			    );
			    obs.next()
			}
		    ).catch(
			(error : any) => {
			    obs.error(error.message);
			}
		    )
	    )
	});

    }
    
    authenticated() : boolean {
	return this._user != null;
    }

}

