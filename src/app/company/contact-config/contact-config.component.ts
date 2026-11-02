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
import { MatSelect, MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'contact-config',
    templateUrl: './contact-config.component.html',
    styleUrls: ['./contact-config.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatHint, MatSelect, MatOption, MatButton]
})
export class ContactConfigComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private state = inject(CompanyService);
    private snackBar = inject(MatSnackBar);
    private working = inject(WorkingService);


    form = new FormGroup({
	contact_email: new FormControl<string>
	    ('', [Validators.required, Validators.email]),
	contact_tel_country: new FormControl<string>(
	    '', [ Validators.required, Validators.pattern("\\+[0-9]+") ]),
	contact_tel_area: new FormControl<string>('', [
	    Validators.required, Validators.pattern("[0-9]+")
	]),
	contact_tel_number: new FormControl<string>('', [
	    Validators.required, Validators.pattern("[0-9]+")
	]),
	contact_tel_type: new FormControl<string>('', [
	    Validators.required,
	]),
    });

    constructor() {
	this.company = new Company();
    }

    company : Company;

    load() {
	this.form.patchValue({
	    contact_email: this.company.contact_email,
	    contact_tel_country: this.company.contact_tel_country,
	    contact_tel_area: this.company.contact_tel_area,
	    contact_tel_number: this.company.contact_tel_number,
	    contact_tel_type: this.company.contact_tel_type,
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
	this.company.contact_email = this.form.value.contact_email ?? '';
	this.company.contact_tel_country = this.form.value.contact_tel_country ?? '';
	this.company.contact_tel_area = this.form.value.contact_tel_area ?? '';
	this.company.contact_tel_number = this.form.value.contact_tel_number ?? '';
	this.company.contact_tel_type = this.form.value.contact_tel_type ?? '';

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

