import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { KeyValueTableComponent } from '../../shared/key-value-table/key-value-table.component';

interface DataRecord {
    key : string;
    value : string;
}

@Component({
    selector: 'accounts-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, KeyValueTableComponent]
})
export class DataComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(AccountsConfigService);


    id = "";
    config : AccountsConfig = {};

    accounts_table : MatTableDataSource<DataRecord> =
	new MatTableDataSource<DataRecord>([]);

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		    this.filing.get_data(this.id).subscribe(
			(res) => {
			    const record = res as Record<string, unknown>;
			    const data = [];
			    for (const k in record) {
				data.push({
				    key: k,
				    value: String(record[k]).substring(0, 50)
				});
				this.accounts_table.data = data;
			    }
			}
		    );
		});
	    }
	);
    }

}

