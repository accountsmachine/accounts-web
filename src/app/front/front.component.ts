import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { WorkingService } from '../working.service';
import { FrontPageService, FrontState } from '../front-page.service';

@Component({
    selector: 'front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {

//    username : string = "";
//    password : string = "";
//    firstname : string = "";
//    lastname : string = "";
//    name : string = "";
//    email = "";

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

    get profile_state() {
	return this.state == FrontState.PROFILE;
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
/*
    submit() {
	this.working.start();
	this.auth.login(
	    this.username, this.password
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    begin_register() {
	this.state = "registering";
    }

    register() {
	this.working.start();
	this.auth.create_user(
	    this.username, this.password
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    resetPassword() {
	this.auth.email_reset(
	    this.username
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    logout() {
	this.auth.email_reset(
	    this.username
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    changeName() {
	this.auth.change_name(
	this.name
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    changeEmail() {
	this.auth.change_email(
	this.email
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    sendVerification() {
	this.auth.send_email_verification(
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    changePassword() {
	this.auth.change_password(
	this.password
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    deleteAccount() {
	this.auth.delete_user(
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    forgottenPassword() {
	this.state = "forgotten";
    }

    normal() {
	this.state = "normal";
    }

    send_reset() {
    }
*/
}

