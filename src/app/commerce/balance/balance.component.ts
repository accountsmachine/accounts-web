import { Component, OnInit } from '@angular/core';

import { Balance } from '../commerce.model';
import { CommerceService } from '../commerce.service';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

    balance : Balance;

    features = new Set<string>(environment.features);
    feature(x : string) { return this.features.has(x); }
    
    constructor(
	private commerce : CommerceService
    ) {

	this.balance = {
	    email: "", uid: "", credits: { vat: 0, corptax: 0, accounts: 0 }
	};
	
	this.commerce.onbalance().subscribe(b => {
	    this.balance = b;
	});
    }

    ngOnInit(): void {
  
    }

}
