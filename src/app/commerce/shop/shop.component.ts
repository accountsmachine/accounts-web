import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Options, Order } from '../commerce.model';
import { CommerceService } from '../commerce.service';
import { CheckoutService } from '../checkout.service';

import { ConfigurationService } from '../../configuration.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { OrderComponent } from '../order/order.component';
import { MatButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, MatIcon, FormsModule, ReactiveFormsModule, MatButtonToggleGroup, MatButtonToggle, OrderComponent, MatButton, CurrencyPipe]
})
export class ShopComponent implements OnInit {
    private service = inject(CheckoutService);
    private commerceService = inject(CommerceService);
    private formBuilder = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);
    private router = inject(Router);
    private configSvc = inject(ConfigurationService);


    feature(x : string) {
        return this.configSvc.hasFeature(x);
    }

    get nofeatures() {
        return this.configSvc.noFeatures();
    }

    public form : FormGroup;

    offer : Options = { offer: {} };
    kinds : string[] = [];

    value : Record<string, number> = {};
    descriptions : Record<string, string> = {};

    order : Order = new Order();

    constructor() {
	this.form = this.formBuilder.group({
	    vat: [0],
	    corptax: [0],
	    accounts: [0],
	});
	this.service.onorder().subscribe(o => {

	    this.order = o;

	    this.value = {};
	    this.descriptions = {};

	    for (const item of this.order.items) {
		this.value[item.kind] = item.amount;
//		this.description[item.kind]
	    }
	    
	});
    }

    ngOnInit(): void {
	this.reload();
    }

    vat_rate() {
	return Math.round(100 * this.order.vat_rate);
    }

    some_max() {
	return Object.keys(this.offer.offer).length < 3;
    }

    reload() {
	this.commerceService.get_offer().subscribe(o => {
	    this.offer = o;
	    this.kinds = [];
	    for (const k in this.offer.offer) {
		this.kinds.push(k);
	    }
	});
	this.reset();
    }


    recalc() {
	this.service.set_quantity("vat", this.form.value.vat);
	this.service.set_quantity("corptax", this.form.value.corptax);
	this.service.set_quantity("accounts", this.form.value.accounts);
    }

    cc_checkout() {
	this.router.navigate(["/commerce/cc-checkout"]);
    }

    free_checkout() {
	this.service.complete_free_order().subscribe(_o => {
	    this.router.navigate(["/commerce/complete"]);
	});
	this.reset();
    }

    crypto_checkout() {
	this.router.navigate(["/commerce/crypto-checkout"]);
    }

    reset() {
	this.form.patchValue({
	    vat: 0, corptax: 0, accounts: 0
	});
	this.recalc();
    }

    order_disabled() {
	return (this.order.total < 1);
    }

    free_order_available() {
	return (this.order.items.length > 0) && (this.order.total == 0);
    }

    full_credits() {

	const unavail = [];

	if (!this.offer.offer["vat"]) unavail.push("VAT");
	if (!this.offer.offer["corptax"]) unavail.push("corporation tax");
	if (!this.offer.offer["accounts"]) unavail.push("accounts filing");

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

