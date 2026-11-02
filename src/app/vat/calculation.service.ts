
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../api.service';
import { VatConfig } from './vat-config';

export class Calculation {
    calculation?: Record<string, Record<string, {
		transactions : {
		    amount : number;
		    description : string;
		    date : string;
		}[];
		reversed : boolean;
	    }>>;
    error?: {
	kind: string;
	account? : string;
	message? : string;
    }
};

@Injectable({
    providedIn: 'root'
})
export class CalculationService {
    private api = inject(ApiService);


    config : VatConfig | null = null;
    record : Calculation = new Calculation();

    onload_subject : Subject<Calculation> = new Subject<Calculation>();

    onload() {
	return new Observable<Calculation>(obs => {
	    this.onload_subject.subscribe(e => obs.next(e));
	});
    }

    load(id : string) {
	const url = "/api/vat/calculate/" + id;

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

