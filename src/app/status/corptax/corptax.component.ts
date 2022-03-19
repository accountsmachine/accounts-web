import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { CompanyService, Companies, Company } from '../../company/company.service';
import { CorptaxService } from '../../corptax.service';
import {
    DisconnectConfirmationComponent
} from '../disconnect-confirmation/disconnect-confirmation.component';

@Component({
  selector: 'app-corptax',
  templateUrl: './corptax.component.html',
  styleUrls: ['./corptax.component.scss']
})
export class CorptaxComponent implements OnInit {

    setup = false;

    gateway_id : string = "";
    password : string = "";
    id : string= "";

    company : Company = new Company();

    constructor(
	private router : Router,
	private route : ActivatedRoute,
	private statusService : StatusService,
	private corptax : CorptaxService,
	private companyService : CompanyService,
	private dialog : MatDialog,
    ) {
    }

    ngOnInit(): void {

	this.route.params.subscribe(
	    params => {
		let id = params["id"];
		combineLatest({
		    status: this.statusService.get(id),
		    companies: this.companyService.get_list(),
		}).subscribe(e => {
		    this.id = id;
		    if (!e.status) {
			this.setup = false;
		    } else {
			this.setup = e.status.corptax;
		    }
		    this.company =
			id in e.companies ? e.companies[id] : new Company();
		});
	    }
	);

    }

    submit() {
	this.corptax.authorize(
	    this.id, this.gateway_id, this.password
	).subscribe(() => {
	    this.router.navigate(["/status"])
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
		    this.corptax.deauthorize(this.id).subscribe(() => {
			this.router.navigate(["/status"])
		    });
		}
	    }
	});

    }

}

