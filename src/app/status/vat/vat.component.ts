import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { WorkingService } from '../../working.service';
import {
    CompanyService, Companies, Company
} from '../../company/company.service';
import { VatService, Status } from '../../vat/vat.service';
import {
    DisconnectConfirmationComponent
} from '../disconnect-confirmation/disconnect-confirmation.component';
import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';

@Component({
    selector: 'vat',
    templateUrl: './vat.component.html',
    styleUrls: ['./vat.component.scss']
})
export class VatComponent implements OnInit {

    public form : FormGroup;

    company : Company = new Company();
    setup = false;

    year : any = {};

    years : { start : string, end : string, name : string }[] = [];

    id : string = "";

    constructor(
	private router : Router,
	private route : ActivatedRoute,
	private statusService : StatusService,
	private companyService : CompanyService,
	private vat : VatService,
	private dialog : MatDialog,
	private formBuilder: FormBuilder,
	public working : WorkingService,
    ) {

	let now = new Date();
	let curYear = now.getFullYear();

	let y = [];

	for (let i = 0; i < 10; i++) {
	    let start = new Date(curYear - i, 0, 1);
	    let end = new Date(curYear - i, 11, 31);
	    if (i == 0)
		end = new Date()
	    y.push({
		name: (curYear - i).toString(),
		start: start.toISOString().substring(0, 10),
		end: end.toISOString().substring(0, 10),
	    });
	}

	this.years = y;
	this.year = y[0];

	this.form = this.formBuilder.group({
	    year: [this.year],
	});

    }

    status : Status = new Status();

    update() {

	this.status = new Status();

	this.working.start();

	this.vat.getStatus(this.id, this.year.start, this.year.end).subscribe({
	    next: e => {
		this.status = e;
		this.working.stop();
	    },
	    error: err => {
		console.log("Failed to get status", err);
		this.error("Failed to load VAT status for company " + this.id);
		this.working.stop();
	    },
	    complete: () => {
	    },
	});
	
    }

    ngOnInit(): void {

	this.route.params.subscribe({

	    next: (params) => {

		let id = params["id"];
		this.id = id;

		this.update();

		this.working.start();

		this.statusService.get(id).subscribe({
		    next: e => {
			if (!e) {
			    this.setup = false;
			} else {
			    this.setup = e.vat;
			}
			this.working.stop();
		    },
		    error: e => {
			this.working.stop();
		    },
		    complete: () => {
		    },
		});

		this.working.start();

		this.companyService.get_list().subscribe({
		    next: e => {
			this.company =
			    id in e ? e[id] : new Company();
			this.working.stop();
		    },
		    error: e => {
			this.working.stop();
		    },
		    complete: () => {
		    },
		});

	    },
	    error: (err) => {
	    },
	    complete: () => {
	    },
	});

    }

    authenticate() {
	this.vat.get_auth_url(this.id).subscribe((url : string) => {
	    window.location.href = url;
	});
    }

    disconnect() {

	const dialogRef = this.dialog.open(
	    DisconnectConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    company: this.company,
		},
	    }
	);
	
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.proceed) {
		    this.vat.deauthorize(this.id).subscribe(() => {
			this.router.navigate(["/status"])
		    });
		}
	    }
	});

    }

    select() {
	this.year = this.form.value.year;
	this.update();
    }

    fix_vrn() {
        this.router.navigate(["/company/" + this.id + "/tax"]);

    }

    retry() {
        this.update();
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
		    this.retry();
		}
	    }
	});
    }

}

