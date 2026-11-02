
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

import { Balance, Options, Order, Transaction,
         CryptoCurrencies, CryptoEstimate, CryptoPayment,
         CryptoPaymentStatus
       } from './commerce.model';

@Injectable({
    providedIn: 'root'
})
export class CommerceService {
    private api = inject(ApiService);


    get_transactions() : Observable<Transaction[]> {

	const url = "/api/commerce/transactions";

	return this.api.get<Transaction[]>(url);

    }

    get_transaction(id : string) : Observable<Transaction> {

	const url = "/api/commerce/transaction/" + id;

	return this.api.get<Transaction>(url);

    }

    get_offer() : Observable<Options> {

	const url = "/api/commerce/offer";

	return this.api.get<Options>(url);

    }

    balance() : Observable<Balance> {

    	const url = "/api/commerce/balance";

	return this.api.get<Balance>(url);

    }

    create_order(order : Order) : Observable<string> {

	const url = "/api/commerce/create-order";

	return this.api.post<string>(url, order);

    }

    complete_order(id : string) : Observable<string> {

	const url = "/api/commerce/complete-order/" + id;

	return new Observable<string>(obs => {

	    this.api.post<string>(url, {}).subscribe(b => {
		obs.next(b);
	    });

	});

    }

    complete_free_order(order : Order) : Observable<string> {

	const url = "/api/commerce/complete-free-order";

	return new Observable<string>(obs => {

	    this.api.post<string>(url, order).subscribe(b => {
		obs.next(b);
	    });

	});

    }

    create_payment(id : string) : Observable<string> {
	const url = "/api/commerce/create-payment/" + id;

	return this.api.post<string>(url, {});

    }

    get_currencies() : Observable<CryptoCurrencies> {

	const url = "/api/crypto/currencies";

	return this.api.get<CryptoCurrencies>(url);

    }

    get_crypto_estimate(order : Order, cur : string) : Observable<CryptoEstimate> {

	const url = "/api/crypto/estimate";

	return this.api.post<CryptoEstimate>(
	    url,
	    {
		order: order,
		currency : cur,
	    }
	);

    }

    get_crypto_minimum(cur : string) : Observable<number> {

	const url = "/api/crypto/minimum";

	return this.api.post<number>(
	    url,
	    {
		currency : cur,
	    }
	);

    }

    create_crypto_payment(order : Order, cur : string) : Observable<CryptoPayment> {

	const url = "/api/crypto/payment";

	return this.api.post<CryptoPayment>(
	    url,
	    {
		order: order,
		currency : cur,
	    }
	);

    }

    get_crypto_payment_status(id : string) : Observable<CryptoPaymentStatus> {

	const url = "/api/crypto/payment/" + id;

	return this.api.get<CryptoPaymentStatus>(url);

    }

}

