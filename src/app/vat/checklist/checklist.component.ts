import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService, Companies } from '../../company/company.service';

import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { ChecklistService } from '../checklist.service';
import { Checklist } from '../../checklist/checklist.model';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { ChecklistTableComponent } from '../../checklist/checklist-table/checklist-table.component';

@Component({
    selector: 'vat-checklist',
    templateUrl: './checklist.component.html',
    styleUrls: ['./checklist.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, ChecklistTableComponent]
})
export class ChecklistComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private companyService = inject(CompanyService);
    private filing = inject(VatConfigService);
    private checklistSvc = inject(ChecklistService);
    working = inject(WorkingService);


    companies : Companies = {};

    checklist : Checklist = new Checklist();

    id = "";
    config : VatConfig = {};

    constructor() {

	this.checklistSvc.onupdate().subscribe(
	    (cl : Checklist) => {
	        this.checklist = cl;
	    }
	);

       this.route.params.subscribe(
           params => {

               this.checklistSvc.load(params["id"]);

	       this.working.start();

	       this.filing.load(params["id"]).subscribe({
		   next: e => {

		       this.id = params["id"];

		       this.working.stop();

		       if (e.config.state != "draft")
			   this.router.navigate(["/vat/" + this.id + "/report"]);

		       this.config = e.config;


		   },

		   error: _err => {
		       this.working.stop();
		   },

		   complete: () => {
		   },

	       });
           }
       );

    }

}

