import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Payment } from '../../vat/vat.service';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnChanges {

    id : string = "";
    @Input("start") start : string = "";
    @Input("end") end : string = "";

    columns = ["received", "amount"];

    payments : MatTableDataSource<Payment> =
	new MatTableDataSource<Payment>([]);

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

		this.vat.getPayments(id, this.start, this.end).subscribe(
		    obls => this.payments.data = obls
		);

	    }
	);

    }

    ngOnChanges(): void { this.ngOnInit(); }

}

