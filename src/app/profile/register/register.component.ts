import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService } from '../front-page.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    username : string = "";
    password : string = "";
    password2 : string = "";
    phone : string = "";
    name : string = "";

    constructor(
	private auth : AuthService,
	private state : FrontPageService,
	public working : WorkingService,
    ) { }

    ngOnInit(): void {
    }

    register() {

	if (this.password.length < 9) {
	    this.auth.error("Password is too short.");
	    return;
	}

	if (this.password != this.password2) {
	    this.auth.error("Passwords do not match.");
	}

	this.working.start();
	this.auth.create_user(
	    this.username, this.password, this.phone, this.name
	).subscribe(
	    () => {

		this.working.stop();

		// Login, should take us to the email verification step.
		this.auth.login(this.username, this.password).subscribe(
		    () => {}
		);

	    }
	);
    }

    login() {
	this.state.login();
    }

}
