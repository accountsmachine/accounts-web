import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { WorkingService } from '../working.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit {

    username : string = "";
//    "asd@example.com";
    password : string = "";
//    "asdefg1421!";
    name : string = "";

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
	this.auth.onauth().pipe(take(1)).subscribe((e : boolean) => {
	    if (e) {
//		console.log("App: Going to home tab");
//		this.router.navigate(["/home"]);
	    } else {
	    }
	});
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
	this.working.start();
	this.auth.create_user(
	    this.username, this.password
	).subscribe(
	    (e : any) => {
		this.working.stop();
	    }
	);
    }

    emailReset() {
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

getUser() {
return this.auth._user;
}

}

