import { Injectable, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { RenderService } from '../shared/render.service';
import { FilingConfigService } from '../filing/filing-config.service';
import { BooksService } from '../books/books.service';

@Injectable({
    providedIn: 'root'
})
export class PreviewService {
    private filing = inject(FilingConfigService);
    private renderService = inject(RenderService);
    private books = inject(BooksService);


    report : unknown = null;

    onrender_subject : Subject<unknown> = new Subject<unknown>();
    onsubmit_subject : Subject<void> = new Subject<void>();

    private chgobs : Subject<string> = new Subject<string>();

    onrender() : Observable<unknown> {
	return new Observable<unknown>(obs => {
	    if (this.report) obs.next(this.report);
	    this.onrender_subject.subscribe(report => obs.next(report))
	});
    }

    onsubmit() : Observable<void> {
	return new Observable<void>(obs => {
	    this.onsubmit_subject.subscribe(_report => obs.next(undefined))
	});
    }

    id  = "";
    
    constructor() {

	this.chgobs.pipe(debounceTime(100)).subscribe(id => {
	    this.id = id;
	    this.impl_render(this.id);
	});

	// Re-render if new books are uploaded.
	this.books.subscribe(
	    () => {
		this.render(this.id);
	    }
	);

    }

    render(id : string) {
	this.chgobs.next(id);
    }

    impl_render(_id : string) {

	if (!this.id) {
	    return;
	}

	// Tell clients we're working.
	this.onsubmit_subject.next();

	this.renderService.render(this.id).subscribe(
	    report => {
		this.report = report;
		this.onrender_subject.next(report);
	    }
	);
    }

}

