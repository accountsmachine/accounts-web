import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { WorkingService } from '../../working.service';
import { CompanyService, Companies, Company } from '../../company/company.service';
import { VatService } from '../../vat/vat.service';
import {
    DisconnectConfirmationComponent
} from '../disconnect-confirmation/disconnect-confirmation.component';

@Component({
    selector: 'vat',
    templateUrl: './vat.component.html',
    styleUrls: ['./vat.component.scss']
})
export class VatComponent implements OnInit {

    public form : UntypedFormGroup;

    setup = false;

    year : any = {};

    years : { start : string, end : string, name : string }[] = [];

    company : Company = new Company();
    id : string = "";

    constructor(
	private router : Router,
	private route : ActivatedRoute,
	private statusService : StatusService,
	private companyService : CompanyService,
	private vat : VatService,
	private dialog : MatDialog,
	private formBuilder: UntypedFormBuilder,
	private working : WorkingService,
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

    ngOnInit(): void {

	// FIXME: No spinner, combineLatest complicates things.
	this.route.params.subscribe({
	    next: (params) => {
		let id = params["id"];
		this.id = id;
		combineLatest({
		    status: this.statusService.get(id),
		    companies: this.companyService.get_list(),
		}).subscribe(e => {
		    if (!e.status) {
			this.setup = false;
		    } else {
			this.setup = e.status.vat;
		    }
		    this.company =
			id in e.companies ? e.companies[id] : new Company();
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
    }

    fix_vrn() {
        this.router.navigate(["/company/" + this.id + "/tax"]);

    }

}

