
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { UserProfileService } from './user-profile.service';

@Component({

    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit {

    constructor(
	private auth : AuthService,
	private route : ActivatedRoute,
	private router : Router,
	private snackBar : MatSnackBar,
	private userProfile : UserProfileService,
    )
    {
        this.auth.onerr().subscribe(msg => {
	    this.snackBar.open(msg, "dismiss", { duration: 10000 });
	});
	this.auth.onauth().subscribe((e : boolean) => {
	    if (e) {
		console.log("App: LOGGED IN");
		this.userProfile.load().subscribe((e : any) => {});
//		console.log("App: Going to home tab");
//		this.router.navigate(["/home"]);
	    } else {
		console.log("App: LOGGED OUT");
//		console.log("Jump to front page.");
//		this.router.navigate(["/front"]);
	    }
	});
    }

    get authenticated() {
        return this.auth.authenticated();
    }

    public ngOnInit() {
    };

    logout() {
	this.auth.logout();
    }

}

