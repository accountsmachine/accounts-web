import { Component, OnInit } from '@angular/core';

import { AuthService, AuthState } from '../auth.service';
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

    orig_username = "";
    orig_name = "";

    password = "";

    constructor(
	private auth : AuthService,
	private frontPageService : FrontPageService,
	private userProfile : UserProfileService,
    ) { }

    ngOnInit(): void {

	this.auth.onauth().subscribe(auth => {

	    if (auth == null) {
		this.name = "";
		this.username = "";
		return;
	    }

	    this.name = this.orig_name = auth.auth.currentUser.displayName;
	    this.username = this.orig_username = auth.auth.currentUser.email;

	});

    }

    update() {}

    application() {
	this.frontPageService.application();
    }

    logout() {
	this.auth.logout();
    }

}

