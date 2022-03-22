import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
    selector: 'verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

    constructor(private auth : AuthService) { }

    ngOnInit(): void {
    }

    submit() {
	this.auth.send_email_verification(
	).subscribe(
	    (e : any) => {
		this.auth.logout();
	    }
	);
    }


}

