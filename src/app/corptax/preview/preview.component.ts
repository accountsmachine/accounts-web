import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';
import { PreviewService } from '../../shared/preview.service';

@Component({
    selector: 'corptax-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    config : CorptaxConfig = {};

    constructor(
	private route : ActivatedRoute,
	private filing : CorptaxConfigService,
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

