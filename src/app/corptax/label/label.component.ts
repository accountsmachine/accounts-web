import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import moment from 'moment';

import { CorptaxConfigService } from '../corptax-config.service';
import { CorptaxConfig } from '../corptax-config';
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
    private filing = inject(CorptaxConfigService);
    private fb = inject(FormBuilder);


    form = this.fb.group({
	label: ['', [Validators.required]],
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

