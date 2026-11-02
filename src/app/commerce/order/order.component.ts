import { Component, inject } from '@angular/core';

import { Order } from '../commerce.model';
import { CheckoutService } from '../checkout.service';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    imports: [CurrencyPipe]
})
export class OrderComponent {
    private service = inject(CheckoutService);


    order : Order = new Order();

    value : Record<string, number> = {};
    descriptions : Record<string, string> = {};

    constructor() {
	this.service.onorder().subscribe(o => {

	    this.order = o;

	    this.value = {};
	    this.descriptions = {};

	    for (const item of this.order.items) {
		this.value[item.kind] = item.amount;
	    }
	    
	});

    }

    vat_rate() {
	return Math.round(100 * this.order.vat_rate);
    }

}
