import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Obligation } from '../../vat/vat.service';

@Component({
  selector: 'obligations',
  templateUrl: './obligations.component.html',
  styleUrls: ['./obligations.component.scss']
})
export class ObligationsComponent implements OnInit, OnChanges {

    id : string = "";
    @Input("obligations") obligations : Obligation[] = [];

    columns = ["status", "start", "end", "received", "due" ];

    data : MatTableDataSource<Obligation> =
	new MatTableDataSource<Obligation>([]);

    constructor(
	private route : ActivatedRoute,
	private vat : VatService,
    ) {
    }

    update() : void {
	this.data.data = this.obligations;
    }

    ngOnInit() : void {
	this.update();
    }

    ngOnChanges() : void {
	this.update();
    }

}


