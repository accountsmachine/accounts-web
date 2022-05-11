import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take, repeatWhen, delay, tap } from 'rxjs/operators';
import { interval } from 'rxjs';

import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { FilingConfigService, FilingItem } from '../filing-config.service';
import { get_kind_label } from '../../kinds';
import { CompanyService, Companies } from '../../company/company.service';
import {
    UserProfileService, UserProfile
} from '../../profile/user-profile.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import { WorkingService } from '../../working.service';
import { Balance } from '../../commerce/commerce.model';
import { CommerceService } from '../../commerce/commerce.service';

import { environment } from '../../../environments/environment';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    filingConfigs : FilingItem[] = [];
    companies : Companies = {};

    features : Set<string> = new Set(environment.features);

    balance : Balance | null = null;

    draft : FilingItem[] = [];
    pending : FilingItem[] = [];
    errored : FilingItem[] = [];
    published : FilingItem[] = [];

    constructor(
	private router : Router,
	private filingConfigService : FilingConfigService,
	private companyService : CompanyService,
	private profile : UserProfileService,
	private dialog : MatDialog,
	private commerceService : CommerceService,
	private working : WorkingService,
    ) {

	// This isn't a one-off, multiple events come back.
	this.commerceService.onbalance().subscribe({
	    next: (b) => { this.balance = b; },
	    error: (e) => { },
	    complete: () => { },
	});

    }

    nocredits() : boolean {
	if (!this.balance) return true;
	if (this.balance.vat == 0 &&
	    this.balance.corptax == 0 &&
	    this.balance.accounts == 0) {
	    return true;
	}
	return false;
    }

    empty = true;

    is_empty(thing : any) : boolean {
	if (thing === undefined) return true;
	if (thing === null) return true;
	let val = (Object.keys(thing).length > 0);
	return !val;
    }

    ngOnInit(): void {
	this.working.start();
	this.companyService.get_list().subscribe({
	    next: (e) => {
		this.working.stop();
		this.companies = e;
		this.empty = this.is_empty(e);
	    },
	    error: (e) => { this.working.stop(); },
	    complete: () => {},
	});

	this.reload(true);

    }

    ngOnDestroy(): void {
	if (this.reload_subs) {
	    this.reload_subs.unsubscribe();
	}
    }

    maybe_changing(x : any) {

	let pending = this.filingConfigs.filter(e => e.state == "pending");
	if (pending.length > 0) return true;

	return false;

    }

    reload_subs : any = null;
    reload_working = true;

    reload(quick : boolean = false) {

	if (!this.reload_working) {
	    this.reload_working = true;
	    this.working.start();
	}

	if (this.reload_subs) {
	    this.reload_subs.unsubscribe();
	    this.reload_subs = null;
	}

	this.reload_subs = this.filingConfigService.list().pipe(
	    take(1)
	).subscribe({

	    next: (e) => {

		if (this.reload_working) {
		    this.reload_working = false;
		    this.working.stop();
		}

		this.filingConfigs = e; this.load();

		if (quick) {
		    interval(250).pipe(take(1)).subscribe(
			e => this.reload()
		    );
		} else {
		    if (this.maybe_changing(e)) {
			interval(5000).pipe(take(1)).subscribe(
			    e => this.reload()
			);
		    }
		}
		
	    },

	    error: (e) => {
		if (this.reload_working) {
		    this.reload_working = false;
		    this.working.stop();
		}
	    },

	    complete: () => {
		this.reload_subs.unsubscribe();
	    },

	});

    }

    feature(x : string) {
	let p = this.features.has(x);
	return p;
    }

    load() {
	this.draft = this.filingConfigs.filter(e => e.state == "draft");
	this.pending = this.filingConfigs.filter(e => e.state == "pending");
	this.errored = this.filingConfigs.filter(e => e.state == "errored");
	this.published = this.filingConfigs.filter(e => e.state == "published");
    }

    create_accounts() {
	this.router.navigate(["/accounts/new"]);
    }

    create_corptax() {
	this.router.navigate(["/corptax/new"]);
    }

    create_vat() {
	this.router.navigate(["/vat/new"]);
    }

    kind_label(k : string) : string {
	return get_kind_label(k).toUpperCase();
    };

    select(config : any) {
	this.router.navigate(["/" + config.kind + "/" + config.id]);
	return false;
    }

    company(config : any) {
	if ("company" in config) {
	    if (config.company in this.companies) {
		let company = this.companies[config.company]
		return company.company_name;
	    }
	}
	return "-";
    }

    edit(config : any) {
	this.router.navigate(["/" + config.kind + "/" + config.id]);
    }

    move_draft(config : any) {
	this.working.start();
	this.filingConfigService.move_draft(
	    config.id
	).subscribe({
	    next: () => { this.working.stop(); this.reload(true); },
	    error: (e) => { this.working.stop(); },
	    complete: () => {},
	});
    }

    view(config : any) {
	this.router.navigate(["/" + config.kind + "/" + config.id + "/report"]);
    }

    commerce() {
	this.router.navigate(["/commerce"]);
    }

    delete(config : any) {

	const dialogRef = this.dialog.open(
	    DeleteConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    config: config,
		    company: config.company in this.companies ?
			this.companies[config.company] : null,
		},
	    }
	);
	dialogRef.afterClosed().subscribe({
	    next: (result : any) => {
		if (result) {
		    if (result.proceed) {
			this.working.start();
			this.filingConfigService.delete(
			    result.config.id
			).subscribe({
			    next: () => {
				this.working.stop();
				this.reload(true);
			    },
			    error: (err) => {
				this.working.stop();
			    },
			    complete: () => {},
			});
		    }
		}
	    },
	});

    }

}

