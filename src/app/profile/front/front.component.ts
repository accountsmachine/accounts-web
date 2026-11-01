import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService, FrontState } from '../front-page.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';

@Component({
    selector: 'front',
    templateUrl: './front.component.html',
    styleUrls: ['./front.component.scss'],
    imports: [LoginComponent, RegisterComponent, ResetPasswordComponent, VerifyEmailComponent]
})
export class FrontComponent {
    private auth = inject(AuthService);
    private frontPageService = inject(FrontPageService);
    private router = inject(Router);
    working = inject(WorkingService);


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

    constructor() {
	this.frontPageService.onchange().subscribe((s : FrontState) =>
	    this.state = s);
    }

}

