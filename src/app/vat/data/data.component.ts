import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { VatLine } from '../vat-line';
import { VatComputations } from '../vat-computations.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { RecordComponent } from '../record/record.component';

@Component({
    selector: 'vat-data',
    templateUrl: './data.component.html',
    styleUrls: ['./data.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, RecordComponent]
})
export class DataComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private filing = inject(VatConfigService);


    id = "";
    config : VatConfig = {};

    vat_table : MatTableDataSource<VatLine> = new MatTableDataSource<VatLine>([]);

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.id = params["id"];
		    this.config = e.config;
		    this.filing.get_data(this.id).subscribe(
			(r) => {
			    const record = r as VatComputations;

			    this.vat_table.data = [
				{
				    box: "1",
				    description: "VAT due on sales",
				    value: record.VatDueSales
				},
				{
				    box: "2",
				    description: "VAT due on acquisitions",
				    value: record.VatDueAcquisitions
				},
				{
				    box: "3",
				    description: "Total VAT due",
				    value: record.TotalVatDue
				},
				{
				    box: "4",
				    description: "VAT reclaimed",
				    value: record.VatReclaimedCurrPeriod
				},
				{
				    box: "5",
				    description: "VAT due",
				    value: record.NetVatDue
				},
				{
				    box: "6",
				    description: "Sales before VAT",
				    value: record.TotalValueSalesExVAT
				},
				{
				    box: "7",
				    description: "Purchases ex. VAT",
				    value: record.TotalValuePurchasesExVAT
				},
				{
				    box: "8",
				    description: "Goods supplied ex. VAT",
				    value: record.TotalValueGoodsSuppliedExVAT
				},
				{
				    box: "9",
				    description: "Total acquisitions ex. VAT",
				    value: record.TotalAcquisitionsExVAT
				},
			    ];
			}
		    );
		});
	    }
	);
    }

}

