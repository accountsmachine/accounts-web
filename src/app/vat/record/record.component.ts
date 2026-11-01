import { Component, Input } from '@angular/core';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';

import { VatLine } from '../vat-line';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.scss'],
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CurrencyPipe]
})
export class RecordComponent {

    @Input() data : MatTableDataSource<VatLine> =
	new MatTableDataSource<VatLine>([]);

    columns = ['box', 'description', 'value'];

}

