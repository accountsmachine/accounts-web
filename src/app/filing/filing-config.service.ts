
// FIXME: Should cache information (lists).

import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, Subject, throwError, map, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { WorkingService } from '../working.service';

export type ConfigEvent = {
    id : string;
    config : any;    
}

export type FilingItem = {
    id : string;
    kind : string;
    label : string;
    state : string;
    company? : string;
}

@Injectable({
    providedIn: 'root'
})
export class FilingConfigService {

    id : string = "";
    config : any = {};

    constructor(
	private http: HttpClient,
	private working : WorkingService,
    ) {

	// All changes are announced on this subject.  Could be a lot of
	// publications in a short space, so debounce to 1 notification
	// every 100 ms.
	this.onfieldchange_subject.pipe(debounceTime(100)).subscribe(
	    e => {
		this.onchange_subject.next({id: this.id, config: this.config});
	    }
	);

    }

    unload() {
	this.id = "";
	this.config = {};
	this.onunload_subject.next();
    }

    // FIXME: Cache filings.

    list() : Observable<FilingItem[]> {
	let url = "/api/filings";

	this.working.start();

	return new Observable<FilingItem[]>(obs => {

	    this.http.get<any[]>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(res => {

		this.working.stop();

		let f : FilingItem[] = [];
		for (var id in res) {
		    f.push(res[id]);
		    res[id]["id"] = id;
		}

		obs.next(f);

	    });

	});
					   
    }

    private onload_subject : Subject<ConfigEvent> = new Subject<ConfigEvent>();
    private onsave_subject : Subject<ConfigEvent> = new Subject<ConfigEvent>();
    private onchange_subject : Subject<ConfigEvent> = new Subject<ConfigEvent>();
    private onfieldchange_subject : Subject<boolean> = new Subject<boolean>();
    private onunload_subject : Subject<void> = new Subject<void>();

    // Triggered on create and save.
    onload() : Observable<ConfigEvent> {
	return new Observable<ConfigEvent>(obs => {
	    if (this.id != "")
		obs.next({id: this.id, config: this.config});
	    this.onload_subject.subscribe(e => {
		obs.next(e);
	    });
	});
    }

    // No load, just fields changing.
    onchange() : Observable<ConfigEvent> {
	return new Observable<ConfigEvent>(obs => {
	    this.onchange_subject.subscribe(e => obs.next(e));
	});
    }

    // No load, just fields changing.
    onsave() : Observable<ConfigEvent> {
	return new Observable<ConfigEvent>(obs => {
	    this.onsave_subject.subscribe(e => obs.next(e));
	});
    }

    // Unload.
    onunload() : Observable<void> {
	return new Observable<void>(obs => {
	    this.onunload_subject.subscribe(() => obs.next());
	});
    }

    // Must subscribe, returns a ConfigEvent when loaded.  Only triggers
    // onload event if a new config is loaded.
    load(id : string) : Observable<ConfigEvent> {

	if (id == this.id) {
	    return of<ConfigEvent>({id: this.id, config: this.config});
	}

	let url = "/api/filing/" + id;

	this.working.start();

	return new Observable(obs => {

	    this.http.get<any>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(config => {
		this.working.stop();
		this.id = id;
		this.config = config;
		this.onload_subject.next({id: this.id, config: this.config});
		obs.next({id: this.id, config: this.config});
	    });

	});

    }

    save() {

	let url = "/api/filing/" + this.id;

	return new Observable<void>(obs => {

	    this.working.start();
	    
	    return this.http.put<any>(url, this.config).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(e => {
		this.working.stop();
		    this.onsave_subject.next({id: this.id, config: this.config});
		    obs.next();
		}
	    );
	});

    }

    create(config : any) : Observable<string> {

	return new Observable<string>(obs => {

	    this.list().subscribe(lst => {

		this.id = uuid();
		this.config = config;

		this.working.start();

		this.save().subscribe(e => {
		    this.working.stop();
		    obs.next(this.id);
		});

	    });

	});

    }

    private handleError(error: HttpErrorResponse) {
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

    change() {
	this.onfieldchange_subject.next(true);
    }

    delete(id : any) : Observable<void> {

	return new Observable<void>(obs => {

	    let url = "/api/filing/" + id;

	    this.http.delete(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(config => {
		obs.next();
	    });

	});

    }

    move_draft(id : any) : Observable<void> {

	return new Observable<void>(obs => {

	    let url = "/api/filing/" + id + "/move-draft";

	    this.http.post(url, {}).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(config => {
		obs.next();
	    });

	});

    }

    get_report(id : string) : any {

	let url = "/api/filing/" + id + "/report";

	return new Observable(obs => {

	    this.http.get(url, {responseType: 'text'}).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(config => {
		obs.next(config);
	    });
	});
	
    }

    get_data(id : string) : any {

	let url = "/api/filing/" + id + "/data";

	return new Observable(obs => {

	    this.http.get<any>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(config => {
		obs.next(config);
	    });
	});
	
    }

    get_status(id : string) : any {

	let url = "/api/filing/" + id + "/status";

	return new Observable(obs => {

	    this.http.get<any>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(config => {
		obs.next(config);
	    });
	});
	
    }

    submit(id : string, kind : string) {

	let url = "/api/" + kind + "/submit/" + id;

    	return this.http.post<any>(url, {}).pipe(
	    retry(3),
	    catchError(this.handleError)
	);

    }

}

