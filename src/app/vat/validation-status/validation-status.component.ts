
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { ChecklistService, Checklist, Check } from '../checklist.service';


@Component({
    selector: 'validation-status',
    templateUrl: './validation-status.component.html',
    styleUrls: ['./validation-status.component.scss']
})
export class ValidationStatusComponent implements OnInit {

    errors : MatTableDataSource<Check> =
	new MatTableDataSource<Check>([]);

    pending = false;

    checklist : Checklist = new Checklist();

    columns = [ "id", "kind", "description", "action" ];

    constructor(
	private checklistSvc : ChecklistService,
	private route : ActivatedRoute,
	private router : Router,
    ) {

	this.checklistSvc.onupdate().subscribe(
	    (cl : Checklist) => {
	        this.checklist = cl;
		this.errors.data = cl.list;
		this.pending = cl.pending;
	    }
	);

	this.pending = true;

	this.route.params.subscribe(
	    params => {
		this.checklistSvc.load(params["id"]);
	    }
	);

    }

    ngOnInit(): void {
	this
    }

    select(row : Check) {
	this.router.navigate([row.href]);
	return false;
    }

}

