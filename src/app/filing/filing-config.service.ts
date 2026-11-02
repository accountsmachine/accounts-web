
// FIXME: Should cache information (lists).
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { v4 as uuid } from 'uuid';

import { ApiService } from '../api.service';

export interface ConfigEvent {
    id : string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config : any;
}

export interface FilingItem {
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
    private api = inject(ApiService);


    id  = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config : any = {};

    constructor() {

	// All changes are announced on this subject.  Could be a lot of
	// publications in a short space, so debounce to 1 notification
	// every 100 ms.
	this.onfieldchange_subject.pipe(debounceTime(100)).subscribe(
	    _e => {
		this.onchange_subject.next({id: this.id, config: this.config});
	    }
	);

    }

    unload() {
	this.id = "";
	this.config = {};
	this.onunload_subject.next();
    }

    // FIXME: Cache filings?

    list() : Observable<FilingItem[]> {
	const url = "/api/filings";

	return new Observable<FilingItem[]>(obs => {

	    this.api.get<Record<string, FilingItem>>(url).subscribe({

		next: (res) => {

		    const f : FilingItem[] = [];
		    for (const id in res) {
			f.push(res[id]);
			res[id]["id"] = id;
		    }

		    obs.next(f);

		},

		error: (_e) => { obs.error(); },
		complete: () => { obs.complete(); },

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

	const url = "/api/filing/" + id;

	return new Observable(obs => {

	    this.api.get<Record<string, unknown>>(url).subscribe(config => {
		this.id = id;
		this.config = config;
		this.onload_subject.next({id: this.id, config: this.config});
		obs.next({id: this.id, config: this.config});
	    });

	});

    }

    save() {

	const url = "/api/filing/" + this.id;

	return new Observable<void>(obs => {
	    
	    return this.api.put<unknown>(url, this.config).subscribe(_e => {
		    this.onsave_subject.next({id: this.id, config: this.config});
		    obs.next();
		}
	    );
	});

    }

    create(config : Record<string, unknown>) : Observable<string> {

	return new Observable<string>(obs => {

	    this.list().subscribe(_lst => {

		this.id = uuid();
		this.config = config;

		this.save().subscribe(_e => {
		    obs.next(this.id);
		});

	    });

	});

    }

    change() {
	this.onfieldchange_subject.next(true);
    }

    delete(id : string) : Observable<void> {

	return new Observable<void>(obs => {

	    const url = "/api/filing/" + id;

	    this.api.delete(url).subscribe(_config => {
		obs.next();
	    });

	});

    }

    move_draft(id : string) : Observable<void> {

	return new Observable<void>(obs => {

	    const url = "/api/filing/" + id + "/move-draft";

	    this.api.post(url, {}).subscribe(_config => {
		obs.next();
	    });

	});

    }

    get_report(id : string) : Observable<unknown> {

	const url = "/api/filing/" + id + "/report";

	return new Observable(obs => {

	    this.api.get(url, {responseType: 'text'}).subscribe(report => {
		obs.next(report);
	    });
	});
	
    }

    get_data(id : string) : Observable<unknown> {

	const url = "/api/filing/" + id + "/data";

	return new Observable(obs => {

	    this.api.get<unknown>(url).subscribe(config => {
		obs.next(config);
	    });
	});
	
    }

    get_status(id : string) : Observable<unknown> {

	const url = "/api/filing/" + id + "/status";

	return new Observable(obs => {

	    this.api.get<unknown>(url).subscribe(config => {
		obs.next(config);
	    });
	});
	
    }

    submit(id : string, kind : string) {

	const url = "/api/" + kind + "/submit/" + id;

    	return this.api.post<unknown>(url, {});

    }

}

