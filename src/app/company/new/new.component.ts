
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyLookupService } from '../company-lookup.service';

import { CompanyService, Company, CompanyLookupRecord } from '../company.service';
import { FormsModule } from '@angular/forms';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { NewUkCompanyComponent } from '../new-uk-company/new-uk-company.component';
import { NewSoleTraderComponent } from '../new-sole-trader/new-sole-trader.component';
import { NewNonUkCompanyComponent } from '../new-non-uk-company/new-non-uk-company.component';

@Component({
    selector: 'company-new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],
    imports: [FormsModule, MatRadioGroup, MatRadioButton, NewUkCompanyComponent, NewSoleTraderComponent, NewNonUkCompanyComponent]
})
export class NewComponent {
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    private companyService = inject(CompanyService);
    private companyLookup = inject(CompanyLookupService);


    number  = "";

    kind  = "uk-company";

    lookup : CompanyLookupRecord | null = null;
    not_found = false;
    company : Company | null = null;

    cancel() {
	this.router.navigate(["/company"]);
    }

    use() {

	if (this.number == "") {
	    this.snackBar.open("Invalid company number", "dismiss",
			       { duration: 5000 });
	    return;
	}

	this.companyService.create_from_lookup(this.lookup!).subscribe(
	    () => {
		this.snackBar.open("Configuration created",
				   "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/company/" + this.number]);
	    }
	);

    }

    search() {

	this.companyLookup.get(this.number).subscribe({

	    next: (f) => {
		this.lookup = f;
		this.not_found = false;
		this.companyService.load(this.number).subscribe({
		    next: (c) => {
			this.company = c;
		    },
		    error: (_c) => {
			this.company = null;
		    },
		    complete: () => {}
		});
	    },
	    error: (_err) => {
		this.lookup = null;
		this.not_found = true;
	    },
	    complete: () => {
	    }
	});
    }

    country_label(s : string) {
	if (s == "england-wales") return "England and Wales";
	if (s == "scotland") return "Scotland";
	if (s == "northern-ireland") return "Northern Ireland";
	return "undefined: " + s;
    }

}

