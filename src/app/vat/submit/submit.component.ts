import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { VatComputations, VatComputationsService }
    from '../vat-computations.service';
import { VatService } from '../vat.service';
import { VatLine } from '../vat-line';
import { Company, CompanyService } from '../../company/company.service';

import { ConfigurationService } from '../../configuration.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { RecordComponent } from '../record/record.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'vat-submit',
    templateUrl: './submit.component.html',
    styleUrls: ['./submit.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, RecordComponent, MatSlideToggle, FormsModule, MatButton, MatIcon, DatePipe]
})
export class SubmitComponent {
    private route = inject(ActivatedRoute);
    private filing = inject(VatConfigService);
    private companyService = inject(CompanyService);
    private comps = inject(VatComputationsService);
    private vat = inject(VatService);
    private router = inject(Router);
    private working = inject(WorkingService);
    private configSvc = inject(ConfigurationService);


    feature(x : string) {
        return this.configSvc.hasFeature(x);
    }

    vat_table : MatTableDataSource<VatLine> = new MatTableDataSource<VatLine>([]);

    id  = "";

    config : VatConfig = {};

    company : Company = new Company();

    confirmed = false;

    record : VatComputations | null = null;

    get_config(id : string) {

	this.working.start();

	this.filing.load(id).subscribe({

	    next: e => {

		this.working.stop();

                if (e.config.company) {
		    this.get_company(e.config.company);
		} else {
		    this.company = new Company();
		}

		this.id = e.id;
	    	this.config = e.config;

		this.get_comps(e.id);
	    },

	    error: _e => {

		this.working.stop();

		this.id = "";
		this.config = {};
	    }

	});

    }

    get_company(id : string) {

	this.working.start();

	this.companyService.load(id).subscribe({

	    next: c => {
		this.working.stop();
		this.company = c ?? new Company();
	    },

	    error: _e => {
		this.working.stop();
		this.company = new Company();
	    },

	});
    }

    get_comps(id : string) {

	this.working.start();

	this.comps.load(id).subscribe({

	    next: record => {
		this.working.stop();
		this.load_comps(record);
	    },

	    error: _e => {
		this.working.stop();
		this.record = new VatComputations();
		this.vat_table.data = [];
	    }

	});

    }

    load_comps(record : VatComputations) {
	
	this.record = record;

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

    constructor() {

	this.route.params.subscribe(params => {
	    this.get_config(params["id"]);
	});
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

