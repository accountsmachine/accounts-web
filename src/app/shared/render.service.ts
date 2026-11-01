import { Injectable, inject } from '@angular/core';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class RenderService {
    private api = inject(ApiService);


    render(id : string) {
	const url = "/api/render-html/" + id;
	return this.api.post(url, {}, {"responseType": "text"});
    }

}

