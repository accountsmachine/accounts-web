import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Liability } from '../../vat/vat.service';

@Component({
  selector: 'liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})
export class LiabilitiesComponent implements OnInit, OnChanges {

    id : string = "";
    @Input("start") start : string = "";
    @Input("end") end : string = "";

    columns = [
	"type", "originalAmount", "outstandingAmount", "from", "to", "due"
    ];

    liabilities : MatTableDataSource<Liability> =
	new MatTableDataSource<Liability>([]);

    constructor(
	private route : ActivatedRoute,
	private vat : VatService,
    ) {
    }

    ngOnInit(): void {

	this.route.params.subscribe(
	    params => {
		let id = params["id"];
		this.id = id;

		this.vat.getLiabilities(id, this.start, this.end).subscribe(
		    obls => this.liabilities.data = obls
		);

	    }
	);

    }

    ngOnChanges(): void { this.ngOnInit(); }

}

