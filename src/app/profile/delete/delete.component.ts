import { Component, inject } from '@angular/core';

import {
    MatDialog
} from '@angular/material/dialog';

import { AuthService } from '../../auth.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'delete-account',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, MatButton, MatIcon]
})
export class DeleteComponent {
    private auth = inject(AuthService);
    private dialog = inject(MatDialog);


    username = "";
    username2 = "";

    delete() {
	const dialogRef = this.dialog.open(
	    DeleteConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : { proceed?: boolean } | undefined) => {
	    if (result) {
		if (result.proceed) {
		    console.log("Proceeding with delete.");
		    this.auth.delete_user();
		}
	    }
	});
    }

}



