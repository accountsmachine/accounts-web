
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService } from '../front-page.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    username : string = "";
    password : string = "";

    constructor(
	private auth : AuthService,
	private state : FrontPageService,
	public working : WorkingService,
    ) { }

    ngOnInit(): void {
    }

    login() {

	this.working.start();

	let cmp = this;

	this.auth.login(
	    this.username, this.password
	).subscribe({
	    next(e : any) { cmp.working.stop(); },
	    error(e : Error) { cmp.working.stop(); },
	    complete() { }
	}
	);

    }

    forgotten_password() {
	this.state.forgotten_password();
    }

    registering() {
	this.state.registering();
    }

}

