import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { CompanyService, Company, Companies } from '../company.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    configs : Companies = {};

    constructor(
	private router : Router,
	private companyService : CompanyService,
	private dialog : MatDialog,
	public working : WorkingService,
    ) {
    }

    ngOnInit() : void {
	this.reload();
    }

    reload() {
	this.working.start();
	
	this.companyService.get_list().subscribe(
	    e => {
		this.working.stop();
		this.configs = e;
	    }
	);

    }

    create() {
	this.router.navigate(["/company/new"]);
    }

    country_label(s : string) {
	if (s == "england-and-wales") return "England and Wales";
	if (s == "scotland") return "Scotland";
	if (s == "northern-ireland") return "Northern Ireland";
	return "undefined: " + s;
    }

    edit(config : any) {
	this.router.navigate(["/company/" + config.company_number]);
    }

    delete(company : any) {

	const dialogRef = this.dialog.open(
	    DeleteConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    company: company,
		},
	    }
	);
	
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.proceed) {
		    this.companyService.delete(
			company.company_number
		    ).subscribe(() => {
			this.reload();
		    });
		}
	    }
	});
	
    }

}

