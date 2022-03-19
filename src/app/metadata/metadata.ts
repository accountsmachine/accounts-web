
export type BasicConfig = string | number | boolean;
export type RawConfigValue = RawConfig | BasicConfig | BasicConfig[];

export type RawConfig = {
    [key: string]: RawConfigValue,
};

export class Metadata {

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

