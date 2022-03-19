import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AccountsConfig } from './accounts-config';
import { FilingConfigService } from '../shared/filing-config.service';

export type AccountsConfigEvent = {
    id : string,
    config : AccountsConfig,
};

@Injectable({
    providedIn: 'root'
})
export class AccountsConfigService {

    constructor(
	private filingConfigService : FilingConfigService,
    ) {
    }

    onload() : Observable<AccountsConfigEvent> {
	return this.filingConfigService.onload();
    }

    onsave() { return this.filingConfigService.onsave(); }
    onchange() { return this.filingConfigService.onchange(); }
    onunload() { return this.filingConfigService.onunload(); }

    load(id : string) { return this.filingConfigService.load(id); }
    save() { return this.filingConfigService.save(); }
    unload() { this.filingConfigService.unload(); }
    submit(id : string) { return this.filingConfigService.submit(id, "accounts"); }

    create(label : string) : Observable<string> {

	let config = {
	    kind: "accounts",
	    state: "draft",
	    label: label,
	    structure: {
		"element": "frs102",
		"accounting_standards": "micro-entities",
		"accounts_status": "audit-exempt-no-accountants-report",
		"accounts_type": "abridged-accounts",
		"title": "Unaudited Micro-entity Accounts",
		elements: [
		    {
			element: "composite",
			id: "report",
			elements: [
			    {
				element: "title-page",
				logo: "logo"
			    },
			    {
				element: "company-info"
			    },	    
			    {	    
				element: "balance-sheet-unaudited-micro",
				signature: "signature"
			    },
			    {
				element: "simple-notes"
			    }
			]
		    }
		]
	    },
	};

	return this.filingConfigService.create(config);

    }

    get_status(id : string) : Observable<string> {
	return this.filingConfigService.get_status(id);
    }

    get_report(id : string) : Observable<any> {
	return this.filingConfigService.get_report(id);
    }

    get_data(id : string) : Observable<any> {
	return this.filingConfigService.get_data(id);
    }

    change() { this.filingConfigService.change(); }

    get config() { return this.filingConfigService.config; }

    get period_start_date() { return this.config.period_start_date; }
    set period_start_date(v) { this.config.period_start_date = v; this.change(); }
    get period_end_date() { return this.config.period_end_date; }
    set period_end_date(v) { this.config.period_end_date = v; this.change(); }
    get prev_start_date() { return this.config.prev_start_date; }
    set prev_start_date(v) { this.config.prev_start_date = v; this.change(); }
    get prev_end_date() { return this.config.prev_end_date; }
    set prev_end_date(v) { this.config.prev_end_date = v; this.change(); }
    get period_name() { return this.config.period_name; }
    set period_name(v) { this.config.period_name = v; this.change(); }
    get prev_name() { return this.config.prev_name; }
    set prev_name(v) { this.config.prev_name = v; this.change(); }
    get report_date() { return this.config.report_date; }
    set report_date(v) { this.config.report_date = v; this.change(); }
    get authorisation_date() { return this.config.authorisation_date; }
    set authorisation_date(v) { this.config.authorisation_date = v; this.change(); }
    get balance_sheet_date() { return this.config.balance_sheet_date; }
    set balance_sheet_date(v) { this.config.balance_sheet_date = v; this.change(); }
    get director_authorising() { return this.config.director_authorising; }
    set director_authorising(v) { this.config.director_authorising = v; this.change(); }
    get director_authorising_ord() { return this.config.director_authorising_ord; }
    set director_authorising_ord(v) { this.config.director_authorising_ord = v; this.change(); }
    get period_average_employees() { return this.config.period_average_employees; }
    set period_average_employees(v) { this.config.period_average_employees = v; this.change(); }
    get prev_average_employees() { return this.config.prev_average_employees; }
    set prev_average_employees(v) { this.config.prev_average_employees = v; this.change(); }
    get label() { return this.config.label; }
    set label(v) { this.config.label = v; this.change(); }
    get structure() { return this.config.structure; }
    set structure(v) { this.config.structure = v; this.change(); }
    get company() { return this.config.company; }
    set company(v) { this.config.company = v; this.change(); }
    get state() { return this.config.start; }
    set state(v) { this.config.state = v; this.change(); }

}

