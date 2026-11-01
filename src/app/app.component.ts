
import { Component, OnInit, inject } from '@angular/core';
import {
    ActivatedRoute, Router, NavigationStart
} from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

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
    styleUrls: ['./app.component.scss'],
    // eslint-disable-next-line @angular-eslint/prefer-standalone
    standalone: false,
})
export class AppComponent implements OnInit {
    private auth = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private frontPageService = inject(FrontPageService);
    private snackBar = inject(MatSnackBar);
    private userProfile = inject(UserProfileService);
    private working = inject(WorkingService);
    private referrer = inject(ReferrerService);


    work = false;

    private freshdesk : FreshdeskService = new FreshdeskService({
	widgetId: 101000004796,
	locale: 'en-GB',
	callback(_widget : (...args: unknown[]) => void) {
	}
    });

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
		this.userProfile.load().subscribe(() => {});
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
	this.auth.onauth().subscribe((s) => {
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

