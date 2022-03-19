import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { CompanyService, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';

class StatusItem {
    company? : string;
    number? : string;
    vat : boolean = false;
    corptax : boolean = false;
    accounts : boolean = false;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    status : MatTableDataSource<StatusItem> =
	new MatTableDataSource<StatusItem>([]);

    columns = [ "company", "number", "vat", "corptax", "accounts" ];

    constructor(
	private router : Router,
	private statusService : StatusService,
	private companyService : CompanyService,
	private dialog : MatDialog,
	private working : WorkingService,
    ) { }

    update(status: Statuses, companies : Companies) {

	let data = [];

	for (let k in companies) {
	    let row : StatusItem = {
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

	this.working.start();
	combineLatest({
	    status: this.statusService.get_list(),
	    companies: this.companyService.get_list(),
	}).subscribe(
	    e => {
		this.update(e.status, e.companies);
		this.working.stop();
	    });
    }

}

