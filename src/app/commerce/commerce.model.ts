
export type Balance = {
    uid : string,
    email : string,
    credits : {
	[kind : string] : number
    }
};

export type Option = {
    description : string,
    permitted : number,
    min_purchase : number,
    offer : { quantity : number, price : number, discount : number }[],
};

export type Options = {
    offer : { [kind : string]  : Option },
    vat_rate? : number,
};

export type ItemQuantities = {
    [kind : string] : number
};

export type ItemLine = {
    kind : string,
    description : string,
    quantity : number,
    amount : number,
    discount : number,
};

export class Order {
    items : ItemLine[] = [];
    subtotal : number = 0;
    vat_rate : number = 0;
    vat : number = 0;
    total : number = 0;
};

export class Transaction {
    id : string = "";
    type : string = "";
    uid : string = "";
    email : string = "";
    tel? : string;
    time : string = "";
    name? : string;
    address? : string[];
    city? : string;
    county? : string;
    country? : string;
    postcode? : string;
    valid : boolean = false;
    vat_rate? : number;
    vat? : string;
    order? : Order;
    company? : string;
    filing? : string;
    status? : string;
    seller_name? : string;
    seller_vat_number? : string;
};
