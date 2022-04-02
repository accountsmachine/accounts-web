import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { CompanyService, Company } from '../company.service';

@Component({
  selector: 'web-config',
  templateUrl: './web-config.component.html',
  styleUrls: ['./web-config.component.scss']
})
export class WebConfigComponent implements OnInit {

    form = this.fb.group({
	web_description: ['', [Validators.required]],
	web_url: ['', [
	    Validators.required, Validators.pattern("(http|https)://.*")
	]],
    });

    constructor(
	private route : ActivatedRoute,
	private state: CompanyService,
	private snackBar: MatSnackBar,
	private fb: FormBuilder,
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
		    this.state.load(params["id"]).subscribe(c => {
			if (c) {
			    this.company = c;
			    this.load();
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
	this.company.web_description = this.form.value.web_description;
	this.company.web_url = this.form.value.web_url;

	this.state.save().subscribe(
	    e => this.success()
	);

    }

    public revert() {
	this.load();
    }

}

