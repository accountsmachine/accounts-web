import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders, HttpEventType
} from '@angular/common/http';

import { Observable, Subject, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LogoService {

    constructor(private http: HttpClient) {
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
		this.http.post(url, formData, {
		    reportProgress: true,
		    observe: 'events'
		}).subscribe(
		    event => {
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

	    this.http.get("/api/company/" + id + "/logo", {
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

