
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
    ActivatedRoute, Router, NavigationStart
} from '@angular/router';

import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

import { AuthService, AuthState } from './auth.service';
import { UserProfileService } from './profile/user-profile.service';
import { WorkingService } from './working.service';
import {
    FrontPageService, FrontState
} from './profile/front-page.service';

import { FreshdeskService } from './freshdesk.service';

import { ReferrerService } from './referrer.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    work = false;

    private freshdesk : FreshdeskService = new FreshdeskService({
	widgetId: 101000004796,
	locale: 'en-GB',
	callback(widget : any) {
	}
    });

    constructor(
	private auth : AuthService,
	private route : ActivatedRoute,
	private router : Router,
	private frontPageService : FrontPageService,
	private snackBar : MatSnackBar,
	private userProfile : UserProfileService,
	private working : WorkingService,
	private referrer : ReferrerService,
    )
    {
    }

    front = false;

    get authenticated() {
        return this.auth.authenticated();
    }

    ref_token = "";

    public ngOnInit(
    ) {

	this.referrer.onchange().subscribe(e => {
	    this.ref_token = e;
	    if (e != "")
		this.frontPageService.registering();
	});
	
	this.working.onchange().subscribe(
	    w => {
		this.work = w;
	    }
	);

	// NavigationStart?
	this.router.events.subscribe(e => {
	    if (e instanceof NavigationStart) {
		if (e.url.startsWith("/ref/")) {
		    this.referrer.publish(e.url.substring(5));
		}
	    }
	});

        this.auth.onerr().subscribe(msg => {
	    this.snackBar.open(msg, "dismiss", { duration: 10000 });
	});

	this.auth.onstatechange().subscribe((s : AuthState) => {

	    if (s == AuthState.AUTHENTICATED) {
		this.frontPageService.application();
		this.userProfile.load().subscribe((e : any) => {});
	    } else if (s == AuthState.UNVERIFIED) {
		this.frontPageService.verifying_email();
	    } else if (s == AuthState.UNAUTHENTICATED) {

		// If we have a referrer token, go to register page.
		if (this.ref_token != "") {
		    this.frontPageService.registering();
		    return;
		}

		this.frontPageService.login();
	    } else if (s == AuthState.UNINITIALISED) {
		this.frontPageService.loading();
	    }

	});

	// Pass name and email through to freshdesk widget on auth.
	// Blank out on logout.
	this.auth.onauth().subscribe((s : any) => {
	    let name = "";
	    let email = "";
	    if (s) {
		if (s.displayName) name = s.displayName;
		if (s.email) email = s.email;
	    }
	    this.freshdesk.FreshworksWidget("identify", "ticketForm", {
		"name": name,
		"email": email,
	    });
	});

	this.frontPageService.onchange().subscribe((s : FrontState) => {

	    if (s == FrontState.APPLICATION) {
		this.front = false;
	    } else {
		this.front = true;
	    }

	});

    };

}

