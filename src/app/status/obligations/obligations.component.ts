import { Component, OnInit, Input, OnChanges, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';


import { VatService, Obligation } from '../../vat/vat.service';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'obligations',
    templateUrl: './obligations.component.html',
    styleUrls: ['./obligations.component.scss'],
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIcon, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, DatePipe]
})
export class ObligationsComponent implements OnInit, OnChanges {
    private route = inject(ActivatedRoute);
    private vat = inject(VatService);


    id  = "";
    @Input() obligations : Obligation[] = [];

    columns = ["status", "start", "end", "received", "due" ];

    data : MatTableDataSource<Obligation> =
	new MatTableDataSource<Obligation>([]);

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


