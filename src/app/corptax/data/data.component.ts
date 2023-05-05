import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';

type Record = {
    key : string;
    value : string;
};

@Component({
    selector: 'corptax-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

    id = "";
    config : CorptaxConfig = {};

    corptax_table : MatTableDataSource<Record> =
	new MatTableDataSource<Record>([]);

    constructor(
	private route : ActivatedRoute,
	private filing : CorptaxConfigService,
    ) {}

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		    this.filing.get_data(this.id).subscribe(
			(record : any) => {
			    let data = [];
			    for (let k in record) {
				data.push({
				    key: k,
				    value: record[k].toString().substring(0, 50)
				});
				this.corptax_table.data = data;
			    }
			}
		    );
		});
	    }
	);
    }

}

