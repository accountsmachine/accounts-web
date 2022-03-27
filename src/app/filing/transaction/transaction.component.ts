import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Transaction } from '../commerce.model';
import { CommerceService } from '../commerce.service';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

    txs : any = {};
    id = "";
    tx : any = {};

    constructor(
	private route : ActivatedRoute,
	private commerce : CommerceService,
    )
    {
	this.commerce.get_transactions().subscribe(txs => {
	    this.txs = txs;
//	    console.log(this.txs);
	    if (this.txs[this.id]) {
		this.tx = this.txs[this.id];
			console.log(this.tx);
	    }
	});
	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.id = params["id"];
		    if (this.txs[this.id]) {
			this.tx = this.txs[this.id];
			console.log(this.tx);
		    }
		}
	    }
	);

    }

    ngOnInit(): void {
    }

}
