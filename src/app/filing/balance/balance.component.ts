import { Component, OnInit } from '@angular/core';

import { CommerceService, Balance } from '../commerce.service';

@Component({
  selector: 'balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

    balance : Balance;
    
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
