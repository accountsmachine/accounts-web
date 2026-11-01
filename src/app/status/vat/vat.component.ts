import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
    MatDialog
} from '@angular/material/dialog';

import { StatusService } from '../status.service';
import { WorkingService } from '../../working.service';
import {
    CompanyService, Company
} from '../../company/company.service';
import { VatService, Status } from '../../vat/vat.service';
import {
    DisconnectConfirmationComponent
} from '../disconnect-confirmation/disconnect-confirmation.component';
import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { ObligationsComponent } from '../obligations/obligations.component';
import { LiabilitiesComponent } from '../liabilities/liabilities.component';
import { PaymentsComponent } from '../payments/payments.component';

@Component({
    selector: 'vat',
    templateUrl: './vat.component.html',
    styleUrls: ['./vat.component.scss'],
    imports: [MatIcon, MatButton, MatCard, MatCardContent, FormsModule, ReactiveFormsModule, MatButtonToggleGroup, MatButtonToggle, ObligationsComponent, LiabilitiesComponent, PaymentsComponent]
})
export class VatComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private statusService = inject(StatusService);
    private companyService = inject(CompanyService);
    private vat = inject(VatService);
    private dialog = inject(MatDialog);
    private formBuilder = inject(FormBuilder);
    working = inject(WorkingService);


    public form : FormGroup;

    company : Company = new Company();
    setup = false;

    year : { start: string, end: string, name: string } = { start: '', end: '', name: '' };

    years : { start : string, end : string, name : string }[] = [];

    id  = "";

    constructor() {

	const now = new Date();
	const curYear = now.getFullYear();

	const y = [];

	for (let i = 0; i < 10; i++) {
	    const start = new Date(curYear - i, 0, 1);
	    let end = new Date(curYear - i, 11, 31);
	    if (i == 0)
		end = new Date()
	    y.push({
		name: (curYear - i).toString(),
		start: start.toISOString().substring(0, 10),
		end: end.toISOString().substring(0, 10),
	    });
	}

	this.years = y;
	this.year = y[0];

	this.form = this.formBuilder.group({
	    year: [this.year],
	});

    }

    status : Status = new Status();

    update() {

	this.status = new Status();

	this.working.start();

	this.vat.getStatus(this.id, this.year.start, this.year.end).subscribe({
	    next: e => {
		this.status = e;
		this.working.stop();
	    },
	    error: err => {
		console.log("Failed to get status", err);
		this.error("Failed to load VAT status for company " + this.id);
		this.working.stop();
	    },
	    complete: () => {
	    },
	});
	
    }

    ngOnInit(): void {

	this.route.params.subscribe({

	    next: (params) => {

		const id = params["id"];
		this.id = id;

		this.update();

		this.working.start();

		this.statusService.get(id).subscribe({
		    next: e => {
			if (!e) {
			    this.setup = false;
			} else {
			    this.setup = e.vat;
			}
			this.working.stop();
		    },
		    error: _e => {
			this.working.stop();
		    },
		    complete: () => {
		    },
		});

		this.working.start();

		this.companyService.get_list().subscribe({
		    next: e => {
			this.company =
			    id in e ? e[id] : new Company();
			this.working.stop();
		    },
		    error: _e => {
			this.working.stop();
		    },
		    complete: () => {
		    },
		});

	    },
	    error: (_err) => {
	    },
	    complete: () => {
	    },
	});

    }

    authenticate() {
	this.vat.get_auth_url(this.id).subscribe((url : string) => {
	    window.location.href = url;
	});
    }

    disconnect() {

	const dialogRef = this.dialog.open(
	    DisconnectConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    company: this.company,
		},
	    }
	);
	
	dialogRef.afterClosed().subscribe((result : { proceed?: boolean } | undefined) => {
	    if (result) {
		if (result.proceed) {
		    this.vat.deauthorize(this.id).subscribe(() => {
			this.router.navigate(["/status"])
		    });
		}
	    }
	});

    }

    select() {
	this.year = this.form.value.year;
	this.update();
    }

    fix_vrn() {
        this.router.navigate(["/company/" + this.id + "/tax"]);

    }

    retry() {
        this.update();
    }

    error(m : string) {
	const dialogRef = this.dialog.open(
	    ErrorDialogComponent, {
		width: '550px',
		data: {
		    retry: false,
		    message: m,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : { retry?: boolean } | undefined) => {
	    if (result) {
		if (result.retry) {
		    this.retry();
		}
	    }
	});
    }

}

