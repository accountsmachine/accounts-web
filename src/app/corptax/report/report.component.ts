import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';
import { WorkingService } from '../../working.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { SafePipe } from '../../shared/safe.pipe';

@Component({
    selector: 'corptax-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, SafePipe]
})
export class ReportComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(CorptaxConfigService);
    private working = inject(WorkingService);


    id = "";
    config : CorptaxConfig = {};

//    report : string = "";
    src = "";

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;

		    this.src = "";
		    this.working.start();

		    this.filing.get_report(this.id).subscribe(e => {
			//			(e : any) => this.report = e
			this.working.stop();
			this.render(e as string);
		    });
		});
	    }
	);
    }

    load() {
	console.log(this.config.state);
    }

    render(e : string) {
	const blob = new Blob([e], {type: 'application/xhtml+xml'});
	const url = URL.createObjectURL(blob);
	this.src = url;
    }

}

