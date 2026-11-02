
import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../api.service';
import { VatConfig } from './vat-config';

export class VatComputations {
    PeriodStart  = "";
    PeriodEnd  = "";
    VatDueSales  = 0;
    VatDueAcquisitions  = 0;
    TotalVatDue  = 0;
    VatReclaimedCurrPeriod  = 0;
    NetVatDue  = 0;
    TotalValueSalesExVAT  = 0;
    TotalValuePurchasesExVAT  = 0;
    TotalValueGoodsSuppliedExVAT  = 0;
    TotalAcquisitionsExVAT  = 0;
};

@Injectable({
    providedIn: 'root'
})
export class VatComputationsService {
    private api = inject(ApiService);


    config : VatConfig | null = null;
    record : VatComputations = new VatComputations();

    onload_subject : Subject<VatComputations> = new Subject<VatComputations>();

    onload() {
	return new Observable<VatComputations>(obs => {
	    this.onload_subject.subscribe(e => obs.next(e));
	});
    }

    load(id : string) {
	const url = "/api/vat/compute/" + id;

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

