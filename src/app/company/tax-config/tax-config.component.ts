import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'tax-config',
    templateUrl: './tax-config.component.html',
    styleUrls: ['./tax-config.component.scss']
})
export class TaxConfigComponent implements OnInit {

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

    constructor(
	private route : ActivatedRoute,
	private state: CompanyService,
	private snackBar: MatSnackBar,
	private working : WorkingService,
    ) {
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
			error: (e) => {
			    this.working.stop();
			}
		    });
		}
	    }
	);
    }

    public success() {
	let snack = this.snackBar.open("Configuration saved", "dismiss",
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
	    next: (e) => { this.working.stop(); this.success(); },
	    error: (e) => { this.working.stop(); },
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

