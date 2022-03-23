
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService, AuthState } from './auth.service';
import { UserProfileService } from './user-profile.service';
import { WorkingService } from './working.service';
import { FrontPageService, FrontState } from './front-page.service';

@Component({

    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {

    loading = false;

    constructor(
	private auth : AuthService,
	private route : ActivatedRoute,
	private router : Router,
	private frontPageService : FrontPageService,
	private snackBar : MatSnackBar,
	private userProfile : UserProfileService,
	private working : WorkingService,
    )
    {
    }

    state : FrontState = FrontState.APPLICATION;

    front = false;

    get authenticated() {
        return this.auth.authenticated();
    }

    public ngOnInit(
    ) {
	
	this.working.onchange().subscribe(
	    w => {
		this.loading = w;
	    }
	);

	this.frontPageService.onchange().subscribe((s : FrontState) =>
	    this.state = s);

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
		this.frontPageService.login();
	    } else if (s == AuthState.UNINITIALISED) {
		this.frontPageService.application();
		console.log("uninitialised");
	    }

	});

	this.frontPageService.onchange().subscribe((s : FrontState) => {

	    if (s == FrontState.APPLICATION) {
		this.front = false;
	    } else {
		this.front = true;
	    }

	});

    };

    profile() {
	this.frontPageService.profile();
	this.front = true;
    }

}

