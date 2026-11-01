import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {
    MatDialog
} from '@angular/material/dialog';

import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';

import { StatusService, Statuses } from '../status.service';
import { CompanyService, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';

import { ConfigurationService } from '../../configuration.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

class StatusItem {
    company? : string;
    number? : string;
    vat  = false;
    corptax  = false;
    accounts  = false;
}

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    imports: [MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, RouterLink, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class OverviewComponent implements OnInit {
    private router = inject(Router);
    private statusService = inject(StatusService);
    private companyService = inject(CompanyService);
    private dialog = inject(MatDialog);
    private working = inject(WorkingService);
    private configSvc = inject(ConfigurationService);


    feature(x : string) {
        return this.configSvc.hasFeature(x);
    }

    get nofeatures() {
        return this.configSvc.noFeatures();
    }

    status : MatTableDataSource<StatusItem> =
	new MatTableDataSource<StatusItem>([]);

    columns : string[];

    constructor() {

	this.columns = ["company", "number"];

	if (this.feature("vat")) this.columns.push("vat");
	if (this.feature("corptax")) this.columns.push("corptax");
	if (this.feature("accounts")) this.columns.push("accounts");



    }

    update(status: Statuses, companies : Companies) {

	const data = [];

	for (const k in companies) {
	    const row : StatusItem = {
		company: companies[k].company_name,
		number: k,
		vat: k in status ? status[k].vat : false,
		corptax: k in status ? status[k].corptax : false,
		accounts: k in status ? status[k].accounts : false,
	    };
	    data.push(row);
	}

	this.status.data = data;

    }

    ngOnInit(): void {
        this.reload();
    }

    reload() : void {

	this.working.start();

	combineLatest({
	    status: this.statusService.get_list(),
	    companies: this.companyService.get_list(),
	}).subscribe({
	    next: e => {
		this.update(e.status, e.companies);
		this.working.stop();
	    },
	    error: err => {
		console.log(err);
		this.error("Failed to load status overview");
		this.working.stop();
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
	dialogRef.afterClosed().subscribe((result : { retry?: boolean } | undefined) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

