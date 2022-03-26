
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

export type Transaction = {
    id : string,
    transaction : string,
    uid : string,
    email : string,
    time : string,
    name : string,
    address : string[],
    postcode : string,
    country : string,
    billing_country : string,
    valid : boolean,
    vat_rate : number,
    vat_number : string,
    order : Order,
};
