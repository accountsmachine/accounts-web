import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { VatConfig } from './vat-config';
import { VatService, Obligation } from './vat.service';
import { FilingConfigService } from '../filing/filing-config.service';

export type VatConfigEvent = {
    id : string,
    config : VatConfig,
};

@Injectable({
    providedIn: 'root'
})
export class VatConfigService {

    obligations : Obligation[] = [];

    constructor(
	private filingConfigService : FilingConfigService,
	private vat : VatService,
    ) {
    }

    onload() : Observable<VatConfigEvent> {
	return this.filingConfigService.onload();
    }

    onsave() { return this.filingConfigService.onsave(); }
    onchange() { return this.filingConfigService.onchange(); }
    onunload() { return this.filingConfigService.onunload(); }

    load(id : string) {
        return this.filingConfigService.load(id).pipe(
	    tap((cfg : any) => {
		if (cfg.config["company"]) {
		    this.vat.getOpenObligations(
			cfg.config["company"]
		    ).subscribe(e => {
			this.obligations = e;
		    });
		}
		return cfg;
	    })
	);
    }

    save() { return this.filingConfigService.save(); }
    unload() { this.filingConfigService.unload(); }
    submit(id : string) { return this.vat.submit(id); }

    create(label : string) : Observable<string> {

	let config = {
	    "kind": "vat",
	    state: "draft",
	    "label": label,
	    "structure": {
		"element": "vat",
		"elements": [
		    {
			"element": "composite",
			"id": "report",
			"elements": [
			    {
				"element": "vat-report"
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

    updobl() {

	for(var ob of this.obligations) {
	    if (ob.periodKey == this.config.period_key) {
		console.log("BUNCH");
		this.config.start = ob.start;
		this.config.end = ob.end;
		this.config.due = ob.due;
	    }
	}

	console.log(this.config);
	
    }

    change() { this.filingConfigService.change(); }

    get config() { return this.filingConfigService.config; }

    get periodKey() { return this.config.periodKey; }
    set periodKey(v) { this.config.periodKey = v; this.updobl(); this.change(); }
    get start() { return this.config.start; }
    set start(v) { this.config.start = v; this.change(); }
    get end() { return this.config.end; }
    set end(v) { this.config.end = v; this.change(); }
    get due() { return this.config.due; }
    set due(v) { this.config.due = v; this.change(); }
    get company() { return this.config.company; }
    set company(v) { this.config.company = v; this.change(); }
    get state() { return this.config.start; }
    set state(v) { this.config.state = v; this.change(); }

}

