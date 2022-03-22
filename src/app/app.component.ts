
import { Component, OnInit } from '@angular/core';
import { AuthService, AuthState } from './auth.service';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { UserProfileService } from './user-profile.service';
import { WorkingService } from './working.service';

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
	private snackBar : MatSnackBar,
	private userProfile : UserProfileService,
	private working : WorkingService,
    )
    {
    }

    auth_state : string = "uninitialised";

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

        this.auth.onerr().subscribe(msg => {
	    this.snackBar.open(msg, "dismiss", { duration: 10000 });
	});

	this.auth.onstatechange().subscribe((s : AuthState) => {

	    if (s == AuthState.AUTHENTICATED) {

		this.auth_state = "authenticated";

		console.log("App: LOGGED IN");
		this.userProfile.load().subscribe((e : any) => {});

//		this.router.navigate(
//		    [ "/home" ]
//		);

	    } else if (s == AuthState.UNVERIFIED) {

		this.auth_state = "unverified";

//		this.router.navigate(
//		    [ "/verify-email" ]
//		);

	    } else if (s == AuthState.UNAUTHENTICATED) {

		this.auth_state = "unauthenticated";

//		this.router.navigate(
//		    [ "/front" ],
//		);

	    } else if (s == AuthState.UNINITIALISED) {

		this.auth_state = "uninitialised";

	    }

	    console.log(this.auth_state);

	});

    };

    logout() {
	this.auth.logout();
    }

}

