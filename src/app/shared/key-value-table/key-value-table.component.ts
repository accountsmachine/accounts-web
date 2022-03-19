import { Component, OnInit, Input } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';

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

