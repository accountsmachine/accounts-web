import { Injectable } from '@angular/core';

import { v4 as uuid } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class DeviceIdService {

    constructor() { }

    get_id() : string {

	let id = window.localStorage.getItem("device-id");

	if (id) return id;

	id = uuid();

	window.localStorage.setItem("device-id", id);

	return id;

    }


    get_tz() : string {
	
	let n = new Date().getTimezoneOffset();

	let s = "UTC";

	if (n < 0) {
	    s += "-";
	    n = -n;
	}

	let h = Math.floor(n / 60).toFixed(0);
	let m = Math.floor(n % 60).toFixed(0);

	if (h.length < 2) s += "0";
	s += h

	s += ":";

	if (m.length < 2) s += "0";
	s += m

	return s;

    };

    get_win_size() : number[] {
	return [window.outerWidth, window.outerHeight];
    }
    
    get_screen_size() : number[] {
	return [window.screen.width, window.screen.height];
    }

    get_screen_params() : string {
	let s = this.get_screen_size();
	let w = this.get_win_size();
	let d = window.screen.colorDepth;
	let r = window.devicePixelRatio;
	
	return JSON.stringify([s[0], s[1], w[0], w[1], d, r]);
    }
    
}

