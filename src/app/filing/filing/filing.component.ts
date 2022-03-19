import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilingConfigService, FilingItem }
    from '../../shared/filing-config.service';
import { get_kind_label } from '../../kinds';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { CompanyService, Companies } from '../../company/company.service';
import { UserProfileService, UserProfile } from '../../user-profile.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import { WorkingService } from '../../working.service';

@Component({
    selector: 'filing',
    templateUrl: './filing.component.html',
    styleUrls: ['./filing.component.scss']
})
export class FilingComponent implements OnInit {

    filingConfigs : FilingItem[] = [];
    companies : Companies = {};

    draft : FilingItem[] = [];
    pending : FilingItem[] = [];
    errored : FilingItem[] = [];
    published : FilingItem[] = [];

    features : Set<string> = new Set<string>();

    constructor(
	private router : Router,
	private filingConfigService : FilingConfigService,
	private companyService : CompanyService,
	private profile : UserProfileService,
	private dialog : MatDialog,
	private working : WorkingService,
    ) { }

    empty = true;

    is_empty(thing : any) : boolean {
	if (thing === undefined) return true;
	if (thing === null) return true;
	let val = (Object.keys(thing).length > 0);
	return !val;
    }

    ngOnInit(): void {
	this.companyService.get_list().subscribe(
	    e => {
		this.companies = e;
		this.empty = this.is_empty(e);
	    }
	);
	this.profile.onload().subscribe(
	    profile => this.features = profile.features
	);
	this.reload();
    }

    reload() {
	this.working.start();
	this.filingConfigService.list().subscribe(
	    e => {
		this.filingConfigs = e; this.load();
		this.working.stop();
	    }
	);
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
	this.filingConfigService.move_draft(
	    config.id
	).subscribe(() => {
	    this.reload();
	});
    }

    view(config : any) {
	this.router.navigate(["/" + config.kind + "/" + config.id + "/report"]);
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
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.proceed) {
		    this.filingConfigService.delete(
			result.config.id
		    ).subscribe(() => {
			this.reload();
		    });
		}
	    }
	});
    }

}

