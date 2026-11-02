import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';

import { Transaction } from '../commerce.model';
import { CommerceService } from '../commerce.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { CurrencyPipe, DatePipe } from '@angular/common';

interface Row {
    id: string,
    time : Date,
    type? : string,
    status? : string,
    subtotal? : number,
    total? : number,
    v? : number,
    c? : number,
    a? : number,
    company? : string,
    filing? : string
}

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CurrencyPipe, DatePipe]
})
export class TransactionListComponent {
    private commerce = inject(CommerceService);
    private router = inject(Router);


    txs : Transaction[] = [];

    columns = [
	"time", "type", "status", "subtotal", "total",
	"v", "c", "a", "company", "filing"
    ];

    data : MatTableDataSource<Row> =
	new MatTableDataSource<Row>([]);

    constructor() {

	this.commerce.get_transactions().subscribe(txs => {
	    const data : Row[] = [];

	    for (const txid in txs) {

		const tx = txs[txid];

		const row : Row = {
		    id: txid,
		    time: new Date(tx.time + "Z"),
		    type: tx.type,
		    status: tx.status,
		    subtotal: tx.order!.subtotal,
		    total: tx.order!.total,
		    company: tx.company,
		    filing: tx.filing,
		};

		let v = 0, c = 0, a = 0;

		if (tx.order)
		    for (const i of tx.order.items) {
			if (i.kind == "vat") v += i.quantity;
			if (i.kind == "corptax") c += i.quantity;
			if (i.kind == "accounts") a += i.quantity;
		    }

		row.v = v;
		row.c = c;
		row.a = a;

		data.push(row);

	    }

	    data.sort((a : Row, b : Row) => b.time.getTime() - a.time.getTime());

	    this.data.data = data;
	});

    }

    select(x : Row) {
	this.router.navigate(["/commerce/transaction/" + x.id]);
    }

}

