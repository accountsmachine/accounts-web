import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from '../../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService } from '../front-page.service';
import { ReferrerService } from '../../referrer.service';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [MatCard, MatCardTitle, FormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton]
})
export class RegisterComponent implements OnInit {
    private auth = inject(AuthService);
    private state = inject(FrontPageService);
    working = inject(WorkingService);
    private referrer = inject(ReferrerService);


    username  = "";
    password  = "";
    password2  = "";
    phone  = "";
    name  = "";
    ref = "";

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
