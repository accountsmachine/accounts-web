import { Component, Input } from '@angular/core';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';

interface KeyValue {
    key : string;
    value : string;
}

@Component({
    selector: 'key-value-table',
    templateUrl: './key-value-table.component.html',
    styleUrls: ['./key-value-table.component.scss'],
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class KeyValueTableComponent {

    @Input() data : MatTableDataSource<KeyValue> =
	new MatTableDataSource<KeyValue>([]);

    columns = ['key', 'value'];

}

