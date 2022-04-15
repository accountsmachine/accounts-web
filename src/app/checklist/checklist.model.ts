
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
    pending : boolean = false;
    complete : boolean = false;
    list : Check[] = [];
};
