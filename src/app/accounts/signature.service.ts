import { Injectable } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class SignatureService {

    constructor(private api : ApiService) {
    }

    onload_subject : Subject<void> = new Subject<void>();

    onload() : Observable<void> {
    	return new Observable<void>(obs => {
	    this.onload_subject.subscribe(e => obs.next(e));
	});
    }

    progress(event : any) : number {
	let val = Math.round(100 * (event.loaded / event.total));
	return val;
    }

    upload(id : string, file : File) : Observable<number> {

        const formData = new FormData();
        formData.append("image", file);

	let url = "/api/filing/" + id + "/signature";
	
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

                            // Tell everyone there's a new signature
			    this.onload_subject.next();
			}
		    }
		);
	    });
	
    }

    get(id : string) : Observable<any> {

	return new Observable<any>(obs => {

	    this.api.get("/api/filing/" + id + "/signature", {
		responseType: 'blob' as 'json'
	    }).subscribe((res : any) => {
		obs.next(res);
	    });

	});
					   
    }

}

