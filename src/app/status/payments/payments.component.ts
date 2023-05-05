import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Payment } from '../../vat/vat.service';

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


