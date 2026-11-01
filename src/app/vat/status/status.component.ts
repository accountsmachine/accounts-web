import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';

@Component({
    selector: 'vat-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent]
})
export class StatusComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(VatConfigService);


    id = "";
    config : VatConfig = {};

    status  = "";

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		    this.filing.get_status(this.id).subscribe(
			(e : { report: string }) => this.status = e.report
		    );
		});
	    }
	);
    }

}

