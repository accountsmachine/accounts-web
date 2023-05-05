import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

import { StatusService, Statuses } from '../status.service';
import { VatService, Liability } from '../../vat/vat.service';

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

