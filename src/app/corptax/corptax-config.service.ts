import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CorptaxConfig } from './corptax-config';
import { FilingConfigService } from '../filing/filing-config.service';

export interface CorptaxConfigEvent {
    id : string,
    config : CorptaxConfig,
}

@Injectable({
    providedIn: 'root'
})
export class CorptaxConfigService {
    private filingConfigService = inject(FilingConfigService);


    config : CorptaxConfig = {};

    onload() : Observable<CorptaxConfigEvent> {
	return this.filingConfigService.onload();
    }

    onsave() { return this.filingConfigService.onsave(); }
    onchange() { return this.filingConfigService.onchange(); }
    onunload() { return this.filingConfigService.onunload(); }

    load(id : string) { return this.filingConfigService.load(id); }
    save() { return this.filingConfigService.save(); }
    unload() { this.filingConfigService.unload(); }
    submit(id : string) { return this.filingConfigService.submit(id, "corptax"); }

    create(label : string) : Observable<string> {

	const config = {
	    kind: "corptax",
	    state: "draft",
	    label: label,
	    structure: {
		"element": "corptax",
		"title": "Corporation Tax Statement",
		"elements": [
		    {
			"element": "composite",
			"id": "report",
			"elements": [
			    {
				"element": "front-page"
			    },
			    {
				"element": "capital-allowances"
			    },
			    {
				"element": "profits"
			    },
			    {
				"element": "tax-chargeable"
			    },
			    {
				"element": "research-dev-enhanced-expenditure"
			    },
			    {
				"element": "research-dev"
			    },
			    {
				"element": "tax-calculation"
			    },
			    {
				"element": "detailed-profit-and-loss"
			    }
			]
		    }
		]
	    },
	};

	return this.filingConfigService.create(config);

    }

    get_status(id : string) : Observable<{ report: string }> {
	return this.filingConfigService.get_status(id) as Observable<{ report: string }>;
    }

    get_report(id : string) : Observable<unknown> {
	return this.filingConfigService.get_report(id);
    }

    get_data(id : string) : Observable<unknown> {
	return this.filingConfigService.get_data(id);
    }

    change() { this.filingConfigService.change(); }

    get period_name() { return this.config.period_name; }
    set period_name(v) { this.config.period_name = v; this.change(); }

    get period_start_date() { return this.config.period_start_date; }
    set period_start_date(v) { this.config.period_start_date = v; this.change(); }
    get period_end_date() { return this.config.period_end_date; }
    set period_end_date(v) { this.config.period_end_date = v; this.change(); }
    get report_date() { return this.config.report_date; }
    set report_date(v) { this.config.report_date = v; this.change(); }
    get fy1() { return this.config.fy1; }
    set fy1(v) { this.config.fy1 = v; this.change(); }
    get fy2() { return this.config.fy2; }
    set fy2(v) { this.config.fy2 = v; this.change(); }
    get company() { return this.config.company; }
    set company(v) { this.config.company = v; this.change(); }
    get state() { return this.config.state; }
    set state(v) { this.config.state = v; this.change(); }

}

