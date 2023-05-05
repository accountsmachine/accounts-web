import { Component, OnInit, Input } from '@angular/core';

import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

type KeyValue = {
    key : string;
    value : string;
};

@Component({
  selector: 'key-value-table',
  templateUrl: './key-value-table.component.html',
  styleUrls: ['./key-value-table.component.scss']
})
export class KeyValueTableComponent implements OnInit {

    @Input("data") data : MatTableDataSource<KeyValue> =
	new MatTableDataSource<KeyValue>([]);

    columns = ['key', 'value'];

    constructor() { }

    ngOnInit(): void {
    }

}

