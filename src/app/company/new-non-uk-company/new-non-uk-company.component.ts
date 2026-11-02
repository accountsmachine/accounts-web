
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { countries } from '../../countries';

import { MatSnackBar } from '@angular/material/snack-bar';

import { CompanyLookupService } from '../company-lookup.service';
import { CompanyService, Company } from '../company.service';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'new-non-uk-company',
    templateUrl: './new-non-uk-company.component.html',
    styleUrls: ['./new-non-uk-company.component.scss'],
    imports: [FormsModule, MatFormField, MatLabel, MatInput, MatHint, MatAutocompleteTrigger, ReactiveFormsModule, MatAutocomplete, MatOption, MatButton, MatIcon, AsyncPipe]
})
export class NewNonUkCompanyComponent implements OnInit {
    private router = inject(Router);
    private snackBar = inject(MatSnackBar);
    private companyService = inject(CompanyService);
    private companyLookup = inject(CompanyLookupService);


    name  = "";
    number  = "";
    city  = "";
    country  = "";

    countries = countries.map(x => x.name);
    filteredCountries? : Observable<string[]>;
    control = new FormControl('country');

    company : Company | null = null;

    ngOnInit(): void {

	this.filteredCountries = this.control.valueChanges.pipe(
	    startWith(''),
	    map(value => this.filter(value || '')),
	);

    }

    private filter(value: string): string[] {

	const filterValue = value.toLowerCase();

	return this.countries.filter(
	    (option : string) => option.toLowerCase().includes(filterValue)
	);

    }

    create() {

	this.companyService.create_non_uk_company(
	    this.name, this.number, this.city, this.country,
	).subscribe(
	    (id : string) => {
		this.snackBar.open("Configuration created",
				   "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/company/" + id]);
	    }
	);

    }

    cancel() {
	this.router.navigate(["/company"]);
    }

}

