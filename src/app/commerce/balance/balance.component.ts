import { Component, OnInit } from '@angular/core';

import { Balance } from '../commerce.model';
import { CommerceService } from '../commerce.service';

import { ConfigurationService } from '../../configuration.service';

@Component({
  selector: 'balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

    feature(x : string) {
        return this.configSvc.hasFeature(x);
    }

    get nofeatures() {
        return this.configSvc.noFeatures();
    }

    balance : Balance;
    
    constructor(
	private commerce : CommerceService,
	private configSvc : ConfigurationService,
    ) {

	this.balance = {
	    vat: 0, corptax: 0, accounts: 0
	};
	
	this.commerce.balance().subscribe(b => {
	    this.balance = b;
	});
    }

    ngOnInit(): void {
  
    }

}
