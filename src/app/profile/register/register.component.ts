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
    name : string = "";

    constructor(
	private auth : AuthService,
	private state : FrontPageService,
	public working : WorkingService,
    ) { }

    ngOnInit(): void {
    }

    register() {
	this.working.start();
	this.auth.create_user(
	    this.username, this.password
	).subscribe(
	    (e : any) => {
		this.working.stop();
		this.auth.change_name(this.name).subscribe(() => {});
	    }
	);
    }

    login() {
	this.state.login();
    }

}
