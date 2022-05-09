import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { CompanyService, Company } from '../company.service';
import { LogoService } from '../logo.service';
import { WorkingService } from '../../working.service';

class Uploader {
    svc : any;
    cmp : any;
    constructor(cmp : any) {
	this.svc = cmp.logoService;
	this.cmp = cmp;
    }
    upload(x : any) {
	return this.svc.upload(this.cmp.id, x);
    }
};

@Component({
    selector: 'logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

    filename = "";

    upload = new Uploader(this);

    imgbin : any | null = null;
    imgtype : string = "";
    
    constructor(
	private route : ActivatedRoute,
	private state: CompanyService,
	private logoService : LogoService,
	private working : WorkingService,
    ) {
	this.company = new Company();
    }

    company : Company;

    id : any = "";

    public image_url : any | null = null;
    
    createImageFromBlob(image: Blob) {

	let reader = new FileReader();

	reader.addEventListener("load", () => {
	    this.image_url = reader.result;
	}, false);

	reader.readAsDataURL(image);

    }

    ngOnInit(): void {

	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.working.start();
		    this.state.load(params["id"]).subscribe({
			next: (c) => {
			    this.working.stop();
			    if (c) { 
				this.company = c;
		    		this.id = params["id"];
				this.update_logo();
			    }
			},
			error: (e) => {
			    this.working.stop();
			},
			complete: () => {},
		    });
		}
	    }
	);

	this.logoService.subscribe(
	    (res : any) => this.update_logo()
	);

    }

    // Don't need spinner here because there's a progress bar.
    update_logo() {
	this.logoService.get(this.id).subscribe({
	    next: (img : any) => {
		this.createImageFromBlob(img);
	    },
	    error: (e) => {},
	});
    }

}

