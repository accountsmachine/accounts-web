
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyLookupService } from '../company-lookup.service';

import { CompanyService, Company, CompanyLookupRecord } from '../company.service';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'new-uk-company',
    templateUrl: './new-uk-company.component.html',
    styleUrls: ['./new-uk-company.component.scss'],
    imports: [FormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton, MatIcon]
})
export class NewUkCompanyComponent {
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    private companyService = inject(CompanyService);
    private companyLookup = inject(CompanyLookupService);


    number  = "";

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
	    (id : string) => {
		this.snackBar.open("Configuration created",
				   "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/company/" + id]);
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

