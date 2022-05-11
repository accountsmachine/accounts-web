import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, AuthState } from '../../auth.service';
import { UserProfileService } from '../user-profile.service';
import { FrontPageService, FrontState } from '../front-page.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    username = "";
    name = "";

    constructor(
	private auth : AuthService,
	private frontPageService : FrontPageService,
	private userProfile : UserProfileService,
	private router : Router,
    ) { }

    ngOnInit(): void {

	this.auth.onauth().subscribe(auth => {

	    if (auth == null) {
		this.name = "";
		this.username = "";
		return;
	    }

	    this.name = auth.auth.currentUser.displayName;
	    this.username = auth.auth.currentUser.email;

	});

    }

    logout() {
	this.auth.logout();
	this.router.navigate(["/"]);
    }

}

