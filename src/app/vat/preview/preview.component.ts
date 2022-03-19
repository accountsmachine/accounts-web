import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { PreviewService } from '../../shared/preview.service';

@Component({
    selector: 'vat-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

    config : VatConfig = {};

    constructor(
	private route : ActivatedRoute,
	private filing : VatConfigService,
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

