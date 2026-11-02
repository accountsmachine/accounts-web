import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { KeyValueTableComponent } from '../../shared/key-value-table/key-value-table.component';

interface DataRecord {
    key : string;
    value : string;
}

@Component({
    selector: 'corptax-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, KeyValueTableComponent]
})
export class DataComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(CorptaxConfigService);


    id = "";
    config : CorptaxConfig = {};

    corptax_table : MatTableDataSource<DataRecord> =
	new MatTableDataSource<DataRecord>([]);

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		    this.filing.get_data(this.id).subscribe(
			(record) => {
			    const rec = record as Record<string, { toString(): string }>;
			    const data = [];
			    for (const k in rec) {
				data.push({
				    key: k,
				    value: rec[k].toString().substring(0, 50)
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

