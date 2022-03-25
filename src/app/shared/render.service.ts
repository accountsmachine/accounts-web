import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class RenderService {

    constructor(private api : ApiService) {
    }

    render(id : string) {
	let url = "/api/render-html/" + id;
	return this.api.post(url, {}, {"responseType": "text"});
    }

}

