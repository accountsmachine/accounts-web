import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { WorkingService } from '../../working.service';

@Component({
  selector: 'accounts-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

    id = "";
    config : AccountsConfig = {};

//    report : string = "";
    src = "";

    constructor(
	private route : ActivatedRoute,
	private filing : AccountsConfigService,
	private working : WorkingService,
    ) {}

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

    render(e : any) {
	let blob = new Blob([e], {type: 'application/xhtml+xml'});
	let url = URL.createObjectURL(blob);
	this.src = url;
    }

}

