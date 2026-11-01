import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class SignatureService {
    private api = inject(ApiService);


    onload_subject : Subject<void> = new Subject<void>();

    onload() : Observable<void> {
    	return new Observable<void>(obs => {
	    this.onload_subject.subscribe(e => obs.next(e));
	});
    }

    progress(event : { loaded: number; total: number }) : number {
	const val = Math.round(100 * (event.loaded / event.total));
	return val;
    }

    upload(id : string, file : File) : Observable<number> {

        const formData = new FormData();
        formData.append("image", file);

	const url = "/api/filing/" + id + "/signature";
	
	return new Observable<number>(
	    subs => {
		this.api.post(url, formData, {
		    reportProgress: true,
		    observe: 'events'
		}).subscribe(
		    (evt) => {
			const event = evt as HttpEvent<unknown>;
			if (event.type == HttpEventType.UploadProgress && event.loaded !== undefined && event.total !== undefined) {
			    subs.next(this.progress({ loaded: event.loaded, total: event.total }));
			} else if (event.type == HttpEventType.Response) {
			    subs.complete();

                            // Tell everyone there's a new signature
			    this.onload_subject.next();
			}
		    }
		);
	    });
	
    }

    get(id : string) : Observable<Blob> {

	return new Observable<Blob>(obs => {

	    this.api.get("/api/filing/" + id + "/signature", {
		responseType: 'blob' as 'json'
	    }).subscribe((res) => {
		obs.next(res as Blob);
	    });

	});
					   
    }

}

