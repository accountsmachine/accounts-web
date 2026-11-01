import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { WorkingService } from '../../working.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { SafePipe } from '../../shared/safe.pipe';

@Component({
    selector: 'accounts-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, SafePipe]
})
export class ReportComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(AccountsConfigService);
    private working = inject(WorkingService);


    id = "";
    config : AccountsConfig = {};

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
			this.render(e);
		    });
		});
	    }
	);
    }

    load() {
	console.log(this.config.state);
    }

    render(e : unknown) {
	const blob = new Blob([e as string], {type: 'application/xhtml+xml'});
	const url = URL.createObjectURL(blob);
	this.src = url;
    }

}

