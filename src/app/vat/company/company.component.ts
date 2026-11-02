import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import moment from 'moment';

import { CompanyService, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';
import { VatConfigService } from '../vat-config.service';
import { VatConfig } from '../vat-config';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { KeyValuePipe } from '@angular/common';

@Component({
    selector: 'vat-company',
    templateUrl: './company.component.html',
    styleUrls: ['./company.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatHint, MatButton, KeyValuePipe]
})
export class CompanyComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private companyService = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private filing = inject(VatConfigService);
    private fb = inject(FormBuilder);
    working = inject(WorkingService);


    companies : Companies = {};

    form = this.fb.group({
    	company: ['', [Validators.required]],
    });

    id = "";
    config : VatConfig = {};

    constructor() {

	this.route.params.subscribe(
	    params => {

		this.working.start();

		this.filing.load(params["id"]).subscribe({
		    next: e => {
			this.working.stop();
			this.id = params["id"];
			if (e.config.state != "draft")
			    this.router.navigate(
				["/vat/" + this.id + "/report"]
			    );
			this.config = e.config;
			this.load();
		    },
		    error: _err => {
			this.working.stop();
		    },
		    complete: () => {
		    },
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
	    _e => {
		this.snackBar.open("Configuration saved", "dismiss",
				   { duration: 5000 });
	    }
	)
    }

    revert() {
    }

}

