import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';

@Component({
  selector: 'corptax-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

    id = "";
    config : CorptaxConfig = {};

    status : string = "";

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
		    this.filing.get_status(this.id).subscribe(
			(e : any) => this.status = e.report
		    );
		});
	    }
	);

    }

}

