import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AccountsConfig,  } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';

import { ConfigurationService } from '../../configuration.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'accounts-submit',
    templateUrl: './submit.component.html',
    styleUrls: ['./submit.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, MatSlideToggle, FormsModule, MatButton, MatIcon]
})
export class SubmitComponent {
    private route = inject(ActivatedRoute);
    private filing = inject(AccountsConfigService);
    private router = inject(Router);
    private configSvc = inject(ConfigurationService);


    feature(x : string) {
        return this.configSvc.hasFeature(x);
    }

    id  = "";
    config : AccountsConfig = {};
    confirmed = false;

    constructor() {
	this.route.params.subscribe(params => {
	    this.filing.load(params["id"]).subscribe(e => {
		this.id = e.id;
		this.config = e.config;
	    });
	});
    }

    submit() {
	this.filing.submit(this.id).subscribe(() => {
	    this.router.navigate(["/filing"]);
	});
    }

    cancel() {
	this.router.navigate(["/accounts/" + this.id + "/config"]);
    }

}

