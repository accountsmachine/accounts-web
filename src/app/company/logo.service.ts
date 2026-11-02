import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class LogoService {
    private api = inject(ApiService);


    subject : Subject<boolean> = new Subject<boolean>();

    subscribe(f : (value: boolean) => void) {
	this.subject.subscribe(f);
    }

    progress(event : HttpProgressEvent) : number {
	const val = Math.round(100 * (event.loaded / (event.total ?? event.loaded)));
	return val;
    }

    upload(id : string, file : File) : Observable<number> {

        const formData = new FormData();
        formData.append("image", file);

	const url = "/api/company/" + id + "/logo";

	return new Observable<number>(
	    subs => {
		this.api.post<HttpEvent<unknown>>(url, formData, {
		    reportProgress: true,
		    observe: 'events'
		}).subscribe(
		    (event : HttpEvent<unknown>) => {
			if (event.type == HttpEventType.UploadProgress) {
			    subs.next(this.progress(event as HttpProgressEvent));
			} else if (event.type == HttpEventType.Response) {
			    subs.complete();

                            // Tell everyone there's a new logo
			    this.subject.next(true);
			}
		    }
		);
	    });

    }

    get(id : string) : Observable<Blob> {

	const _url = "/api/company/" + id + "/logo";

	return new Observable<Blob>(obs => {

	    this.api.get<Blob>("/api/company/" + id + "/logo", {
		responseType: 'blob' as 'json'
	    }).subscribe((res : Blob) => {
		obs.next(res);
	    });

	});

    }

}

