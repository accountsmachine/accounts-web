import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// FIXME: Need both?
import { PreviewService } from '../preview.service';
import { RenderService } from '../render.service';
import { FilingConfigService } from '../../filing/filing-config.service';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'render',
    templateUrl: './render.component.html',
    styleUrls: ['./render.component.scss']
})
export class RenderComponent implements OnInit {

    config : any = {};
    src = "";

    constructor(
	private route : ActivatedRoute,
	private renderService : RenderService,
	private filing : FilingConfigService,
	private renderer : PreviewService,
	private working : WorkingService,
    ) {

	this.renderer.onsubmit().subscribe(
	    () => {
		this.src = "";
		this.working.start();
	    }
	);

	this.renderer.onrender().subscribe(
	    (report : any) => {
		this.render(report);
		this.working.stop();
	    }
	);

    }

    ngOnInit() : void {
    }

    render(e : any) {
	let blob = new Blob([e], {type: 'application/xhtml+xml'});
	let url = URL.createObjectURL(blob);
	this.src = url;
    }

}

