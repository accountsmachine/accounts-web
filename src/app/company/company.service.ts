
// FIXME: Should cache information.

import { Injectable } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, Subject, throwError, map } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { WorkingService } from '../working.service';

export class Company {

    company_name : string = "";
    company_number : string = "";
    activities : string = "";
    registration_date : string = "";
    country : string = "";
    form : string = "";
    directors : string[] = [];
    sector : string = "";
    is_dormant : boolean = false;
    sic_codes : string[] = [];
    jurisdiction : string = "";

    contact_name : string = "";
    contact_address : string[] = [];
    contact_city : string = "";
    contact_county: string = "";
    contact_country : string = "";
    contact_postcode : string = "";
    contact_email : string = "";
    contact_tel_country : string = "";
    contact_tel_area : string = "";
    contact_tel_number : string = "";
    contact_tel_type : string = "";
    web_description : string = "";
    web_url : string = "";

    vat_registration : string = "";
    vrn : string = "";
    utr : string = "";

};

export type Companies = {
    [key: string]: Company,
};

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    id : string | null = "";
    config : Company | null = null;

    reset() {
	this.config = null;
	this.id = "";
	this.subject.next(this.config);
    }

    get_list() : Observable<Companies> {

	let url = "/api/companies";

	return new Observable<Companies>(obs => {
	    
	    this.http.get<Companies>(url).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(res => {
		obs.next(res);
	    });

	});
					   
    }

    subject : Subject<Company | null> = new Subject<Company | null>();

    chgobs : Subject<boolean> = new Subject<boolean>();

    subscribe(f : any) {
	this.subject.subscribe(f)
	if (this.config)
	    f(this.config);
    }

    constructor(
	private http : HttpClient,
	private working : WorkingService,
    ) {

	// All changes are announced on this subject.  Could be a lot of
	// publications in a short space, so debounce to 1 notification
	// every 100 ms.
	this.chgobs.pipe(debounceTime(100)).subscribe(
	    e => {
		this.subject.next(this.config)
	    }
	);

    }

    load(id : string) {

	if (id == this.id) return;

	let svc = this;

	this.working.start();

	this.http.get<Company>("/api/company/" + id).subscribe({
	    next(config) {
		svc.working.stop();		
		svc.config = config;
		svc.id = id;
		svc.subject.next(config);
	    },
	    error(err) {
		svc.working.stop();		
		svc.config = null;
		svc.id = "";
		svc.subject.next(null);
	    },
	    complete() {
		svc.working.stop();		
	    }
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

	this.working.start();

	return this.http.put(
	    "/api/company/" + this.id, this.config,
	    httpOptions
	).pipe(
	    retry(3),
	    catchError(this.handleError),
	    tap(() => this.working.stop())
	);

    }

    create(crn : string) : Observable<string> {

	return new Observable<string>(subs => {

	    let c = new Company();
	    c.company_number = crn;

	    const httpOptions = {
		headers: new HttpHeaders({
		    'Content-Type': 'application/json'
		})
	    };

	    return this.http.put("/api/company/" + crn, c,
				 httpOptions).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(
		(e : any) => { subs.next(crn); }
	    );
	});

    }

    create_from_lookup(rec : any) : Observable<string> {

	return new Observable<string>(subs => {

	    let c = new Company();

	    // FIXME: Defensive coding, more checking.
	    
	    c.company_number = rec.company.company_number;
	    c.registration_date = rec.company.date_of_creation;
	    c.company_name = rec.company.company_name;
	    c.contact_name = rec.company.company_name;
	    c.contact_address = []
	    if ("address_line_1" in rec.company.registered_office_address) {
		c.contact_address.push(
		    rec.company.registered_office_address.address_line_1
		);
	    }
	    if ("address_line_2" in rec.company.registered_office_address) {
		c.contact_address.push(
		    rec.company.registered_office_address.address_line_2
		);
	    }
	    if ("address_line_3" in rec.company.registered_office_address) {
		c.contact_address.push(
		    rec.company.registered_office_address.address_line_3
		);
	    }

	    c.contact_city = rec.company.registered_office_address.locality;
	    c.contact_postcode =
		rec.company.registered_office_address.postal_code;

	    try {
		let form = {
		    "ltd": "private-limited-company"
		}[String(rec.company.type)];
		if (form) c.form = form;
	    } catch(e) {}

	    try {
		let country = {
		    "england-wales": "england-and-wales",
		    "scotland": "scotland",
		    "northern-ireland": "northern-ireland",
		}[String(rec.company.jurisdiction)];
		if (country) c.country = country;
	    } catch(e) {}

	    try {
		let juris = {
		    "england-wales": "England and Wales",
		    "scotland": "Scotland",
		    "northern-ireland": "Northern Ireland",
		}[String(rec.company.jurisdiction)];
		if (juris) c.jurisdiction = juris;
	    } catch(e) {}

	    c.sic_codes = rec.company.sic_codes;
	    c.is_dormant = rec.company.company_status != "active";

	    c.web_description = "Corporate website";

	    c.directors = rec.officers.items.map((f : any) => f.name);

	    const httpOptions = {
		headers: new HttpHeaders({
		    'Content-Type': 'application/json'
		})
	    };

	    return this.http.put("/api/company/" + c.company_number, c,
				 httpOptions).pipe(
		retry(3),
		catchError(this.handleError)
	    ).subscribe(
		(e : any) => {
		    subs.next(c.company_number);
		}
	    );
	});

    }

    delete(cid : string) {
	return this.http.delete("/api/company/" + cid).pipe(
	    retry(3),
	    catchError(this.handleError)
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

    private handleError(error: HttpErrorResponse) {
	console.log(error);
	if (error.status === 0) {
	    // A client-side or network error
	    console.error('An error occurred:', error.error);
	} else {
	    // The backend returned an unsuccessful response code.
	    console.error(
		`Backend returned code ${error.status}, body was: `,
		error.error);
	}

	// Return an observable with a user-facing error message.
	return throwError(() =>
	    new Error('Something bad happened; please try again later.'));
    }

}

