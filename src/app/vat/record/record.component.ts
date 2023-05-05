import { Component, OnInit, Input } from '@angular/core';

import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { VatLine } from '../vat-line';

@Component({
  selector: 'record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

    @Input("data") vat_table : MatTableDataSource<VatLine> =
	new MatTableDataSource<VatLine>([]);

    columns = ['box', 'description', 'value'];

    constructor() { }

    ngOnInit(): void {
    }

}

