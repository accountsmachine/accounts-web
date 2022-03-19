import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { CorptaxConfig } from '../corptax-config';
import { CorptaxConfigService } from '../corptax-config.service';

@Component({
    selector: 'corptax-submit',
    templateUrl: './submit.component.html',
    styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

    id : string = "";
    config : CorptaxConfig = {};
    confirmed = false;

    constructor(
	private route : ActivatedRoute,
	private filing : CorptaxConfigService,
	private router : Router,
    ) {
	this.route.params.subscribe(params => {
	    this.filing.load(params["id"]).subscribe(e => {
		this.id = e.id;
		this.config= e.config;
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
	this.router.navigate(["/corptax/" + this.id + "/config"]);
    }

}

