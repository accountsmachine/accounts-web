import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { PreviewService } from '../../shared/preview.service';

@Component({
    selector: 'accounts-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    config : AccountsConfig = {};

    constructor(
	private route : ActivatedRoute,
	private filing : AccountsConfigService,
	private renderer : PreviewService,
    ) {

	this.route.params.subscribe(params => {
	    this.working = true;
	    this.filing.load(params["id"]).subscribe(e => {
	    	this.config = e.config;
		this.renderer.render(e.id);
	    });
	});

    }

    ngOnInit() : void {
    }
    
    working = false;

}

