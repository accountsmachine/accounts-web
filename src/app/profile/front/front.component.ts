import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService, FrontState } from '../front-page.service';

@Component({
    selector: 'front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {

    state : FrontState = FrontState.APPLICATION;

    get login_state() {
	return this.state == FrontState.LOGIN;
    }

    get registering_state() {
	return this.state == FrontState.REGISTERING;
    }

    get forgotten_password_state() {
	return this.state == FrontState.FORGOTTEN_PASSWORD;
    }

    get verifying_email_state() {
	return this.state == FrontState.VERIFYING_EMAIL;
    }

    get loading_state() {
	return this.state == FrontState.LOADING;
    }

    constructor(
	private auth : AuthService,
	private frontPageService : FrontPageService,
	private router : Router,
	public working : WorkingService,
    ) {
	this.frontPageService.onchange().subscribe((s : FrontState) =>
	    this.state = s);
    }

    ngOnInit(): void {
    }

}

