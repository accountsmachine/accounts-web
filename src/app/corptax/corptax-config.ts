
export type CorptaxConfig = {

    kind? : string;
    state? : string;
    label? : string;
    company? : string;

    structure? : any;

    period_start_date? : string;
    period_end_date? : string;
    period_name? : string;
    fy1? : {
	name? : string;
	start? : string;
	end? : string;
    },
    fy2? : {
	name? : string;
	start? : string;
	end? : string;
    },
    report_date? : string;
    
};
