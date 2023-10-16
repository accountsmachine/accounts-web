import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { CompanyService, Company, Companies } from '../company.service';
import { WorkingService } from '../../working.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';

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
	private working : WorkingService,
    ) {
    }

    ngOnInit() : void {
	this.reload();
    }

    reload() {

	let cmp = this;

	this.working.start();

	this.companyService.get_list().subscribe({
	    next: (e) => {
		cmp.configs = e;
		this.working.stop();
	    },
	    error: (e) => {
		this.working.stop();
		this.error("Failed to load company list");
	    },
	    complete: () => {
	    }
	});

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

    edit(id : string) {
	this.router.navigate(["/company/" + id]);
    }

    delete(id : string, c : Company) {

	const dialogRef = this.dialog.open(
	    DeleteConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    id: id,
		    company: c,
		},
	    }
	);
	
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.proceed) {
		    this.working.start();
		    this.companyService.delete(
			id
		    ).subscribe({
			next: () => {  this.working.stop(); this.reload(); },
			error: () => { this.working.stop(); },
			complete: () => {}
		    });
		}
	    }
	});
	
    }

    error(m : string) {
	const dialogRef = this.dialog.open(
	    ErrorDialogComponent, {
		width: '550px',
		data: {
		    retry: false,
		    message: m,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

