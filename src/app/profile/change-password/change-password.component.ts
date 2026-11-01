import { Component, inject } from '@angular/core';

import { AuthService } from '../../auth.service';
import { WorkingService } from '../../working.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class ChangePasswordComponent {
    private auth = inject(AuthService);
    working = inject(WorkingService);

       
    password = "";
    password2 = "";

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

	    error: (_e) => this.working.stop(),

	    complete: () => {}

	});

    }

}
