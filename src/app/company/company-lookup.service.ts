
// FIXME: Need to handle 'not found' better.
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';
import { CompanyLookupRecord } from './company.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyLookupService {
    private api = inject(ApiService);


    get(crn : string) : Observable<CompanyLookupRecord> {
	const url = "/api/company-reg/" + crn;
	return this.api.get<CompanyLookupRecord>(url);
    }

}

