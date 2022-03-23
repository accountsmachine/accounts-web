import { Component, OnInit } from '@angular/core';

import { AuthService, AuthState } from '../auth.service';
import { FrontPageService, FrontState } from '../front-page.service';

@Component({
    selector: 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

    username = "";
    username2 = "";

    constructor(
	private auth : AuthService,
	private frontPageService : FrontPageService,
    ) {
	
	this.auth.onauth().subscribe(auth => {

	    if (auth == null) {
		this.username = "";
		return;
	    }

//	    this.username = auth.auth.currentUser.email;

	});

    }

    ngOnInit(): void {
    }

    change() {
    }

    profile() {
	this.frontPageService.profile();
    }

}
