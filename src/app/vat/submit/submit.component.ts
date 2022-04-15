import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { VatComputations, VatComputationsService }
    from '../vat-computations.service';
import { VatService } from '../vat.service';
import { VatLine } from '../vat-line';
//import { CompanyService } from '../company/company.service';

@Component({
    selector: 'vat-submit',
    templateUrl: './submit.component.html',
    styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {

    vat_table : MatTableDataSource<VatLine> = new MatTableDataSource<VatLine>([]);

    id : string = "";

    config : any = {};

//    company : any = {};

    confirmed = false;

    record : VatComputations | null = null;

    constructor(
	private route : ActivatedRoute,
	private filing : VatConfigService,
//	private companyService : CompanyService,
	private comps : VatComputationsService,
	private vat : VatService,
	private router : Router,
    ) {

	this.route.params.subscribe(params => {
	    this.filing.load(params["id"]).subscribe(e => {
		this.id = e.id;
	    	this.config = e.config;
		this.comps.load(e.id).subscribe(record => {
		    this.record = record;
		    this.vat_table.data = [
			{box: "1", description: "VAT due on sales", value: record.VatDueSales},
			{box: "2", description: "VAT due on acquisitions", value: record.VatDueAcquisitions},
			{box: "3", description: "Total VAT due", value: record.TotalVatDue},
			{box: "4", description: "VAT reclaimed", value: record.VatReclaimedCurrPeriod},
			{box: "5", description: "VAT due", value: record.NetVatDue},
			{box: "6", description: "Sales before VAT", value: record.TotalValueSalesExVAT},
			{box: "7", description: "Purchases ex. VAT", value: record.TotalValuePurchasesExVAT},
			{box: "8", description: "Goods supplied ex. VAT", value: record.TotalValueGoodsSuppliedExVAT},
			{box: "9", description: "Total acquisitions ex. VAT", value: record.TotalAcquisitionsExVAT},
		    ];

		})
	    });
	});

    }

    ngOnInit() : void {
    }

    submit() {
	this.filing.submit(this.id).subscribe(() => {
	    this.router.navigate(["/filing"]);
	});
    }

    cancel() {
	this.router.navigate(["/vat/" + this.id + "/company"]);
    }

}

