
// FIXME: Should cache information.

import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import { Observable, Subject, Observer } from 'rxjs';

import { ApiService } from '../api.service';

export class AccountBalance {
    account  = "";
    balance  = 0;
}

export class BookInfo {
    length  = 0;
    time  = "";
    kind  = "";
}

export type BooksMap = Record<string, BookInfo>;

@Injectable({
    providedIn: 'root'
})
export class BooksService {
    private api = inject(ApiService);


    get_books_info(id : string) {
	return this.api.get<BookInfo>("/api/books/" + id + "/info");
    }
    
    get_books_detail(id : string) : Observable<AccountBalance[]>{
	return this.api.get<AccountBalance[]>("/api/books/" + id + "/summary");
    }

    subject : Subject<boolean> = new Subject<boolean>();

    subscribe(f : Partial<Observer<boolean>> | ((value: boolean) => void)) {
	this.subject.subscribe(f);
    }

    progress(event : { loaded: number; total: number }) : number {
	const val = Math.round(100 * (event.loaded / event.total));
	return val;
    }

    upload(id : string, file : File, kind : string) : Observable<number> {

        const formData = new FormData();
        formData.append("books", file);
        formData.append("kind", kind);

	const url = "/api/books/" + id + "/upload";
	
	return new Observable<number>(
	    subs => {
		this.api.post<HttpEvent<unknown>>(url, formData, {
		    reportProgress: true,
		    observe: 'events'
		}).subscribe({
		    next: (event : HttpEvent<unknown>) => {
			if (event.type == HttpEventType.UploadProgress && 'loaded' in event && 'total' in event) {
			    subs.next(this.progress(event as { loaded: number; total: number }));
			} else if (event.type == HttpEventType.Response) {
			    subs.complete();
			    this.subject.next(true);
			}
		    },
		    error: (e) => { subs.error(e); },
		    complete: () => { subs.complete(); }
		});
	    }
	);
	
    }

    get_list() : Observable<BooksMap> {

	const url = "/api/books";

	return new Observable<BooksMap>(obs => {
	    
	    this.api.get<BooksMap>(url).subscribe(res => {
		obs.next(res);
	    });

	});
					   
    }

    delete(cid : string) {
	return this.api.delete("/api/books/" + cid);
    }

}

