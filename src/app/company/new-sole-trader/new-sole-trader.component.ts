
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyLookupService } from '../company-lookup.service';

import { CompanyService, Company } from '../company.service';

@Component({
  selector: 'new-sole-trader',
  templateUrl: './new-sole-trader.component.html',
  styleUrls: ['./new-sole-trader.component.scss']
})
export class NewSoleTraderComponent implements OnInit {

    name : string = "";
    trade_name : string = "";
    trade_location : string = "";

    company : Company | null = null;

    constructor(
	private router : Router,
	private snackBar : MatSnackBar,
	private companyService : CompanyService,
	private companyLookup : CompanyLookupService,
    ) { }

    ngOnInit(): void {
    }

    create() {
    }

    cancel() {
	this.router.navigate(["/company"]);
    }

    /*

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
	*/

}

