import { Component, OnInit } from '@angular/core';

import { AuthService, AuthState } from '../auth.service';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
       
    password = "";
    password2 = "";

    constructor(
	private auth : AuthService,
	public working : WorkingService,
    ) {
    }

    ngOnInit(): void {
    }

    change() {

	if (this.password.length < 9) {
	    this.auth.error("Password is too short.");
	    return;
	}

	if (this.password != this.password2) {
	    this.auth.error("Passwords do not match.");
	    return;
	}

	this.working.start();

	this.auth.change_password(this.password).subscribe({

	    next: () => this.working.stop(),

	    error: (e) => this.working.stop(),

	    complete: () => {}

	});

    }

}
