import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class CorptaxService {

    constructor(private api : ApiService) { }

    authorize(id : string, gateway_id : string, password : string) {

	let url = "/api/corptax/authorize/" + id;

    	return this.api.post<any>(
	    url, { gateway_id: gateway_id, password: password }
	);

    }

    deauthorize(c : string) : Observable<void> {

	let url = "/api/corptax/deauthorize/" + c;

    	return this.api.post<any>(
	    url, {}
	);

    }

}
