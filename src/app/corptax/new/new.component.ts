import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CorptaxConfigService } from '../corptax-config.service';

@Component({
  selector: 'corptax-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

    label = "";

    configs : any[] = [];

    constructor(
	private filing : CorptaxConfigService,
	private router : Router,
	private snackBar : MatSnackBar,
    ) { }

    ngOnInit(): void {
    }

    cancel() {
	this.router.navigate(["/filing"]);
    }

    create() {

	if (this.label == "") {
	    this.snackBar.open("Invalid configuration label", "dismiss",
			       { duration: 5000 });
	    return;
	}

	let id = "c-" + this.configs.length;

	this.filing.create(this.label).subscribe(
	    id => {
		this.snackBar.open("Configuration created", "dismiss",
				   { duration: 5000 });
		this.router.navigate(["/corptax/" + id + "/company"])
	    }
	);

    }
}

