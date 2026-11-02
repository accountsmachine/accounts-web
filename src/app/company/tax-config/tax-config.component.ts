import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'tax-config',
    templateUrl: './tax-config.component.html',
    styleUrls: ['./tax-config.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton]
})
export class TaxConfigComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private state = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private working = inject(WorkingService);


    form = new FormGroup({
	utr: new FormControl<string>('', [
//	    Validators.required,
	    //Validators.pattern('[0-9]*')]
	]),
	vat_registration: new FormControl<string>('', [
//	    Validators.required,
	    // Validators.pattern('[A-Z]{2}[0-9]{9}')
	]),
	vrn: new FormControl<string>('', [
//	    Validators.required,
	    //Validators.pattern('[0-9]{9}')
	]),
    });

    constructor() {
	this.company = new Company();
    }

    company : Company;

    load() {
	this.form.patchValue({
	    utr: this.company.utr,
	    vat_registration: this.company.vat_registration,
	    vrn: this.company.vrn,
	});
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
    	if (this.form.value.utr)
	    this.company.utr = this.form.value.utr;
	else
	    this.form.value.utr = "";

	if (this.form.value.vrn)
	    this.company.vrn = this.form.value.vrn;
	else
	    this.form.value.vrn = "";

	if (this.form.value.vat_registration)
	    this.company.vat_registration = this.form.value.vat_registration;
	else
	    this.form.value.vat_registration = "";

	this.working.start();

	this.state.save().subscribe({
	    next: () => { this.working.stop(); this.success(); },
	    error: (_e) => { this.working.stop(); },
	    complete: () => {},
	});

    }

    get utr() { return this.form.get('utr'); }
    get vat_registration() { return this.form.get('vat_registration'); }
    get vrn() { return this.form.get('vrn')!; }

    public revert() {
	this.load();
    }

}

