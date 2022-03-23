import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { RenderService } from '../shared/render.service';
import { FilingConfigService } from '../filing/filing-config.service';
import { CompanyService, Company } from '../company/company.service';
import { BooksService } from '../books/books.service';

@Injectable({
    providedIn: 'root'
})
export class PreviewService {

    report : any | null = null;

    onrender_subject : Subject<any | null> = new Subject<any | null>();
    onsubmit_subject : Subject<void> = new Subject<void>();

    private chgobs : Subject<string> = new Subject<string>();

    onrender() : Observable<any> {
	return new Observable<any>(obs => {
	    if (this.report) obs.next(this.report);
	    this.onrender_subject.subscribe(report => obs.next(report))
	});
    }

    onsubmit() : Observable<void> {
	return new Observable<any>(obs => {
	    this.onsubmit_subject.subscribe(report => obs.next())
	});
    }

    id : string = "";
    
    constructor(
	private filing : FilingConfigService,
	private renderService : RenderService,
	private books : BooksService,
    ) {

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

    impl_render(id : string) {

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

