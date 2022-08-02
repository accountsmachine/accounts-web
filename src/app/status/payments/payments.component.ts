import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Payment } from '../../vat/vat.service';
import { WorkingService } from '../../working.service';

@Component({
  selector: 'payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnChanges {

    id : string = "";
    @Input("payments") payments : Payment[] = [];

    columns = ["received", "amount"];

    data : MatTableDataSource<Payment> =
	new MatTableDataSource<Payment>([]);

    constructor(
	private route : ActivatedRoute,
	private vat : VatService,
	public working : WorkingService,
    ) {
    }

    update() : void {
	this.data.data = this.payments;
    }

    ngOnInit() : void {
	this.update();
    }

    ngOnChanges() : void {
	this.update();
    }

}


