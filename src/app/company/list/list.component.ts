import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    MatDialog
} from '@angular/material/dialog';

import { CompanyService, Company, Companies } from '../company.service';
import { WorkingService } from '../../working.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { UpperCasePipe, KeyValuePipe } from '@angular/common';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [MatButton, MatIcon, MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, UpperCasePipe, KeyValuePipe]
})
export class ListComponent implements OnInit {
    private router = inject(Router);
    private companyService = inject(CompanyService);
    private dialog = inject(MatDialog);
    private working = inject(WorkingService);


    configs : Companies = {};

    ngOnInit() : void {
	this.reload();
    }

    reload() {

	this.working.start();

	this.companyService.get_list().subscribe({
	    next: (e) => {
		this.configs = e;
		this.working.stop();
	    },
	    error: (_e) => {
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
	
	dialogRef.afterClosed().subscribe((result : { proceed: boolean }) => {
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
	dialogRef.afterClosed().subscribe((result : { retry: boolean }) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

