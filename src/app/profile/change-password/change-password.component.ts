import { Component, OnInit } from '@angular/core';

import { AuthService, AuthState } from '../auth.service';
import { FrontPageService, FrontState } from '../front-page.service';

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
	private frontPageService : FrontPageService,
    ) {
    }

    ngOnInit(): void {
    }

    change() {
    }

}
