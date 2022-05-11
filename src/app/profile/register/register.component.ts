import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService } from '../front-page.service';
import { ReferrerService } from '../../referrer.service';

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
    ref = "";

    constructor(
	private auth : AuthService,
	private state : FrontPageService,
	public working : WorkingService,
	private referrer : ReferrerService,
    ) { }

    ngOnInit(): void {
	this.referrer.onchange().subscribe(e => {
	    this.ref = e;
	});
    }

    register() {

	if (this.password.length < 9) {
	    this.auth.error("Password is too short.");
	    return;
	}

	if (this.password != this.password2) {
	    this.auth.error("Passwords do not match.");
	    return;
	}

	this.working.start();

	let obs;

	if (this.ref == "") {
	    obs = this.auth.create_user(
		this.username, this.password, this.phone, this.name
	    );
	} else {
	    obs = this.auth.create_user(
		this.username, this.password, this.phone, this.name, this.ref
	    );
	}

	obs.subscribe({
	    next: () => {

		this.working.stop();

		this.referrer.publish("");

		// Login, should take us to the email verification step.
		this.auth.login(this.username, this.password).subscribe({

		    next() {
		    },

		    error(e) {
			console.log(e);
		    },

		    complete() {
		    },

		});

	    },

	    error: (e) => {
		console.log(e);
		this.working.stop();
	    },

	    complete: () => {
	    },

	});
    }

    login() {
	this.state.login();
    }

}
