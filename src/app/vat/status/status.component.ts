import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';

@Component({
  selector: 'vat-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

    id = "";
    config : VatConfig = {};

    status : string = "";

    constructor(
	private route : ActivatedRoute,
	private filing : VatConfigService,
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

