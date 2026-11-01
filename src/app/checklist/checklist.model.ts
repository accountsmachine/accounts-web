
export class Check {
    constructor(
	public id : string,
	public kind : string,
	public description? : string,
	public href? : string,
    ) {
    }
};

export class Checklist {
    pending  = false;
    complete  = false;
    list : Check[] = [];
};
