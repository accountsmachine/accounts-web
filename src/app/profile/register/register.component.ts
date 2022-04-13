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

	let svc = this;

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
	).subscribe({
	    next() {

		svc.working.stop();

		// Login, should take us to the email verification step.
		svc.auth.login(svc.username, svc.password).subscribe({

		    next() {
		    },

		    error(e) {
			console.log(e);
		    },

		    complete() {
		    },

		});

	    },

	    error(e) {
		console.log(e);
		svc.working.stop();
	    },

	    complete() {
	    },

	});
    }

    login() {
	this.state.login();
    }

}
