
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { switchMap, take, filter, catchError, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

    api_url = "/api";
    token_url = "/api/oauth/token";

    private refreshing_in_progress : boolean = false;
    private access_token_subject : BehaviorSubject<string | null> =
	new BehaviorSubject<string | null>(null);

    constructor(
	private auth : AuthService,
	private router : Router,
    ) { }

    intercept(req : HttpRequest<any>, next: HttpHandler)
    : Observable<HttpEvent<any>> {

	if (!req.url.startsWith("/api/")) {
	    return next.handle(req);
	}

	if (!this.auth.authenticated()) {
	    return next.handle(req);
	}

	return new Observable<HttpEvent<any>>(obs => {

	    this.auth.get_token().subscribe((tok : any) => {

		if (tok == null) {
		    this.auth.logout();
		    this.router.navigateByUrl('/front');
		    throw("Token has expired.");
		    return;
		}

		next.handle(
		    this.add_authorization_header(req, tok)
		).pipe(
		
		    catchError((err : Error) => {
		    
			// in case of 401 http error
			if (err instanceof HttpErrorResponse &&
			    err.status === 401) {

			    try {
				if (err.error.code == "email-not-verified") {
				    console.log("EMAIL");
				    this.auth.logout();
				    this.router.navigate(
					['/front'],
					{
					    queryParams: {
						verify: 1
					    }
					}
				    );
				    obs.complete();
				    return of();
				}
			    } catch (e) {
			    }
				
			    // logout and redirect to login page
			    return this.logout_and_redirect(err);
				
			}

			// in case of 403 http error (operation not
			// permitted)
			if (err instanceof HttpErrorResponse &&
			    err.status === 403) {
				
			    this.auth.onerr_subject.next(
				"Your account does not have the " +
				    "requested access"
			    );
			    
			    // logout and redirect to login page
			    return this.logout_and_redirect(err);

			}

			// if error has status neither 401 nor 403 then
			// just return this error
			return throwError(err);

		    })
		).subscribe({
		    next(e) {
			obs.next(e);
		    },
		    error(e) {
			obs.error(e);
		    },
		    complete() {
			obs.complete();
		    }
		});

	    })

	});

    }

    private add_authorization_header(
	request: HttpRequest<any>, token: string | null
    ) : HttpRequest<any> {

	if (token) {
	    return request.clone(
		{ setHeaders: { Authorization: `Bearer ${token}` } }
	    );
	}

	return request;
    }
    
    private logout_and_redirect(err : Error): Observable<HttpEvent<any>> {
	this.auth.logout();
	this.router.navigateByUrl('/front');
	return throwError(err);
    }
    
}

