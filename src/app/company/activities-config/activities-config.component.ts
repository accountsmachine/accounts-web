import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipGrid, MatChipRow, MatChipRemove, MatChipInput } from '@angular/material/chips';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'activities-config',
    templateUrl: './activities-config.component.html',
    styleUrls: ['./activities-config.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatHint, MatInput, MatChipGrid, MatChipRow, MatChipRemove, MatIcon, MatChipInput, MatButton]
})
export class ActivitiesConfigComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private state = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private working = inject(WorkingService);


    readonly chipSeparatorKeysCodes = [ENTER, COMMA] as const;

    form = new FormGroup({
	sector: new FormControl('', [Validators.required]),
	activities: new FormControl<string>('', [Validators.required]),
	sic_codes: new FormControl<string[]>([]),
    });

    constructor() {
	this.company = new Company();
    }

    company : Company;

    load() {
	this.form.patchValue({
	    sector: this.company.sector,
	    activities: this.company.activities,
	});

	this.sic_codes.setValue(this.company.sic_codes);
	this.sic_codes.updateValueAndValidity();

    }

    ngOnInit(): void {
	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.working.start();
		    this.state.load(params["id"]).subscribe({
			next: (c) => {
			    this.working.stop();
			    if (c) {
		    		this.company = c;
				this.load();
			    }
			},
			error: (_e) => {
			    this.working.stop();
			}
		    });
		}
	    }
	);
    }

    public success() {
	this.snackBar.open("Configuration saved", "dismiss",
				       { duration: 5000 });
    }

    public submit() {

	if (this.form.value.sector)
	    this.company.sector = this.form.value.sector;
	else
	    this.company.sector = "";

	if (this.form.value.activities)
	    this.company.activities = this.form.value.activities;
	else
	    this.company.activities = "";

	if (this.sic_codes.value)
	    this.company.sic_codes = this.sic_codes.value;
	else
	    this.company.sic_codes = [];

	this.working.start();

	this.state.save().subscribe({
	    next: () => { this.working.stop(); this.success(); },
	    error: (_e) => { this.working.stop(); },
	    complete: () => {},
	});

    }

    public revert() {
	this.load();
    }

    addSIC(event: MatChipInputEvent): void {

	if (this.sic_codes.value) {

	    const value = (event.value || '').trim();

	    if (value) {
		this.sic_codes.setValue([...this.sic_codes.value, value]);
		this.sic_codes.updateValueAndValidity();
	    }

	    // Clear the input value
	    event.chipInput!.clear();

	}

    }

    removeSIC(value: string): void {

	if (this.sic_codes.value) {

	    const index = this.sic_codes.value.indexOf(value);

	    if (index >= 0) {
		this.sic_codes.value.splice(index, 1);
		this.sic_codes.updateValueAndValidity();
	    }

	}

    }

    get sic_codes() {
	return this.form.get("sic_codes")!;
    }
    
}

