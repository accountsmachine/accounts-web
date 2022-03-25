import { Component, OnInit, EventEmitter } from '@angular/core';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CheckoutService } from '../checkout.service';
import { Company } from '../../company/company.service';
import { CommerceService, Option, Balance } from '../commerce.service';

@Component({
    selector: 'checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    public form : FormGroup;

    options : Option[] = [];
    balance : Balance = { uid: "", email: "", credits: {
	vat: 0, accounts: 0, corptax: 0
    }};

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

	this.commerceService.get_options().subscribe(o => this.options = o);
	this.commerceService.get_balance().subscribe(b => this.balance = b);

    }

    doit() {
	console.log(this.form.value.vat,
		    this.form.value.corptax,
		    this.form.value.accounts);
    }

    chg(val : any) {
	console.log(val);
    }

    checkout() {
    }

}

