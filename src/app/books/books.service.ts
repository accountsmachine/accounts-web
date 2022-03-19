
// FIXME: Should cache information.

import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders, HttpEventType
} from '@angular/common/http';

import { Observable, Subject, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export class AccountBalance {
    account : string = "";
    balance : number = 0;
}

@Injectable({
    providedIn: 'root'
})
export class BooksService {

    constructor(private http: HttpClient) {
    }

    get_books_info(id : string) {
	return this.http.get("/api/books/" + id + "/info");
    }
    
    get_books_detail(id : string) : Observable<AccountBalance[]>{
	return this.http.get<AccountBalance[]>("/api/books/" + id + "/summary");
    }

    subject : Subject<boolean> = new Subject<boolean>();

    subscribe(f : any) {
	this.subject.subscribe(f);
    }

    progress(event : any) : number {
	let val = Math.round(100 * (event.loaded / event.total));
	return val;
    }

    upload(id : string, name : string, file : File) : Observable<number> {

        const formData = new FormData();
        formData.append(name, file);

	let url = "/api/books/" + id + "/upload";
	
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
			    this.subject.next(true);
			}
		    }
		);
	    });
	
    }

    get_list() : Observable<any> {

	let url = "/api/books";

	return new Observable<any>(obs => {
	    
	    this.http.get<any>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(res => {
		obs.next(res);
	    });

	});
					   
    }

    delete(cid : string) {
	return this.http.delete("/api/books/" + cid).pipe(
	    retry(3),
	    catchError(this.handleError)
	);
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

