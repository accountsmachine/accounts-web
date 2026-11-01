import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';
import { PreviewService } from '../../shared/preview.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { RenderComponent } from '../../shared/render/render.component';

@Component({
    selector: 'corptax-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, RenderComponent]
})
export class PreviewComponent {
    private route = inject(ActivatedRoute);
    private filing = inject(CorptaxConfigService);
    private renderer = inject(PreviewService);


    config : CorptaxConfig = {};

    constructor() {

	this.route.params.subscribe(params => {
	    this.working = true;
	    this.filing.load(params["id"]).subscribe(e => {
	    	this.config = e.config;
		this.renderer.render(e.id);
	    });
	});

    }

    working = false;

}

