import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountsConfig } from '../accounts-config';
import { AccountsConfigService } from '../accounts-config.service';

import { SignatureService } from '../signature.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { ImageUploaderComponent } from '../../shared/image-uploader/image-uploader.component';
import { Observable } from 'rxjs';

class Uploader {
    svc : SignatureService;
    id : () => string;
    constructor(svc : SignatureService, id : () => string) {
	this.svc = svc;
	this.id = id;
    }
    upload(x : File) : Observable<number> {
	return this.svc.upload(this.id(), x);
    }
}

@Component({
    selector: 'signature',
    templateUrl: './signature.component.html',
    styleUrls: ['./signature.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, ImageUploaderComponent]
})
export class SignatureComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(AccountsConfigService);
    private signatureService = inject(SignatureService);


    id  = "";

    filename = "";

    upload = new Uploader(this.signatureService, () => this.id);

    imgbin : Blob | null = null;
    imgtype  = "";

    config : AccountsConfig | null = null;

    public image_url : string | ArrayBuffer | null = null;
    
    createImageFromBlob(image: Blob) {

	const reader = new FileReader();

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

	this.signatureService.onload().subscribe(() => {
	    this.update_signature();
	});

    }

    update_signature() {
	this.signatureService.get(this.id).subscribe((img : Blob) => {
	    this.createImageFromBlob(img);
	});
    }

}

