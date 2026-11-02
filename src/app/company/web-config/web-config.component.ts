import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CompanyService, Company } from '../company.service';
import { WorkingService } from '../../working.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'web-config',
    templateUrl: './web-config.component.html',
    styleUrls: ['./web-config.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton]
})
export class WebConfigComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private state = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private working = inject(WorkingService);


    form = new FormGroup({
	web_description: new FormControl<string>('', [Validators.required]),
	web_url: new FormControl<string>('', [
	    Validators.required, Validators.pattern("(http|https)://.*")
	]),
    });

    constructor() {
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
	    next: () => { this.working.stop(); this.success(); },
	    error: (_e) => { this.working.stop(); },
	    complete: () => {},
	});

    }

    public revert() {
	this.load();
    }

}

