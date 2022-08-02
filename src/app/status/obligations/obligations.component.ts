import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Obligation } from '../../vat/vat.service';
import { WorkingService } from '../../working.service';

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
	public working : WorkingService,
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


