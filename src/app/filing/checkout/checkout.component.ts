import { Component, OnInit, EventEmitter } from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CheckoutService } from '../checkout.service';
import { Company } from '../../company/company.service';
import { CommerceService, Option, Options, Balance } from '../commerce.service';

@Component({
    selector: 'checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    public form : FormGroup;

    options : Options = {};
    balance : Balance = { uid: "", email: "", credits: {
	vat: 0, accounts: 0, corptax: 0
    }};

    vat_price : number = 0;
    corptax_price : number = 0;
    accounts_price : number = 0;
    subtotal_price : number = 0;
    tax_price : number = 0;
    total_price : number = 0;

    constructor(
	private service : CheckoutService,
	private commerceService : CommerceService,
	private formBuilder: FormBuilder,
    ) {
	this.form = this.formBuilder.group({
	    vat: [0],
	    corptax: [0],
	    accounts: [0],
	});
    }

    ngOnInit(): void {

	this.commerceService.get_options().subscribe(o => {
	    this.options = o;
	});
	this.commerceService.get_balance().subscribe(b => {
	    this.balance = b;
	});

    }

    doit() {
	console.log(this.form.value.vat,
		    this.form.value.corptax,
		    this.form.value.accounts);
    }

    recalc() {
	this.vat_price = this.corptax_price = this.accounts_price = 0;
	if (this.options.vat)
	    for (let item of this.options.vat.offer) {
		if (this.form.value.vat == item.credits)
		    this.vat_price = item.price;
	    }
	if (this.options.corptax)
	    for (let item of this.options.corptax.offer) {
		if (this.form.value.corptax == item.credits)
		    this.corptax_price = item.price;
	    }
	if (this.options.accounts)
	    for (let item of this.options.accounts.offer) {
		if (this.form.value.accounts == item.credits)
		    this.accounts_price = item.price;
	    }
	this.subtotal_price =
	    this.vat_price + this.corptax_price + this.accounts_price;
	this.tax_price = 0.2 * Math.floor(this.subtotal_price);
	this.total_price = this.subtotal_price + this.tax_price;
    }

    checkout() {
    }

}

