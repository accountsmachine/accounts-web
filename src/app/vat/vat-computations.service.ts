
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { VatConfig } from './vat-config';
import { ApiService } from '../api.service';

export class VatComputations {
    PeriodStart : string = "";
    PeriodEnd : string = "";
    VatDueSales : number = 0;
    VatDueAcquisitions : number = 0;
    TotalVatDue : number = 0;
    VatReclaimedCurrPeriod : number = 0;
    NetVatDue : number = 0;
    TotalValueSalesExVAT : number = 0;
    TotalValuePurchasesExVAT : number = 0;
    TotalValueGoodsSuppliedExVAT : number = 0;
    TotalAcquisitionsExVAT : number = 0;
};

@Injectable({
    providedIn: 'root'
})
export class VatComputationsService {

    config : any | null = null;
    record : VatComputations = new VatComputations();

    onload_subject : Subject<VatComputations> = new Subject<VatComputations>();

    onload() {
	return new Observable<VatComputations>(obs => {
	    this.onload_subject.subscribe(e => obs.next(e));
	});
    }

    constructor(
	private api : ApiService,
    ) {

    }

    load(id : string) {
	let url = "/api/vat/compute/" + id;

	return new Observable<VatComputations>(obs => {
	    this.api.post<VatComputations>(url, {}).subscribe(
		(rec : VatComputations) => {
		    this.record = rec;
		    this.onload_subject.next(rec);
		    obs.next(rec);
		}
	    );
	});
    }

}

