import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { WorkingService } from '../../working.service';
import { VatConfigService } from '../vat-config.service';
import { VatConfig } from '../vat-config';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'label',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton]
})
export class LabelComponent {
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private filing = inject(VatConfigService);
    private fb = inject(FormBuilder);
    working = inject(WorkingService);


    form = this.fb.group({
	label: ['', [Validators.required]],
    });

    config : VatConfig = {};

    constructor() {

	this.route.params.subscribe(
	    params => {

		this.working.start();

		this.filing.load(params["id"]).subscribe({
		    next: e => {
			this.config = e.config;
			this.load();
			this.working.stop();
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

    to_date(d : string) {
	return moment(d);
    }

    load() {
	this.form.patchValue({
	    label: this.config.label,
	});
    }

    from_date(d : moment.Moment) {
	return d.format("YYYY-MM-DD");
    }

    submit() {

	this.config.label = this.form.value.label ?? undefined;

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

