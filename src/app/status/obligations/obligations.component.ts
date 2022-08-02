import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Obligation, Payment, Liability } from '../../vat/vat.service';
import { WorkingService } from '../../working.service';

@Component({
  selector: 'obligations',
  templateUrl: './obligations.component.html',
  styleUrls: ['./obligations.component.scss']
})
export class ObligationsComponent implements OnInit, OnChanges {

    id : string = "";
    @Input("start") start : string = "";
    @Input("end") end : string = "";

    columns = ["status", "start", "end", "received", "due" ];

    obligations : MatTableDataSource<Obligation> =
	new MatTableDataSource<Obligation>([]);

    constructor(
	private route : ActivatedRoute,
	private vat : VatService,
	public working : WorkingService,
    ) {
    }

    ngOnInit(): void {

	this.route.params.subscribe(
	    params => {

		let id = params["id"];
		this.id = id;

		this.obligations.data = [];

		this.working.start();

		this.vat.getObligations(id, this.start, this.end).subscribe({
		    next: obls => {
			this.obligations.data = obls;
			this.working.stop();
		    },
		    error: err => {
			this.working.stop();
		    },
		    complete: () => {
		    },
		});

	    }
	);

    }

    ngOnChanges(): void { this.ngOnInit(); }

}


