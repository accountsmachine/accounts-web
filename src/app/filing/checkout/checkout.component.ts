import { Component, OnInit, EventEmitter } from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

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

    tax_applied : string = "";
    tax_rate : number = 0;

    vat_price : number = 0;
    corptax_price : number = 0;
    accounts_price : number = 0;

    vat_discount : number = 0;
    corptax_discount : number = 0;
    accounts_discount : number = 0;

    subtotal_price : number = 0;
    tax_price : number = 0;
    total_price : number = 0;

    constructor(
	private service : CheckoutService,
	private commerceService : CommerceService,
	private formBuilder: FormBuilder,
	private snackBar: MatSnackBar,
    ) {
	this.form = this.formBuilder.group({
	    vat: [0],
	    corptax: [0],
	    accounts: [0],
	});
    }

    ngOnInit(): void {
	this.reload();
    }

    reload() {

	this.commerceService.get_offer().subscribe(o => {
	    this.offer = o;
	});

	this.reset();

    }

    doit() {
	console.log(this.form.value.vat,
		    this.form.value.corptax,
		    this.form.value.accounts);
    }

    recalc() {

	this.vat_price = this.corptax_price = this.accounts_price = 0;
	this.vat_discount = this.corptax_discount = this.accounts_discount = 0;

	if (this.offer.vat) {
	    for (let item of this.offer.vat.offer)
		if (this.form.value.vat == item.credits) {
		    this.vat_price = item.price;
		    this.vat_discount = item.discount;
		}
	    }

	if (this.offer.corptax)
	    for (let item of this.offer.corptax.offer) {
		if (this.form.value.corptax == item.credits) {
		    this.corptax_price = item.price;
		    this.corptax_discount = item.discount;
		}
	    }
	if (this.offer.accounts)
	    for (let item of this.offer.accounts.offer) {
		if (this.form.value.accounts == item.credits) {
		    this.accounts_price = item.price;
		    this.accounts_discount = item.discount;
		}
	    }

	this.tax_rate = this.offer.vat_tax_rate!;

	this.tax_applied = "VAT @ " + Math.round(this.tax_rate * 100) + "%";
	
	this.subtotal_price =
	    this.vat_price + this.corptax_price + this.accounts_price;

	this.tax_price = Math.round(this.tax_rate * this.subtotal_price);

	this.total_price = this.subtotal_price + this.tax_price;
    }

    place_order() {

	let items = [];

	if (this.form.value.vat) {
	    items.push({
		kind: "vat", quantity: this.form.value.vat,
		amount: this.vat_price })
	}

	if (this.form.value.corptax) {
	    items.push({
		kind: "corptax", quantity: this.form.value.corptax,
		amount: this.corptax_price })
	}

	if (this.form.value.accounts) {
	    items.push({
		kind: "accounts", quantity: this.form.value.accounts,
		amount: this.accounts_price })
	}

	let order = {
	    items: items,
	    subtotal: this.subtotal_price,
	    tax: this.tax_price,
	    total: this.total_price,
	    vat_rate: this.tax_rate,
	}

	this.commerceService.place_order(order).subscribe(
	    b => {
		console.log(b);
		this.reload();
		this.snackBar.open("Purchased complete", "dismiss",
				   { duration: 5000 });
	    }
	);

    }

    reset() {
	this.form.patchValue({
	    vat: 0, corptax: 0, accounts: 0
	});
	this.recalc();
    }

    order_disabled() {
	return (this.total_price < 1);
    }

    full_credits() {

	let unavail = [];

	if (!this.offer.vat) unavail.push("VAT");
	if (!this.offer.corptax) unavail.push("corporation tax");
	if (!this.offer.accounts) unavail.push("accounts filing");

	if (unavail.length == 0) return "(nothing)";

	let ret = "";

	for (let i = 0; i < unavail.length; i++) {
	    ret += unavail[i];
	    if (i < (unavail.length - 2))
		ret += ", ";
	    else if (i < (unavail.length - 1))
		ret += " and ";
	}

	return ret;

    }

}

