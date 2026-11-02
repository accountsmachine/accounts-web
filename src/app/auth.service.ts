import { Injectable, inject } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

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
    private http = inject(HttpClient);
    fireAuth = inject(AngularFireAuth);


    _auth : firebase.User | null = null;
    _user : string | null = null;
    _token : string | null = null;

    onuser_subject = new BehaviorSubject<string | null>(null);
    onauth_subject = new BehaviorSubject<firebase.User | null>(null);
    onstatechange_subject = new BehaviorSubject<AuthState>(AuthState.UNINITIALISED);
    onerr_subject = new Subject<string>();

    auth_state : AuthState = AuthState.UNINITIALISED;

    error(err : string) {
	this.onerr_subject.next(err);
    }

    constructor() {

	this.fireAuth.authState.subscribe({
	    next: (e) => { this.set_auth(e); },
	    error: (_err) => { },
	    complete: () => {}
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

    onauth() : Observable<firebase.User | null> {
	return new Observable<firebase.User | null>(obs => {
	    this.onauth_subject.subscribe({
		next(e) { obs.next(e); },
		error(_e : Error) { },
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

    set_auth(auth : firebase.User | null) {

	this._auth = auth;

	const _prev_state = (this._auth != null);

	if (auth) {
	    if (auth.emailVerified)
		this.auth_state = AuthState.AUTHENTICATED;
	    else
		this.auth_state = AuthState.UNVERIFIED;
	    this._user = auth.uid;
	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    this._token = (auth as any).auth.currentUser.accessToken;
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
	return new Observable<unknown>(obs => {

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

	const headers = new HttpHeaders({
		"X-Client-Version": client_version,
		"X-Application-Name": application_name,
		"X-Application-ID": application_id,
	});

	const reg : Record<string, string> = {
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
			const err = JSON.parse(e.error);
		        this.error(err.message);
		        obs.error(err.message);
			return;
		    } catch {
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
		(_t: void) => {
		    this.error(
			"A password reset email has been emailed to you."
		    );
		    obs.next();
		    obs.complete();
		}
	    ).catch(
		(error: { message: string }) => {
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
			(_t: void) => {
			    this.error(
				"Profile saved"
			    );
			    obs.next()
			}
		    ).catch(
			(error: { message: string }) => {
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
			(_t: void) => {
			    this.error(
				"Email address updated.  An email has been sent to the new address."
			    );
			    obs.next()
			}
		    ).catch(
			(error: { message: string }) => {
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
			(_t: void) => {
			    this.error(
				"Verification sent"
			    );
			    obs.next()
			}
		    ).catch(
			(error: { message: string }) => {
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
		    (_t: void) => {
			this.error(
			    "Password set"
			);
			obs.next()
		    }
		).catch(
		    (error: { message: string }) => {
			obs.error(error.message);
		    }
		)

	    )
	});

    }
    
    delete_user() {

	const subs = this.get_token().subscribe({
	
	    next: (token : string | null) => {

		if (token == null) {
		    console.log("Delete user: No authentication token");
		    return;
		}

		const headers = new HttpHeaders({
		    "Authorization": `Bearer ${token}`,
		});

		this.http.post(
		    "/api/user-account/delete", {}, {headers: headers}
		).subscribe({

		    next: () => {
			console.log("User deletion successful.");
			this.logout();
		    },

		    error: (e: unknown) => {
			console.log(e);
		    },

		    complete: () => {
		    }

		});

		subs.unsubscribe();

	    },

	    error: (e: unknown) => {
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

