
export type AccountsConfig = {

    kind? : string;
    state? : string;
    label? : string;
    company? : string;

    structure? : any;

    period_name? : string;
    period_start_date? : string;
    period_end_date? : string;

    prev_name? : string;
    prev_start_date? : string;
    prev_end_date? : string;

    report_date? : string;
    authorisation_date? : string;
    balance_sheet_date? : string;

    director_authorising? : string;
    director_authorising_ord? : number;

    period_average_employees? : number;
    prev_average_employees? : number;

};

