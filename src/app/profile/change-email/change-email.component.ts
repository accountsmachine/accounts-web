import { Component, inject } from '@angular/core';

import { AuthService } from '../../auth.service';
import { FrontPageService } from '../front-page.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'change-email',
    templateUrl: './change-email.component.html',
    styleUrls: ['./change-email.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class ChangeEmailComponent {
    private auth = inject(AuthService);
    private frontPageService = inject(FrontPageService);


    username = "";
    username2 = "";

    change() {

        if (this.username != this.username2) {
    	    this.auth.error("Email addresses do not match");
	    return;
	}

	this.auth.change_email(this.username).subscribe(
	    {
		next: () => {
		    this.auth.logout();
		},
		error: () => {
		},
		complete: () => {}
	    }
	);

    }

}

