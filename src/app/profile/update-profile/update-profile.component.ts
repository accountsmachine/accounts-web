import { Component, OnInit } from '@angular/core';

import { AuthService, AuthState } from '../auth.service';
import { FrontPageService, FrontState } from '../front-page.service';

@Component({
    selector: 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

    name = "";

    constructor(
	private auth : AuthService,
	private frontPageService : FrontPageService,
    ) {
	
	this.auth.onauth().subscribe(auth => {

	    if (auth == null) {
		this.name = "";
		return;
	    }

	    this.name = auth.auth.currentUser.displayName;

	});

    }

    ngOnInit(): void {
    }

    change() {
	this.auth.change_name(this.name).subscribe(() => {
	});
    }

}
