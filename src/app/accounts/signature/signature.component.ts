import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { Observable } from 'rxjs';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';

import { SignatureService } from '../signature.service';

class Uploader {
    svc : any;
    cmp : any;
    constructor(cmp : any) {
	this.svc = cmp.signatureService;
	this.cmp = cmp;
    }
    upload(x : any) {
	return this.svc.upload(this.cmp.id, x);
    }
};

@Component({
    selector: 'signature',
    templateUrl: './signature.component.html',
    styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {

    id : string = "";

    filename = "";

    upload = new Uploader(this);

    imgbin : any | null = null;
    imgtype : string = "";
    
    constructor(
	private route : ActivatedRoute,
	private filing: AccountsConfigService,
	private signatureService : SignatureService,
    ) {
    }

    config : AccountsConfig | null = null;

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
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = e.id;
		    this.update_signature();
		});
	    }
	);

	this.signatureService.onload().subscribe((img : any) => {
	    this.update_signature();
	});

    }

    update_signature() {
	this.signatureService.get(this.id).subscribe((img : any) => {
	    this.createImageFromBlob(img);
	});
    }

}

