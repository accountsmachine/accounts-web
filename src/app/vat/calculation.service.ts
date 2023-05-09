
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { VatConfig } from './vat-config';
import { ApiService } from '../api.service';

export class Calculation {
    [line : string] : {
	[account : string] : {
	    transactions : {
		amount : number;
		description : string;
		date : string;
	    }[];
	    reversed : boolean;
	}
    };
};

@Injectable({
    providedIn: 'root'
})
export class CalculationService {

    config : any | null = null;
    record : Calculation = new Calculation();

    onload_subject : Subject<Calculation> = new Subject<Calculation>();

    onload() {
	return new Observable<Calculation>(obs => {
	    this.onload_subject.subscribe(e => obs.next(e));
	});
    }

    constructor(
	private api : ApiService,
    ) {

    }

    load(id : string) {
	let url = "/api/vat/calculate/" + id;

	return new Observable<Calculation>(obs => {
	    this.api.post<Calculation>(url, {}).subscribe(
		(rec : Calculation) => {
		    this.record = rec;
		    this.onload_subject.next(rec);
		    obs.next(rec);
		}
	    );
	});
    }

}

