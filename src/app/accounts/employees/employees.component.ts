import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { AccountsConfigService } from '../accounts-config.service';
import { AccountsConfig } from '../accounts-config';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'accounts-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton]
})
export class EmployeesComponent {
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private filing = inject(AccountsConfigService);
    private fb = inject(FormBuilder);


    form = this.fb.group({
	period_average_employees: ['', [Validators.required]],
	prev_average_employees: ['', [Validators.required]],
    });

    config : AccountsConfig = {};

    constructor() {

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();
		});
	    }
	);

    }

    to_date(d : string) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    period_average_employees: this.config.period_average_employees?.toString() ?? '',
	    prev_average_employees: this.config.prev_average_employees?.toString() ?? '',
	});
    }

    from_date(d : moment.Moment) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.period_average_employees =
	    this.form.value.period_average_employees ? Number(this.form.value.period_average_employees) : undefined;
	this.config.prev_average_employees =
	    this.form.value.prev_average_employees ? Number(this.form.value.prev_average_employees) : undefined;

	this.filing.save().subscribe(
	    () => {
		this.snackBar.open("Configuration saved",
				   "dismiss",
				   { duration: 5000 });
	    }
	);

    }

    revert() {
    }

}

