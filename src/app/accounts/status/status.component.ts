import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';

@Component({
  selector: 'accounts-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

    id = "";
    config : AccountsConfig = {};

    status : string = "";

    constructor(
	private route : ActivatedRoute,
	private filing : AccountsConfigService,
    ) {}

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		    this.filing.get_status(this.id).subscribe(
			(e : any) => this.status = e.report
		    );
		});
	    }
	);
    }

}

