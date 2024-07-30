import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';

@Component({
  selector: 'web-config',
  templateUrl: './web-config.component.html',
  styleUrls: ['./web-config.component.scss']
})
export class WebConfigComponent implements OnInit {

    form = new FormGroup({
	web_description: new FormControl<string>('', [Validators.required]),
	web_url: new FormControl<string>('', [
	    Validators.required, Validators.pattern("(http|https)://.*")
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
	    web_description: this.company.web_description,
	    web_url: this.company.web_url,
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

	if (this.form.value.web_description)
	    this.company.web_description = this.form.value.web_description;
	else
	    this.company.web_description = "";

	if (this.form.value.web_url)
	    this.company.web_url = this.form.value.web_url;
	else
	    this.company.web_url = "";

	this.working.start();

	this.state.save().subscribe({
	    next: (e) => { this.working.stop(); this.success(); },
	    error: (e) => { this.working.stop(); },
	    complete: () => {},
	});

    }

    public revert() {
	this.load();
    }

}

