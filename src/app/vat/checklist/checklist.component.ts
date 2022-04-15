import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as moment from 'moment';
import { CompanyService, Company, Companies } from '../../company/company.service';

import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { ChecklistService } from '../checklist.service';
import { Checklist } from '../../checklist/checklist.model';

@Component({
    selector: 'vat-checklist',
    templateUrl: './checklist.component.html',
    styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

    companies : Companies = {};

    checklist : Checklist = new Checklist();

    id = "";
    config : any = {};

    constructor(
	private route : ActivatedRoute,
	private router : Router,
	private companyService : CompanyService,
	private filing : VatConfigService,
	private checklistSvc : ChecklistService,
    ) {

	this.checklistSvc.onupdate().subscribe(
	    (cl : Checklist) => {
	        this.checklist = cl;
	    }
	);

       this.route.params.subscribe(
           params => {
               this.checklistSvc.load(params["id"]);
	       this.filing.load(params["id"]).subscribe(e => {
		   this.id = params["id"];
		   if (e.config.state != "draft")
		       this.router.navigate(["/vat/" + this.id + "/report"]);
		   this.config = e.config;
	       });
           }
       );

    }

    ngOnInit() : void {
    }

}

