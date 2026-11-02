import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';
import { CompanyService, Companies } from '../../company/company.service';

import { CorptaxConfigService } from '../corptax-config.service';
import { CorptaxConfig } from '../corptax-config';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { KeyValuePipe } from '@angular/common';

@Component({
    selector: 'corptax-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatHint, MatButton, KeyValuePipe]
})
export class CompanyComponent {
    private route = inject(ActivatedRoute);
    private companyService = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private filing = inject(CorptaxConfigService);
    private fb = inject(FormBuilder);


    companies : Companies = {};

    form = this.fb.group({
    	company: ['', [Validators.required]],
    });

    config : CorptaxConfig = {};

    constructor() {

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();
		});
	    }
	);

	this.companyService.get_list().subscribe(
	    e => {
		this.companies = e;
	    }
	);

    }

    to_date(d : string) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    company: this.config.company,
	});
    }

    from_date(d : moment.Moment) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.company = this.form.value.company ?? undefined;

	this.filing.save().subscribe(
	    () => {
		this.snackBar.open("Configuration saved", "dismiss",
				   { duration: 5000 });
	    }
	)
    }

    revert() {
    }

}

