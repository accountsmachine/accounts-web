
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyLookupService } from '../company-lookup.service';

import { CompanyService, Company } from '../company.service';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'new-sole-trader',
    templateUrl: './new-sole-trader.component.html',
    styleUrls: ['./new-sole-trader.component.scss'],
    imports: [FormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton, MatIcon]
})
export class NewSoleTraderComponent {
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    private companyService = inject(CompanyService);
    private companyLookup = inject(CompanyLookupService);


    name  = "";
    trade_name  = "";
    trade_location  = "";

    company : Company | null = null;

    create() {

	this.companyService.create_sole_trader(
	    this.name, this.trade_name, this.trade_location,
	).subscribe(
	    (id : string) => {
		this.snackBar.open("Configuration created",
				   "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/company/" + id]);
	    }
	);

    }

    cancel() {
	this.router.navigate(["/company"]);
    }

}

