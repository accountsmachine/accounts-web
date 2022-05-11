import { Component, OnInit } from '@angular/core';

import { AuthService, AuthState } from '../../auth.service';
import { FrontPageService, FrontState } from '../front-page.service';

@Component({
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

    username = "";
    username2 = "";

    constructor(
	private auth : AuthService,
	private frontPageService : FrontPageService,
    ) {
    }

    ngOnInit(): void {
    }

    change() {

        if (this.username != this.username2) {
    	    this.auth.error("Email addresses do not match");
	    return;
	}

	this.auth.change_email(this.username).subscribe(
	    {
		next: () => {
		    this.auth.logout();
		},
		error: () => {
		},
		complete: () => {}
	    }
	);

    }

}

