
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
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [MatCard, MatCardTitle, FormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class LoginComponent {
    private auth = inject(AuthService);
    private state = inject(FrontPageService);
    working = inject(WorkingService);


    username  = "";
    password  = "";

    login() {

	this.working.start();

	this.auth.login(
	    this.username, this.password
	).subscribe({
	    next: () => { this.working.stop(); },
	    error: () => { this.working.stop(); },
	    complete: () => { }
	}
	);

    }

    forgotten_password() {
	this.state.forgotten_password();
    }

    registering() {
	this.state.registering();
    }

}

