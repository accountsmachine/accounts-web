import { Component, OnInit } from '@angular/core';

import { Option, Options, Balance, Order } from '../commerce.model';
import { CheckoutService } from '../checkout.service';

@Component({
    selector: 'order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

    order : Order = new Order();

    value : { [kind : string] : number } = {};
    descriptions : { [kind : string] : string } = {};

    constructor(
	private service : CheckoutService,
    ) {
	this.service.onorder().subscribe(o => {

	    this.order = o;

	    this.value = {};
	    this.descriptions = {};

	    for (let item of this.order.items) {
		this.value[item.kind] = item.amount;
	    }
	    
	});

    }

    ngOnInit(): void {
    }

    vat_rate() {
	return Math.round(100 * this.order.vat_rate);
    }

}
