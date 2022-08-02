import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Liability } from '../../vat/vat.service';
import { WorkingService } from '../../working.service';

@Component({
  selector: 'liabilities',
  templateUrl: './liabilities.component.html',
  styleUrls: ['./liabilities.component.scss']
})
export class LiabilitiesComponent implements OnInit, OnChanges {

    id : string = "";
    @Input("liabilities") liabilities : Liability[] = [];

    columns = [
	"type", "originalAmount", "outstandingAmount", "from", "to", "due"
    ];

    data : MatTableDataSource<Liability> =
	new MatTableDataSource<Liability>([]);

    constructor(
	private route : ActivatedRoute,
	private vat : VatService,
	public working : WorkingService,
    ) {
    }

    update() : void {
	this.data.data = this.liabilities;
    }

    ngOnInit() : void {
	this.update();
    }

    ngOnChanges() : void {
	this.update();
    }

}

