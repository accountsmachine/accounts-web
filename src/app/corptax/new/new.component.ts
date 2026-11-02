import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CorptaxConfigService } from '../corptax-config.service';
import { CorptaxConfig } from '../corptax-config';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'corptax-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],
    imports: [FormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton]
})
export class NewComponent {
    private filing = inject(CorptaxConfigService);
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);


    label = "";

    configs : CorptaxConfig[] = [];

    cancel() {
	this.router.navigate(["/filing"]);
    }

    create() {

	if (this.label == "") {
	    this.snackBar.open("Invalid configuration label", "dismiss",
			       { duration: 5000 });
	    return;
	}

	const _id = "c-" + this.configs.length;

	this.filing.create(this.label).subscribe(
	    id => {
		this.snackBar.open("Configuration created", "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/corptax/" + id + "/company"])
	    }
	);

    }
}

