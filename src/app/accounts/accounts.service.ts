import { Injectable, inject } from '@angular/core';
import { Observable} from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {
    private api = inject(ApiService);


    authorize(id : string, authentication_code : string) {

	const url = "/api/accounts/authorize/" + id;

    	return this.api.post<unknown>(
	    url, { authentication_code: authentication_code }
	);

    }

    deauthorize(c : string) : Observable<void> {

	const url = "/api/accounts/deauthorize/" + c;

    	return this.api.post<void>(
	    url, {}
	);

    }

}
