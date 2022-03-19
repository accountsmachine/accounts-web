import { Injectable } from '@angular/core';
import {
    HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { RawConfig, Metadata } from "./metadata";
import { AuthToken, AuthService } from '../auth.service';

@Injectable({
    providedIn: 'root'
})
export class MetadataService {

    url = "/api/metadata";

    load() {
	
	this.http.get<RawConfig>(this.url).subscribe(
	    (data: RawConfig) => {
		let metadata = new Metadata();
		metadata.activities = <string>data["activities"];
		metadata.company_name = <string>data["company_name"];
		metadata.company_number = <string>data["company_number"];
		metadata.registration_date = <string>data["registration_date"]
		metadata.country = <string>data["country"];
		metadata.form = <string>data["form"];
		metadata.vat_registration = <string>data["vat_registration"];
		metadata.directors = <string[]>(data["directors"]);
		metadata.sector = <string>data["sector"];
		metadata.is_dormant = <boolean>data["is_dormant"];
		metadata.sic_codes = <string[]>(data["sic_codes"]);
		metadata.jurisdiction = <string>data["jurisdiction"];
		metadata.contact_name = <string>data["contact_name"];
		metadata.contact_address = <string[]>data["contact_address"];
		metadata.contact_city = <string>data["contact_city"];
		metadata.contact_postcode = <string>data["contact_postcode"];
		metadata.contact_county = <string>data["contact_county"];
		metadata.contact_country = <string>data["contact_country"];
		metadata.contact_email = <string>data["contact_email"];
		metadata.contact_tel_country = <string>data["contact_tel_country"];
		metadata.contact_tel_area = <string>data["contact_tel_area"];
		metadata.contact_tel_number = <string>data["contact_tel_number"];
		metadata.contact_tel_type = <string>data["contact_tel_type"];
		metadata.web_description = <string>data["web_description"];
		metadata.web_url = <string>data["web_url"];
		metadata.vrn = <string>data["vrn"];
		metadata.utr = <string>data["utr"];
		this._metadata = metadata;
		this.subject.next(this.metadata);
	    }
	)
    }

    constructor(
	private http : HttpClient,
	private auth : AuthService,
    ) {

	this._metadata = new Metadata();
	this.subject = new Subject<Metadata>();

	// FIXME: Lifecycle is weird.
	this.auth.subscribe(
	    (t : AuthToken) => {
	        if (t)
		    this.load();
	    }
	);
	
    }

    private _metadata: Metadata | null = null

    get metadata() { return this._metadata!; }

    private subject : Subject<Metadata>;

    subscribe(f: any) {
	this.subject.subscribe(f);
	f(this.metadata);
    }

    save() {

	let metadata = {
	    "activities": this.metadata.activities,
	    "company_name": this.metadata.company_name,
	    "company_number": this.metadata.company_number,
	    "entity_scheme": "http://www.companieshouse.gov.uk/",
	    "country": this.metadata.country,
	    "registration_date": this.metadata.registration_date,
	    "form": this.metadata.form,
	    "vat_registration": this.metadata.vat_registration,
	    "contact_name": this.metadata.contact_name,
	    "contact_address": this.metadata.contact_address,
	    "contact_county": this.metadata.contact_county,
	    "contact_city": this.metadata.contact_city,
	    "contact_postcode": this.metadata.contact_postcode,
	    "contact_country": this.metadata.contact_country,
	    "contact_email": this.metadata.contact_email,
	    "contact_tel_country": this.metadata.contact_tel_country,
	    "contact_tel_area": this.metadata.contact_tel_area,
	    "contact_tel_number": this.metadata.contact_tel_number,
	    "contact_tel_type": this.metadata.contact_tel_type,
	    "directors": this.metadata.directors,
	    "sector": this.metadata.sector,
	    "is_dormant": this.metadata.is_dormant,
	    "sic_codes": this.metadata.sic_codes,
	    "web_description": this.metadata.web_description,
	    "web_url": this.metadata.web_url,
	    "jurisdiction": this.metadata.jurisdiction,
	    "utr": this.metadata.utr,
	    "vrn": this.metadata.vrn,
	};

	const httpOptions = {
	    headers: new HttpHeaders({
		'Content-Type': 'application/json'
	    })
	};

	return this.http.put(this.url, metadata, httpOptions).pipe(
	    retry(3),
	    catchError(this.handleError)
	);

    }

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

    update() {
	this.subject.next(this.metadata!);
    }

    get company_name() { return this.metadata.company_name; }
    set company_name(c) { this.metadata.company_name = c; this.update(); }
    get company_number() { return this.metadata.company_number; }
    set company_number(c) { this.metadata.company_number = c; this.update(); }
    get activities() { return this.metadata.activities; }
    set activities(c) { this.metadata.activities = c; this.update(); }
    get registration_date() { return this.metadata.registration_date; }
    set registration_date(c) { this.metadata.registration_date = c; this.update(); }
    get country() { return this.metadata.country; }
    set country(c) { this.metadata.country = c; this.update(); }
    get form() { return this.metadata.form; }
    set form(c) { this.metadata.form = c; this.update(); }
    get directors() { return this.metadata.directors; }
    set directors(c) { this.metadata.directors = c; this.update(); }
    get sector() { return this.metadata.sector; }
    set sector(c) { this.metadata.sector = c; this.update(); }
    get is_dormant() { return this.metadata.is_dormant; }
    set is_dormant(c) { this.metadata.is_dormant = c; this.update(); }
    get sic_codes() { return this.metadata.sic_codes; }
    set sic_codes(c) { this.metadata.sic_codes = c; this.update(); }
    get jurisdiction() { return this.metadata.jurisdiction; }
    set jurisdiction(c) { this.metadata.jurisdiction = c; this.update(); }
    get contact_name() { return this.metadata.contact_name; }
    set contact_name(c) { this.metadata.contact_name = c; this.update(); }
    get contact_address() { return this.metadata.contact_address; }
    set contact_address(c) { this.metadata.contact_address = c; this.update(); }
    get contact_city() { return this.metadata.contact_city; }
    set contact_city(c) { this.metadata.contact_city = c; this.update(); }
    get contact_county() { return this.metadata.contact_county; }
    set contact_county(c) { this.metadata.contact_county = c; this.update(); }
    get contact_country() { return this.metadata.contact_country; }
    set contact_country(c) { this.metadata.contact_country = c; this.update(); }
    get contact_postcode() { return this.metadata.contact_postcode; }
    set contact_postcode(c) { this.metadata.contact_postcode = c; this.update(); }
    get contact_email() { return this.metadata.contact_email; }
    set contact_email(c) { this.metadata.contact_email = c; this.update(); }
    get contact_tel_country() { return this.metadata.contact_tel_country; }
    set contact_tel_country(c) { this.metadata.contact_tel_country = c; this.update(); }
    get contact_tel_area() { return this.metadata.contact_tel_area; }
    set contact_tel_area(c) { this.metadata.contact_tel_area = c; this.update(); }
    get contact_tel_number() { return this.metadata.contact_tel_number; }
    set contact_tel_number(c) { this.metadata.contact_tel_number = c; this.update(); }
    get contact_tel_type() { return this.metadata.contact_tel_type; }
    set contact_tel_type(c) { this.metadata.contact_tel_type = c; this.update(); }
    get web_description() { return this.metadata.web_description; }
    set web_description(c) { this.metadata.web_description = c; this.update(); }
    get web_url() { return this.metadata.web_url; }
    set web_url(c) { this.metadata.web_url = c; this.update(); }
    get vat_registration() { return this.metadata.vat_registration; }
    set vat_registration(c) { this.metadata.vat_registration = c; this.update(); }
    get vrn() { return this.metadata.vrn; }
    set vrn(c) { this.metadata.vrn = c; this.update(); }
    get utr() { return this.metadata.utr; }
    set utr(c) { this.metadata.utr = c; this.update(); }

}

