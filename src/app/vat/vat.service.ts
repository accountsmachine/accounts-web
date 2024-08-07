import { Injectable } from '@angular/core';
import { Observable, map, of, Subject } from 'rxjs';
import { debounceTime, take, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from '../api.service';

import { DeviceIdService } from './../device-id.service';
import { client_version, application_name, application_id } from '../../version';

export type Obligation = {
    status: string,
    periodKey: string,
    start: Date,
    end: Date,
    received?: Date,
    due: Date,
};

export type Payment = {
    amount: number,
    received: Date,
};

export type Liability = {
    type: string,
    originalAmount: number,
    outstandingAmount?: number,
    taxPeriod: {
	from: Date,
	to: Date,
    },
    due: Date,
};

export class Status {
    liabilities : Liability[] = [];
    payments : Payment [] = [];
    obligations : Obligation[] = [];
};

export type Return = {
    periodKey: string,
    vatDueSales: number,
    vatDueAcquisitions: number,
    totalVatDue: number,
    vatReclaimedCurrPeriod: number,
    netVatDue: number,
    totalValueSalesExVAT: number,
    totalValuePurchasesExVAT: number,
    totalValueGoodsSuppliedExVAT: number,
    totalAcquisitionsExVAT: number,
};

export type Criteria = {
    cid : string,
    start : string,
    end : string,
};

@Injectable({
    providedIn: 'root'
})
export class VatService {

    constructor(
	private api : ApiService,
	private device : DeviceIdService,
    ) {

    }

    code = "";
    state = "";

    options = {
	headers: new HttpHeaders({
	    "X-Device-ID": this.device.get_id(),
	    "X-Device-TZ": this.device.get_tz(),
	    "X-Screen": this.device.get_screen_params(),
	    "X-Client-Version": client_version,
	    "X-Application-Name": application_name,
	    "X-Application-ID": application_id,
	})
    };

    getStatus(cid : string, start : string, end : string) : Observable<Status> {

	let url = "/api/vat/status/" + cid;
	url = url + "?start=" + start;
	url = url + "&end=" + end;

    	return this.api.get<any>(url, this.options);

    }

    getObligations(
	cid : string, start : string, end : string
    ) : Observable<Obligation[]> {
	return this.getStatus(cid, start, end).pipe(
	    map(e => e.obligations)
	);
    }

    getOpenObligations(cid : string) : Observable<Obligation[]> {

	let url = "/api/vat/open-obligations/" + cid;

    	return this.api.get<Obligation[]>(
	    url, this.options
	);

    }

    getPayments(
	cid : string, start : string, end : string
    ) : Observable<Payment[]> {
	return this.getStatus(cid, start, end).pipe(
	    map(e => e.payments)
	);
    }

    getLiabilities(
	cid : string, start : string, end : string
    ) : Observable<Liability[]> {
	return this.getStatus(cid, start, end).pipe(
	    map(e => e.liabilities)
	);
    }

    getReturns(
	cid : string, start : string, end : string
    ) : Observable<Return[]> {
	let url = "/api/vat/returns/" + cid;
	url = url + "?start=" + start;
	url = url + "&end=" + end;

    	return this.api.get<Return[]>(
	    url, this.options
	);
    }

    receiveToken(code : any, state : any) {
	this.code = code;
	this.state = state;
    }

    authenticated() : boolean {
        return this.code != "";
    }

    get_auth_url(c : string) : Observable<string> {

	let url = "/api/vat/authorize/" + c;

    	return this.api.get<any>(
	    url, this.options
	).pipe(
	    map(e => e.url)
	);

    }

    deauthorize(c : string) : Observable<void> {

	let url = "/api/vat/deauthorize/" + c;

    	return this.api.post<any>(
	    url, {}, this.options
	);

    }

    submit(id : string) {

	let url = "/api/vat/submit/" + id;

    	return this.api.post<any>(
	    url, {}, this.options
	);

    }

}

