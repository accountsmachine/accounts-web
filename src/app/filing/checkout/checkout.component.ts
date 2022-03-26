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

    offer : Options = {};
    balance : Balance = { uid: "", email: "", credits: {
	vat: 0, accounts: 0, corptax: 0
    }};

    tax_applied : string = "";
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

	this.commerceService.get_offer().subscribe(o => {
	    this.offer = o;
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
	if (this.offer.vat)
	    for (let item of this.offer.vat.offer) {
		if (this.form.value.vat == item.credits)
		    this.vat_price = item.price;
	    }
	if (this.offer.corptax)
	    for (let item of this.offer.corptax.offer) {
		if (this.form.value.corptax == item.credits)
		    this.corptax_price = item.price;
	    }
	if (this.offer.accounts)
	    for (let item of this.offer.accounts.offer) {
		if (this.form.value.accounts == item.credits)
		    this.accounts_price = item.price;
	    }

	let tax_rate = this.offer.vat_tax_rate!;

	this.tax_applied = "VAT @ " + Math.round(tax_rate * 100) + "%";
	
	this.subtotal_price =
	    this.vat_price + this.corptax_price + this.accounts_price;

	this.tax_price = tax_rate * Math.floor(this.subtotal_price);

	this.total_price = this.subtotal_price + this.tax_price;
    }

    checkout() {
    }

}

