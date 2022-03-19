import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';

@Component({
  selector: 'navigator',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

    id = "";
    config : VatConfig = {};

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
		});
	    }
	);
    }

}

