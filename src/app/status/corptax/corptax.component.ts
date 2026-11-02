import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import {
    MatDialog
} from '@angular/material/dialog';

import { StatusService } from '../status.service';
import { CompanyService, Company } from '../../company/company.service';
import { CorptaxService } from '../../corptax/corptax.service';
import {
    DisconnectConfirmationComponent
} from '../disconnect-confirmation/disconnect-confirmation.component';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-corptax',
    templateUrl: './corptax.component.html',
    styleUrls: ['./corptax.component.scss'],
    imports: [MatCard, MatIcon, FormsModule, MatFormField, MatLabel, MatInput, MatHint, MatButton]
})
export class CorptaxComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private statusService = inject(StatusService);
    private corptax = inject(CorptaxService);
    private companyService = inject(CompanyService);
    private dialog = inject(MatDialog);


    setup = false;

    gateway_id  = "";
    password  = "";
    id = "";

    company : Company = new Company();

    ngOnInit(): void {

	this.route.params.subscribe(
	    params => {
		const id = params["id"];
		combineLatest({
		    status: this.statusService.get(id),
		    companies: this.companyService.get_list(),
		}).subscribe(e => {
		    this.id = id;
		    if (!e.status) {
			this.setup = false;
		    } else {
			this.setup = e.status.corptax;
		    }
		    this.company =
			id in e.companies ? e.companies[id] : new Company();
		});
	    }
	);

    }

    submit() {
	this.corptax.authorize(
	    this.id, this.gateway_id, this.password
	).subscribe(() => {
	    this.router.navigate(["/status"])
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
		    this.corptax.deauthorize(this.id).subscribe(() => {
			this.router.navigate(["/status"])
		    });
		}
	    }
	});

    }

}

