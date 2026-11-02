import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class CorptaxService {
    private api = inject(ApiService);


    authorize(id : string, gateway_id : string, password : string) {

	const url = "/api/corptax/authorize/" + id;

    	return this.api.post<void>(
	    url, { gateway_id: gateway_id, password: password }
	);

    }

    deauthorize(c : string) : Observable<void> {

	const url = "/api/corptax/deauthorize/" + c;

    	return this.api.post<void>(
	    url, {}
	);

    }

}
