import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { UserProfileService } from '../user-profile.service';
import { FrontPageService } from '../front-page.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, MatButton]
})
export class ProfileComponent implements OnInit {
    private auth = inject(AuthService);
    private frontPageService = inject(FrontPageService);
    private userProfile = inject(UserProfileService);
    private router = inject(Router);


    username = "";
    name = "";

    ngOnInit(): void {

	this.auth.onauth().subscribe(auth => {

	    if (auth == null) {
		this.name = "";
		this.username = "";
		return;
	    }

	    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	    const currentUser = (auth as any).auth.currentUser;
	    this.name = currentUser.displayName;
	    this.username = currentUser.email;

	});

    }

    logout() {
	this.auth.logout();
	this.router.navigate(["/"]);
    }

}

