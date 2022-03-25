import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {

    constructor(private api : ApiService) { }

    authorize(id : string, authentication_code : string) {

	let url = "/api/accounts/authorize/" + id;

    	return this.api.post<any>(
	    url, { authentication_code: authentication_code }
	);

    }

    deauthorize(c : string) : Observable<void> {

	let url = "/api/accounts/deauthorize/" + c;

    	return this.api.post<any>(
	    url, {}
	);

    }

}
