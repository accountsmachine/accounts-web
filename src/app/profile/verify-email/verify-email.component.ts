import { Component, inject } from '@angular/core';

import { AuthService } from '../../auth.service';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.scss'],
    imports: [MatCard, MatCardTitle, FormsModule, MatButton]
})
export class VerifyEmailComponent {
    private auth = inject(AuthService);


    submit() {
	this.auth.send_email_verification(
	).subscribe(
	    () => {
		this.auth.logout();
	    }
	);
    }


}

