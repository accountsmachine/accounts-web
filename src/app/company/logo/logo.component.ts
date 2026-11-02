import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { CompanyService, Company } from '../company.service';
import { LogoService } from '../logo.service';
import { WorkingService } from '../../working.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { ImageUploaderComponent } from '../../shared/image-uploader/image-uploader.component';

class LogoUploader {
    constructor(
	private svc : LogoService,
	private getId : () => string,
    ) {}
    upload(x : File) : Observable<number> {
	return this.svc.upload(this.getId(), x);
    }
}

@Component({
    selector: 'logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, ImageUploaderComponent]
})
export class LogoComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private state = inject(CompanyService);
    private logoService = inject(LogoService);
    private working = inject(WorkingService);


    filename = "";

    upload = new LogoUploader(this.logoService, () => this.id);

    imgbin : Blob | null = null;
    imgtype  = "";

    constructor() {
	this.company = new Company();
    }

    company : Company;

    id  = "";

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
			error: (_e) => {
			    this.working.stop();
			},
			complete: () => {},
		    });
		}
	    }
	);

	this.logoService.subscribe(
	    () => this.update_logo()
	);

    }

    // Don't need spinner here because there's a progress bar.
    update_logo() {
	this.logoService.get(this.id).subscribe({
	    next: (img : Blob) => {
		this.createImageFromBlob(img);
	    },
	    error: (_e) => {},
	});
    }

}

