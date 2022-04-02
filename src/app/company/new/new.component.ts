
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyLookupService } from '../company-lookup.service';

import { CompanyService, Company } from '../company.service';

@Component({
  selector: 'company-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

    number : string = "";

    lookup : any | null = null;
    not_found = false;
    company : Company | null = null;

    constructor(
	private router : Router,
	private snackBar : MatSnackBar,
	private companyService : CompanyService,
	private companyLookup : CompanyLookupService,
    ) { }

    ngOnInit(): void {
    }

    cancel() {
	this.router.navigate(["/company"]);
    }

    use() {

	if (this.number == "") {
	    this.snackBar.open("Invalid company number", "dismiss",
			       { duration: 5000 });
	    return;
	}

	this.companyService.create_from_lookup(this.lookup).subscribe(
	    () => {
		this.snackBar.open("Configuration created",
				   "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/company/" + this.number]);
	    }
	);

    }

    search() {
	let cmp = this;

	this.companyLookup.get(cmp.number).subscribe({

	    next(f) {
		cmp.lookup = f;
		cmp.not_found = false;
		cmp.companyService.load(cmp.number).subscribe({
		    next(c) {
			cmp.company = c;
		    },
		    error(c) {
			cmp.company = null;
		    },
		    complete() {}
		});
	    },
	    error(err) {
		cmp.lookup = null;
		cmp.not_found = true;
	    },
	    complete() {
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

