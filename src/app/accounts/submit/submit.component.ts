import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AccountsConfig,  } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'accounts-submit',
    templateUrl: './submit.component.html',
    styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

    features : Set<string> = new Set(environment.features);

    feature(x : string) {
	return this.features.has(x);
    }

    id : string = "";
    config : AccountsConfig = {};
    confirmed = false;

    constructor(
	private route : ActivatedRoute,
	private filing : AccountsConfigService,
	private router : Router,
    ) {
	this.route.params.subscribe(params => {
	    this.filing.load(params["id"]).subscribe(e => {
		this.id = e.id;
		this.config = e.config;
	    });
	});
    }

    ngOnInit() : void {
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

