
// FIXME: Need to handle 'not found' better.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyLookupService {

    get(crn : string) : Observable<any> {
	let url = "/api/company-reg/" + crn;
	return this.api.get<any>(url);
    }

    constructor(
	private api : ApiService,
    ) {
    }

}

