import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Transaction } from '../commerce.model';
import { CommerceService } from '../commerce.service';

type Row = {
    label : string,
    value : string,
};

@Component({
    selector: 'transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

    id = "";
    tx : Transaction = new Transaction();

    constructor(
	private route : ActivatedRoute,
	private commerce : CommerceService,
    )
    {
	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.id = params["id"];
		    this.commerce.get_transaction(this.id).subscribe(tx => {
			this.load(tx);
		    });
		}
	    }
	);
    }

    ngOnInit(): void {
    }

    load(tx : Transaction) {
	this.tx = tx;
    }

}

