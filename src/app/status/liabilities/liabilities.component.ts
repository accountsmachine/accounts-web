import { Component, OnInit, Input, OnChanges, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';


import { VatService, Liability } from '../../vat/vat.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'liabilities',
    templateUrl: './liabilities.component.html',
    styleUrls: ['./liabilities.component.scss'],
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CurrencyPipe, DatePipe]
})
export class LiabilitiesComponent implements OnInit, OnChanges {
    private route = inject(ActivatedRoute);
    private vat = inject(VatService);


    id  = "";
    @Input() liabilities : Liability[] = [];

    columns = [
	"type", "originalAmount", "outstandingAmount", "from", "to", "due"
    ];

    data : MatTableDataSource<Liability> =
	new MatTableDataSource<Liability>([]);

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

