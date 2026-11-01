import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

export class Status {
    vat  = false;
    corptax  = false;
    accounts  = false;
}

export type Statuses = Record<string, Status>;

@Injectable({
    providedIn: 'root'
})
export class StatusService {
    private api = inject(ApiService);


    get_list() : Observable<Statuses> {
	const url = "/api/status";
    	return this.api.get<Statuses>(url);
    }

    get(id : string) : Observable<Status> {
	const url = "/api/status/" + id;
    	return this.api.get<Status>(url);
    }

}

