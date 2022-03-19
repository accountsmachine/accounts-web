import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
    }

    stop() {
	setTimeout(() => {
	    this.count -= 1;
	    this.onchange_subject.next(this.count > 0);
	});
    }

}

