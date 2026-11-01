import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// FIXME: Need both?
import { PreviewService } from '../preview.service';
import { RenderService } from '../render.service';
import { FilingConfigService } from '../../filing/filing-config.service';
import { WorkingService } from '../../working.service';
import { SafePipe } from '../safe.pipe';

@Component({
    selector: 'render',
    templateUrl: './render.component.html',
    styleUrls: ['./render.component.scss'],
    imports: [SafePipe]
})
export class RenderComponent {
    private route = inject(ActivatedRoute);
    private renderService = inject(RenderService);
    private filing = inject(FilingConfigService);
    private renderer = inject(PreviewService);
    private working = inject(WorkingService);


    config: Record<string, unknown> = {};
    src = "";

    constructor() {

	this.renderer.onsubmit().subscribe(
	    () => {
		this.src = "";
		this.working.start();
	    }
	);

	this.renderer.onrender().subscribe(
	    (report) => {
		this.render(report as string);
		this.working.stop();
	    }
	);

    }

    render(e : string) {
	const blob = new Blob([e], {type: 'application/xhtml+xml'});
	const url = URL.createObjectURL(blob);
	this.src = url;
    }

}

