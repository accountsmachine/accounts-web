import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

import { WorkingService } from '../../working.service';
import { VatConfigService } from '../vat-config.service';
import { VatConfig } from '../vat-config';
import { VatService, Obligation } from '../vat.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'vat-period',
    templateUrl: './period.component.html',
    styleUrls: ['./period.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatHint, MatButton]
})
export class PeriodComponent {
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private filing = inject(VatConfigService);
    private vat = inject(VatService);
    private fb = inject(FormBuilder);
    working = inject(WorkingService);


    form = this.fb.group({
	period_key: ['', [Validators.required]],
    });

    config : VatConfig = {};

    obligations : Obligation[] = [];

    constructor() {

	this.route.params.subscribe(
	    params => {
		this.filing.load(params["id"]).subscribe(e => {
		    this.config = e.config;
		    this.load();

		    if (this.config.company) {

			this.working.start();

			this.vat.getOpenObligations(
			    this.config.company
			).subscribe({
			    next: obl => {
			    	this.obligations = obl;
				this.working.stop();
			    },
			    error: _err => {
				this.working.stop();
			    },
			    complete: () => {
			    },
			});
		    }

		});
	    }
	);

    }

    load() {
	this.form.patchValue({
	    period_key: this.config.period_key,
	});
    }

    submit() {

	this.config.period_key = this.form.value.period_key ?? undefined;

	for(const ob of this.obligations) {
	    if (ob.periodKey == this.config.period_key) {
		this.config.start = ob.start;
		this.config.end = ob.end;
		this.config.due = ob.due;
	    }
	}

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

