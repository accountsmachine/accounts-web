import { Injectable } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class LogoService {

    constructor(private api: ApiService) {
    }

    subject : Subject<boolean> = new Subject<boolean>();

    subscribe(f : any) {
	this.subject.subscribe(f);
    }

    progress(event : any) : number {
	let val = Math.round(100 * (event.loaded / event.total));
	return val;
    }

    upload(id : string, file : File) : Observable<number> {

        const formData = new FormData();
        formData.append("image", file);

	let url = "/api/company/" + id + "/logo";
	
	return new Observable<number>(
	    subs => {
		this.api.post(url, formData, {
		    reportProgress: true,
		    observe: 'events'
		}).subscribe(
		    (event : any) => {
			if (event.type == HttpEventType.UploadProgress) {
			    subs.next(this.progress(event));
			} else if (event.type == HttpEventType.Response) {
			    subs.complete();

                            // Tell everyone there's a new logo
			    this.subject.next(true);
			}
		    }
		);
	    });
	
    }

    get(id : string) : Observable<any> {

	let url = "/api/company/" + id + "/logo";

	return new Observable<any>(obs => {

	    this.api.get("/api/company/" + id + "/logo", {
		responseType: 'blob' as 'json'
	    }).subscribe((res : any) => {
		obs.next(res);
	    });

	});
					   
    }

}

