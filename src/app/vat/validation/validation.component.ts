
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { ValidationService, ValidationError } from '../validation.service';


@Component({
    selector: 'validation',
    templateUrl: './validation.component.html',
    styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

    errors : MatTableDataSource<ValidationError> =
	new MatTableDataSource<ValidationError>([]);

    columns = [ "id", "kind", "description", "action" ];

    constructor(
	private validation : ValidationService,
	private route : ActivatedRoute,
	private router : Router,
    ) {
	this.validation.onupdate().subscribe(
	    (errs : ValidationError[]) => {
		this.errors.data = errs;
	    }
	);

	this.route.params.subscribe(
	    params => {
		this.validation.load(params["id"]);
	    }
	);

    }

    ngOnInit(): void {
	this
    }

    select(row : ValidationError) {
	this.router.navigate([row.href]);
    }

}
