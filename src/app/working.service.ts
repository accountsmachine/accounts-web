import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WorkingService {

    onchange_subject = new BehaviorSubject<boolean>(false);

    onchange() : Observable<boolean> {
	return this.onchange_subject;
    }

    count = 0;

    constructor() {
//	this.onchange().subscribe(e => console.log("WORKING", e));
    }

    start() {
	setTimeout(() => {
	    this.count += 1;
	    this.onchange_subject.next(this.count > 0);
	});
	console.log("WORKING");
    }

    stop() {
	setTimeout(() => {
	    this.count -= 1;
	    this.onchange_subject.next(this.count > 0);
	});
	console.log("STOP");
    }

}

