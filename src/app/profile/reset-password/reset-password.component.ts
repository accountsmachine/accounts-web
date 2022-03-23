import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService } from '../front-page.service';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    username : string = "";

    constructor(
	private auth : AuthService,
	private state : FrontPageService,
	public working : WorkingService,
    ) {
    }

    ngOnInit(): void {
    }

    login() {
	this.state.login();
    }

    reset() {
	this.auth.email_reset(
	    this.username
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

}
