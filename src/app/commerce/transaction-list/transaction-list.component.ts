import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

import { Transaction } from '../commerce.model';
import { CommerceService } from '../commerce.service';

type Row = {
    id: string,
    time : Date,
    transaction? : string,
    subtotal? : number,
    total? : number,
    v? : number,
    c? : number,
    a? : number,
    company? : string,
    filing? : string
};

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

    txs : Transaction[] = [];

    columns = [
	"time", "transaction", "subtotal", "total",
	"v", "c", "a", "company", "filing"
    ];

    data : MatTableDataSource<Row> =
	new MatTableDataSource<Row>([]);

    constructor(
	private commerce : CommerceService,
	private router : Router,
    ) {

	this.commerce.get_transactions().subscribe(txs => {
	    let data : Row[] = [];

	    for (let txid in txs) {
/*

		let tx = txs[txid];

		let row : Row = {
		    id: txid,
		    time: new Date(tx.time + "Z"),
		    transaction: tx.transaction,
		    subtotal: tx.order.subtotal,
		    total: tx.order.total,
		    company: tx.company,
		    filing: tx.filing,
		};

		let v = 0, c = 0, a = 0;

		if (tx.order)
		    for (let i of tx.order.items) {
			if (i.kind == "vat") v += i.quantity;
			if (i.kind == "corptax") c += i.quantity;
			if (i.kind == "accounts") a += i.quantity;
		    }

		row.v = v;
		row.c = c;
		row.a = a;

		data.push(row);
*/

	    }

	    data.sort((a : any, b : any) => b.time - a.time);

	    this.data.data = data;
	});

    }

    ngOnInit(): void {
    }

    select(x : any) {
	this.router.navigate(["/commerce/transaction/" + x.id]);
    }

}

