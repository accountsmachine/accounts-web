
export interface Balance {
    vat : number,
    corptax : number,
    accounts : number,
}

export interface Option {
    description : string,
    adjustment? : string,
    permitted : number,
    min_purchase : number,
    offer : {
	quantity : number,
	price : number,
	discount : number
    }[],
}

export interface Options {
    offer : Record<string, Option>,
    vat_rate? : number,
}

export type ItemQuantities = Record<string, number>;

export interface ItemLine {
    kind : string,
    description : string,
    adjustment? : string,
    quantity : number,
    amount : number,
    discount : number,
}

export class Order {
    items : ItemLine[] = [];
    subtotal  = 0;
    vat_rate  = 0;
    vat  = 0;
    total  = 0;
};

export interface CryptoEstimate {
    estimated_amount: number;
}

export interface CryptoPayment {
    pay_address: string;
    pay_amount: number;
    actually_paid: number;
    payment_id: string;
    pay_currency: string;
    order_id: string;
    payment_status: string;
}

export interface CryptoPaymentStatus {
    payment_status: string;
    actually_paid: number;
}

export interface CryptoCurrencies {
    currencies: string[];
}

export class Transaction {
    id  = "";
    type  = "";
    description? : string;
    uid  = "";
    email  = "";
    tel? : string;
    time  = "";
    name? : string;
    address? : string[];
    city? : string;
    county? : string;
    country? : string;
    postcode? : string;
    valid  = false;
    vat_rate? : number;
    vat_number? : string;
    order? : Order;
    company? : string;
    filing? : string;
    status? : string;
    seller_name? : string;
    seller_vat_number? : string;

    // Mostly for crypto.
    payment  = "";
    payment_processor? : string = "";
    payment_currency? : string;
    payment_amount? : number;
    payment_id? : string;
    payment_status? : string;

};
