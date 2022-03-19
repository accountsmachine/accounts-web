import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders, HttpEventType
} from '@angular/common/http';

import { Observable, Subject, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SignatureService {

    constructor(private http: HttpClient) {
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
		this.http.post(url, formData, {
		    reportProgress: true,
		    observe: 'events'
		}).subscribe(
		    event => {
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

	    this.http.get("/api/filing/" + id + "/signature", {
		responseType: 'blob' as 'json'
	    }).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe((res : any) => {
		obs.next(res);
	    });

	});
					   
    }

    private handleError(error: HttpErrorResponse) {
	console.log(error);
	if (error.status === 0) {
	    // A client-side or network error
	    console.error('An error occurred:', error.error);
	} else {
	    // The backend returned an unsuccessful response code.
	    console.error(
		`Backend returned code ${error.status}, body was: `,
		error.error);
	}

	// Return an observable with a user-facing error message.
	return throwError(() =>
	    new Error('Something bad happened; please try again later.'));
    }

}

