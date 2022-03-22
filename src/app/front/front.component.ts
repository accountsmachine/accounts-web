import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { WorkingService } from '../working.service';

@Component({
    selector: 'front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {

    username : string = "";
    password : string = "";
    firstname : string = "";
    lastname : string = "";
    name : string = "";

    state : string = "normal";

    email = "";
    
    scope : string[] = [
	"vat", "filing-config", "books", "company", "ch-lookup", "render",
	"status", "corptax", "accounts"
    ]

    constructor(
	private auth : AuthService,
	private router : Router,
	public working : WorkingService,
    ) {
    }

    ngOnInit(): void {
    }

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

    register() {
	this.state = "registering";
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

}

