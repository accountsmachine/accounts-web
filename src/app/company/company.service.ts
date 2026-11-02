
// FIXME: Should cache information.

import { Injectable, inject } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import {v4 as uuidv4} from 'uuid';

import { ApiService } from '../api.service';

export interface CompanyLookupRecord {
    company: {
	company_number: string;
	date_of_creation: string;
	company_name: string;
	registered_office_address: Record<string, string>;
	type: string;
	jurisdiction: string;
	sic_codes: string[];
	company_status: string;
    };
    officers: {
	items: { name: string }[];
    };
}

export class Company {

    type  = "";
    company_name  = "";
    company_number  = "";
    owner  = "";
    city  = "";

    activities  = "";
    registration_date  = "";
    country  = "";
    form  = "";
    directors : string[] = [];
    sector  = "";
    is_dormant  = false;
    sic_codes : string[] = [];
    jurisdiction  = "";

    contact_name  = "";
    contact_address : string[] = [];
    contact_city  = "";
    contact_county = "";
    contact_country  = "";
    contact_postcode  = "";
    contact_email  = "";
    contact_tel_country  = "";
    contact_tel_area  = "";
    contact_tel_number  = "";
    contact_tel_type  = "";
    web_description  = "";
    web_url  = "";

    vat_registration  = "";
    vrn  = "";
    utr  = "";

};

export type Companies = Record<string, Company>;

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private api = inject(ApiService);


    id : string | null = "";
    config : Company | null = null;

    unload() {
	this.config = null;
	this.id = "";
	this.subject.next(this.config);
    }

    get_list() : Observable<Companies> {
	const url = "/api/companies";

	return this.api.get<Companies>(url).pipe(
	    tap({
		error: (_err) => {
		},
		complete: () => {
		}
	    })
	);
    }

    subject : BehaviorSubject<Company | null> =
	new BehaviorSubject<Company | null>(null);

    chgobs : Subject<boolean> = new Subject<boolean>();

    onload() : Observable<Company | null> {
	return new Observable<Company | null>(obs => {
	    this.subject.subscribe(c => {
		if (c) obs.next(c);
	    });
	});
    }

    constructor() {

	// All changes are announced on this subject.  Could be a lot of
	// publications in a short space, so debounce to 1 notification
	// every 100 ms.
	this.chgobs.pipe(debounceTime(100)).subscribe(
	    () => {
		this.subject.next(this.config)
	    }
	);

    }

    load(id : string) {

	if (id == this.id) return of(this.config);

	return new Observable<Company>(obs => {

	    this.api.get<Company>(
		"/api/company/" + id
	    ).pipe(
		tap({
		    error: (_err) => {
		    },
		    complete: () => {
		    }
		})
	    ).subscribe({
		next: (config : Company) => {
		    this.config = config;
		    this.id = id;
		    this.subject.next(config);
		    obs.next(config);
		},
		error: (_err) => {
		    this.config = null;
		    this.id = "";
		    obs.error(_err);
		    //		if (err && err.status && err.status == 404) {
		    //		    svc.subject.next(new Company());
		    //		}
		    this.subject.next(null);
		},
		complete: () => { }
	    });

	});

    }

    // Must subscribe.
    save() {

	// FIXME: NULL
	if (this.id == "") throw "Save not possible, no company loaded";

	const httpOptions = {
	    headers: new HttpHeaders({
		'Content-Type': 'application/json'
	    })
	};

	return this.api.put(
	    "/api/company/" + this.id, this.config,
	    httpOptions
	).pipe(
	    tap({
		error: (_err) => {
		},
		complete: () => {
		}
	    })
	);

    }

    create(crn : string) : Observable<string> {

	return new Observable<string>(subs => {

	    const c = new Company();
	    c.company_number = crn;

	    const httpOptions = {
		headers: new HttpHeaders({
		    'Content-Type': 'application/json'
		})
	    };

	    return this.api.put(
		"/api/company/" + crn, c, httpOptions
	    ).pipe(
		tap({
		    error: (_err) => {
		    },
		    complete: () => {
		    }
		})
	    ).subscribe(() => {
		subs.next(crn);
	    });
	});

    }

    create_from_lookup(rec : CompanyLookupRecord) : Observable<string> {

	return new Observable<string>(subs => {

	    const c = new Company();

	    // FIXME: Defensive coding, more checking.

	    const id = uuidv4();

	    c.type = "uk-company";
	    c.company_number = rec.company.company_number;
	    c.registration_date = rec.company.date_of_creation;
	    c.company_name = rec.company.company_name;
	    c.contact_name = rec.company.company_name;
	    c.contact_address = []
	    if ("address_line_1" in rec.company.registered_office_address) {
		c.contact_address.push(
		    rec.company.registered_office_address["address_line_1"]
		);
	    }
	    if ("address_line_2" in rec.company.registered_office_address) {
		c.contact_address.push(
		    rec.company.registered_office_address["address_line_2"]
		);
	    }
	    if ("address_line_3" in rec.company.registered_office_address) {
		c.contact_address.push(
		    rec.company.registered_office_address["address_line_3"]
		);
	    }

	    c.contact_city = rec.company.registered_office_address["locality"];
	    c.contact_postcode =
		rec.company.registered_office_address["postal_code"];

	    // Maybe not true, but true for the bulk of cases.
	    c.contact_country = "UK";

	    try {
		const form = {
		    "ltd": "private-limited-company"
		}[String(rec.company.type)];
		if (form) c.form = form;
	    } catch {}

	    try {
		const country = {
		    "england-wales": "england-and-wales",
		    "scotland": "scotland",
		    "northern-ireland": "northern-ireland",
		}[String(rec.company.jurisdiction)];
		if (country) c.country = country;
	    } catch {}

	    try {
		const juris = {
		    "england-wales": "England and Wales",
		    "scotland": "Scotland",
		    "northern-ireland": "Northern Ireland",
		}[String(rec.company.jurisdiction)];
		if (juris) c.jurisdiction = juris;
	    } catch {}

	    c.sic_codes = rec.company.sic_codes;
	    c.is_dormant = rec.company.company_status != "active";

	    c.web_description = "Corporate website";

	    c.directors = rec.officers.items.map((f) => f.name);

	    const httpOptions = {
		headers: new HttpHeaders({
		    'Content-Type': 'application/json'
		})
	    };

	    return this.api.put(
		"/api/company/" + id, c, httpOptions
	    ).subscribe(
		() => {
		    subs.next(id);
		}
	    );
	});

    }

    create_sole_trader(
	name : string,
	trade_name : string,
	trade_location : string
    ) : Observable<string> {

	return new Observable<string>(subs => {

	    const c = new Company();

	    // FIXME: Defensive coding, more checking.

	    const id = uuidv4();

	    c.type = "sole-trader";
	    c.company_name = trade_name;
	    c.owner = name;
	    c.contact_name = name;
	    c.contact_city = trade_location;
	    c.contact_country = "UK";

	    const httpOptions = {
		headers: new HttpHeaders({
		    'Content-Type': 'application/json'
		})
	    };

	    return this.api.put(
		"/api/company/" + id, c, httpOptions
	    ).subscribe(
		() => {
		    subs.next(id);
		}
	    );
	});

    }

    create_non_uk_company(
	name : string,
	number : string,
	city : string,
	country : string
    ) : Observable<string> {

	return new Observable<string>(subs => {

	    const c = new Company();

	    // FIXME: Defensive coding, more checking.
	    const id = uuidv4();

	    c.type = "non-uk-company";
	    c.company_number = number;
	    c.company_name = name;
	    c.city = city;
	    c.contact_city = city;
	    c.country = country;
	    c.contact_country = country;

	    const httpOptions = {
		headers: new HttpHeaders({
		    'Content-Type': 'application/json'
		})
	    };

	    return this.api.put(
		"/api/company/" + id, c, httpOptions
	    ).subscribe(
		() => {
		    subs.next(id);
		}
	    );
	});

    }

    delete(cid : string) {
	return this.api.delete("/api/company/" + cid).pipe(
	    tap(() => {
		// Company is deleted, 'unload' the current company.
		this.unload();
	    })
	);
    }

    change() {
	this.subject.next(this.config!);
    }

    get company_name() { return this.config!.company_name; }
    set company_name(c) { this.config!.company_name = c; this.change(); }
    get company_number() { return this.config!.company_number; }
    set company_number(c) { this.config!.company_number = c; this.change(); }
    get activities() { return this.config!.activities; }
    set activities(c) { this.config!.activities = c; this.change(); }
    get registration_date() { return this.config!.registration_date; }
    set registration_date(c) { this.config!.registration_date = c; this.change(); }
    get country() { return this.config!.country; }
    set country(c) { this.config!.country = c; this.change(); }
    get form() { return this.config!.form; }
    set form(c) { this.config!.form = c; this.change(); }
    get directors() { return this.config!.directors; }
    set directors(c) { this.config!.directors = c; this.change(); }
    get sector() { return this.config!.sector; }
    set sector(c) { this.config!.sector = c; this.change(); }
    get is_dormant() { return this.config!.is_dormant; }
    set is_dormant(c) { this.config!.is_dormant = c; this.change(); }
    get sic_codes() { return this.config!.sic_codes; }
    set sic_codes(c) { this.config!.sic_codes = c; this.change(); }
    get jurisdiction() { return this.config!.jurisdiction; }
    set jurisdiction(c) { this.config!.jurisdiction = c; this.change(); }
    get contact_name() { return this.config!.contact_name; }
    set contact_name(c) { this.config!.contact_name = c; this.change(); }
    get contact_address() { return this.config!.contact_address; }
    set contact_address(c) { this.config!.contact_address = c; this.change(); }
    get contact_city() { return this.config!.contact_city; }
    set contact_city(c) { this.config!.contact_city = c; this.change(); }
    get contact_county() { return this.config!.contact_county; }
    set contact_county(c) { this.config!.contact_county = c; this.change(); }
    get contact_country() { return this.config!.contact_country; }
    set contact_country(c) { this.config!.contact_country = c; this.change(); }
    get contact_postcode() { return this.config!.contact_postcode; }
    set contact_postcode(c) { this.config!.contact_postcode = c; this.change(); }
    get contact_email() { return this.config!.contact_email; }
    set contact_email(c) { this.config!.contact_email = c; this.change(); }
    get contact_tel_country() { return this.config!.contact_tel_country; }
    set contact_tel_country(c) { this.config!.contact_tel_country = c; this.change(); }
    get contact_tel_area() { return this.config!.contact_tel_area; }
    set contact_tel_area(c) { this.config!.contact_tel_area = c; this.change(); }
    get contact_tel_number() { return this.config!.contact_tel_number; }
    set contact_tel_number(c) { this.config!.contact_tel_number = c; this.change(); }
    get contact_tel_type() { return this.config!.contact_tel_type; }
    set contact_tel_type(c) { this.config!.contact_tel_type = c; this.change(); }
    get web_description() { return this.config!.web_description; }
    set web_description(c) { this.config!.web_description = c; this.change(); }
    get web_url() { return this.config!.web_url; }
    set web_url(c) { this.config!.web_url = c; this.change(); }
    get vat_registration() { return this.config!.vat_registration; }
    set vat_registration(c) { this.config!.vat_registration = c; this.change(); }
    get vrn() { return this.config!.vrn; }
    set vrn(c) { this.config!.vrn = c; this.change(); }
    get utr() { return this.config!.utr; }
    set utr(c) { this.config!.utr = c; this.change(); }

}

