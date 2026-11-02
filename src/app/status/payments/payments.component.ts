import { Component, OnInit, Input, OnChanges, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';


import { VatService, Payment } from '../../vat/vat.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.scss'],
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CurrencyPipe, DatePipe]
})
export class PaymentsComponent implements OnInit, OnChanges {
    private route = inject(ActivatedRoute);
    private vat = inject(VatService);


    id  = "";
    @Input() payments : Payment[] = [];

    columns = ["received", "amount"];

    data : MatTableDataSource<Payment> =
	new MatTableDataSource<Payment>([]);

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


