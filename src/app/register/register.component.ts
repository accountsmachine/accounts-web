import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { WorkingService } from '../working.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    username : string = "";
    password : string = "";

    constructor(
	private auth : AuthService,
	public working : WorkingService,
    ) { }

    ngOnInit(): void {
    }

    submit() {
	this.working.start();
	this.auth.create_user(
	    this.username, this.password
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

}
