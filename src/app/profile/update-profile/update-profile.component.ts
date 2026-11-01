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
    selector: 'update-profile',
    templateUrl: './update-profile.component.html',
    styleUrls: ['./update-profile.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class UpdateProfileComponent {
    private auth = inject(AuthService);
    private frontPageService = inject(FrontPageService);


    name = "";

    constructor() {
	
	this.auth.onauth().subscribe(auth => {

	    if (auth == null) {
		this.name = "";
		return;
	    }

	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    this.name = (auth as any).auth.currentUser.displayName;

	});

    }

    change() {
	this.auth.change_name(this.name).subscribe(() => {
	});
    }

}
