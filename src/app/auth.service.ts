import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {
    onAuthStateChanged
} from 'firebase/auth';

import {
    client_version, application_name, application_id
} from '../version';

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
			this.error("Invalid email address for login");
		    else if (error.code == "auth/app-not-authorized")
			this.error("Application is not authorised");
		    else if (error.code == "auth/argument-error")
			this.error("Argument error");
		    else if (error.code == "auth/invalid-api-key")
			this.error("Invalid API key");
		    else if (error.code == "auth/invalid-user-token")
			this.error("Invalid user token");
		    else if (error.code == "auth/invalid-tenant-id")
			this.error("Invalid tenant ID");
		    else if (error.code == "auth/network-request-failed")
			this.error("Network request failed");
		    else if (error.code == "auth/operation-not-allowed")
			this.error("Operation not allowed");
		    else if (error.code == "auth/requires-recent-login")
			this.error("Requires recent login");
		    else if (error.code == "auth/too-many-requests")
			this.error("Too many requests");
		    else if (error.code == "auth/unauthorized-domain")
			this.error("Unauthorized domain");
		    else if (error.code == "auth/user-disabled")
			this.error("User accounts has been deactivated");
		    else if (error.code == "auth/user-token-expired")
			this.error("User token has expired");	
		    else if (error.code == "auth/web-storage-unsupported")
			this.error("Web storage unsupported");	
		    else
			this.error("ERROR NOT KNOWN " + error.code);
		    obs.error(error);
		}
	    );
	});
    }

    create_user(user : string, password : string, phone : string,
		name : string, ref? : string) {

	let headers = new HttpHeaders({
		"X-Client-Version": client_version,
		"X-Application-Name": application_name,
		"X-Application-ID": application_id,
	});

	let reg : any = {
	    email: user,
	    password: password,
	    phone_number: phone,
	    display_name: name,
	};

	if (ref) reg["ref"] = ref;

	return new Observable<void>(obs => {

	    this.http.post(
		"/api/user-account/register", reg,
		{ "responseType": "text", headers: headers }
	    ).subscribe({
		next: () => obs.next(),
		error: (e) => {
		    try {
			let err = JSON.parse(e.error);
		        this.error(err.message);
		        obs.error(err.message);
			return;
		    } catch (e) {
		    }
		    this.error(e.error);
		    obs.error(e.error);
		},
		complete: () => obs.complete()
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
		    this.error(
			"A password reset email has been emailed to you."
		    );
		    obs.next();
		    obs.complete();
		}
	    ).catch(
		(error : any) => {
		    obs.error(error.message);
		    this.error(error.message);
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
			    this.error(
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
			    this.error(
				"Email address updated.  An email has been sent to the new address."
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
			    this.error(
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

		res!.updatePassword(password).then(
		    (t : any) => {
			this.error(
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
    
    delete_user() {

	let subs = this.get_token().subscribe({
	
	    next: (token : string | null) => {

		if (token == null) {
		    console.log("Delete user: No authentication token");
		    return;
		}

		let headers = new HttpHeaders({
		    "Authorization": `Bearer ${token}`,
		});

		this.http.post(
		    "/api/user-account/delete", {}, {headers: headers}
		).subscribe({

		    next: (e : any) => {
			console.log("User deletion successful.");
			this.logout();
		    },

		    error: (e : any) => {
			console.log(e);
		    },

		    complete: () => {
		    }

		});

		subs.unsubscribe();

	    },

	    error: (e : any) => {
		console.log(e);
	    	subs.unsubscribe();
	    },

	    complete: () => {
		subs.unsubscribe();
	    },

	});

    }
    
    authenticated() : boolean {
	return this._user != null;
    }

}

