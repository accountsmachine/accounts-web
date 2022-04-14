
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export class ValidationError {
    constructor(
	public id : string,
	public description : string,
	public kind : string,
	public href? : string,
    ) {
    }
};

@Injectable({
    providedIn: 'root'
})
export class ValidationService {

    errors : ValidationError[] = [];

    constructor() {
    }

    load(id : string) {
	this.errors = [
	    new ValidationError(
		"VAL-1",
		"The VAT record contains no accounts data.",
		"ERROR",
		"/vat/09f6f85f-5570-4c60-aa84-2e06cc3b3f60/company",
	    ),
	    new ValidationError(
		"VAL-2",
		"Company not defined.",
		"ERROR",
		"/vat/09f6f85f-5570-4c60-aa84-2e06cc3b3f60/company",
	    ),
	    new ValidationError(
		"VAL-3",
		"Company not defined.",
		"INFO",
		"/vat/09f6f85f-5570-4c60-aa84-2e06cc3b3f60/company",
	    ),
	    new ValidationError(
		"VAL-4",
		"Company not defined.",
		"WARNING",
		"/vat/09f6f85f-5570-4c60-aa84-2e06cc3b3f60/company",
	    ),
	];
	this.subject.next(this.errors);
    }

    subject = new Subject<ValidationError[]>();

    onupdate() : Observable<ValidationError[]> {
	return  this.subject;
    }

}

