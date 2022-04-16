import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiService } from '../api.service';

export class Status {
    vat : boolean = false;
    corptax : boolean = false;
    accounts : boolean = false;
}

export type Statuses = {
    [key: string]: Status,
};

@Injectable({
    providedIn: 'root'
})
export class StatusService {

//    onchange_subject = new BehaviorSubject<Statuses>({});

//    onchange() : Observable<Statuses> {
//	return this.onchange_subject;
//    }

    constructor(private api: ApiService) {
    }

    get_list() : Observable<Statuses> {
	let url = "/api/status";
    	return this.api.get<any>(url);
    }

    get(id : string) : Observable<Status> {
	let url = "/api/status/" + id;
    	return this.api.get<any>(url);
    }

}

