import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';

@Component({
  selector: 'navigator',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

    id = "";
    config : CorptaxConfig = {};

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
		});
	    }
	);
    }

}

