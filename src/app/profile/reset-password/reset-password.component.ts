import { Component, inject } from '@angular/core';

import { AuthService } from '../../auth.service';
import { WorkingService } from '../../working.service';
import { FrontPageService } from '../front-page.service';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [MatCard, MatCardTitle, FormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class ResetPasswordComponent {
    private auth = inject(AuthService);
    private state = inject(FrontPageService);
    working = inject(WorkingService);


    username  = "";

    login() {
	this.state.login();
    }

    reset() {
	this.auth.email_reset(
	    this.username
	).subscribe({
	    next: () => this.working.stop(),
	    error: _err => this.working.stop(),
	    complete: () => {},
	});
    }

}

