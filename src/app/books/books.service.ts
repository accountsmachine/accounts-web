
// FIXME: Should cache information.

import { Injectable } from '@angular/core';
import {
    HttpEventType
} from '@angular/common/http';

import { Observable, Subject, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ApiService } from '../api.service';

export class AccountBalance {
    account : string = "";
    balance : number = 0;
}

export class Mapping {
    [account : string] : string[];
}

@Injectable({
    providedIn: 'root'
})
export class BooksService {

    constructor(private api : ApiService) {
    }

    get_books_info(id : string) {
	return this.api.get("/api/books/" + id + "/info");
    }
    
    get_books_detail(id : string) : Observable<AccountBalance[]>{
	return this.api.get<AccountBalance[]>("/api/books/" + id + "/summary");
    }

    get_mapping(id : string) : Observable<Mapping>{
	return this.api.get<Mapping>("/api/books/" + id + "/mapping");
    }

    put_mapping(id : string, mapping : Mapping) : Observable<Mapping>{
	return this.api.put("/api/books/" + id + "/mapping", mapping);
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
		this.api.post(url, formData, {
		    reportProgress: true,
		    observe: 'events'
		}).subscribe(
		    (event : any) => {
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
	    
	    this.api.get<any>(url).subscribe(res => {
		obs.next(res);
	    });

	});
					   
    }

    delete(cid : string) {
	return this.api.delete("/api/books/" + cid);
    }

}

