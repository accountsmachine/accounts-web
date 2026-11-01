
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, RouterLink } from '@angular/router';

import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'navigator',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    imports: [MatButton, RouterLinkActive, RouterLink, MatIcon]
})
export class NavComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(VatConfigService);


    id = "";
    config : VatConfig = {};

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		});
	    }
	);
    }

}

