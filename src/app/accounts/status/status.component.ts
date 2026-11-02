import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';

@Component({
    selector: 'accounts-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent]
})
export class StatusComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(AccountsConfigService);


    id = "";
    config : AccountsConfig = {};

    status  = "";

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		    this.filing.get_status(this.id).subscribe(
			(e) => this.status = e.report
		    );
		});
	    }
	);
    }

}

