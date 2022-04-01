import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { client_version, application_name, application_id } from '../../version';

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

    error(err : string) {
	this.onerr_subject.next(err);
    }

    constructor(
	private http : HttpClient,
	public fireAuth : AngularFireAuth,
    ) {

	let svc = this;

	this.fireAuth.authState.subscribe({
	    next(e : any) { svc.set_auth(e); },
	    error(err : any) { },
	    complete() {}
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
	    this.onauth_subject.subscribe({
		next(e : any) { obs.next(e); },
		error(e : Error) { },
		complete() {}
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

		    if (error.code == "auth/invalid-email")
			this.onerr_subject.next("Invalid email address for login");
		    else if (error.code == "auth/app-not-authorized")
			this.onerr_subject.next("Application is not authorised");
		    else if (error.code == "auth/argument-error")
			this.onerr_subject.next("Argument error");
		    else if (error.code == "auth/invalid-api-key")
			this.onerr_subject.next("Invalid API key");
		    else if (error.code == "auth/invalid-user-token")
			this.onerr_subject.next("Invalid user token");
		    else if (error.code == "auth/invalid-tenant-id")
			this.onerr_subject.next("Invalid tenant ID");
		    else if (error.code == "auth/network-request-failed")
			this.onerr_subject.next("Network request failed");
		    else if (error.code == "auth/operation-not-allowed")
			this.onerr_subject.next("Operation not allowed");
		    else if (error.code == "auth/requires-recent-login")
			this.onerr_subject.next("Requires recent login");
		    else if (error.code == "auth/too-many-requests")
			this.onerr_subject.next("Too many requests");
		    else if (error.code == "auth/unauthorized-domain")
			this.onerr_subject.next("Unauthorized domain");
		    else if (error.code == "auth/user-disabled")
			this.onerr_subject.next("User accounts has been deactivated");
		    else if (error.code == "auth/user-token-expired")
			this.onerr_subject.next("User token has expired");	
		    else if (error.code == "auth/web-storage-unsupported")
			this.onerr_subject.next("Web storage unsupported");	
	    else
			this.onerr_subject.next("ERROR NOT KNOWN " + error.code);
		    obs.error(error);
		}
	    );
	});
    }

    create_user(user : string, password : string, phone : string,
		name : string) {

	let headers = new HttpHeaders({
		"X-Client-Version": client_version,
		"X-Application-Name": application_name,
		"X-Application-ID": application_id,
	});

	return new Observable<void>(obs => {

	    this.http.post("/api/user-account/register", {
		email: user,
		password: password,
		phone_number: phone,
		display_name: name,
	    }, {"responseType": "text", headers: headers}).subscribe(e => {
		obs.next();
	    });

	});
	    
    }

    logout() {
	this.fireAuth.signOut();
    }

    get_token() : Observable<string | null> {
	return new Observable<string | null>(obs => {
	    this.fireAuth.idToken.subscribe({
		next(e) { obs.next(e); },
		error(e) { obs.error(e); },
		complete() { obs.complete(); },
	    });
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

