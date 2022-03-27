import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';

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

    data : MatTableDataSource<Row> =
	new MatTableDataSource<Row>([]);

    columns = ["label", "value"];

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

	let data : Row[] = [];

	data.push({ "label": "ID", "value": this.id });
	data.push({ "label": "Time", "value": tx.time });

	if (tx.filing)
	    data.push({ "label": "Filing", "value": tx.filing });

	if (tx.company)
	    data.push({ "label": "Company", "value": tx.company });

	data.push({ "label": "Transaction", "value": tx.transaction });

	if (tx.name)
	    data.push({ "label": "Name", "value": tx.name });

	if (tx.address)
	    data.push({ "label": "Address", "value": tx.address.join(", ") });

	if (tx.postcode)
	    data.push({ "label": "Postcode", "value": tx.postcode });

	if (tx.country)
	    data.push({ "label": "Country", "value": tx.country });

	if (tx.billing_country)
	    data.push({ "label": "Billing country", "value": tx.billing_country });

	if (tx.uid)
	    data.push({ "label": "UID", "value": tx.uid });

	if (tx.email)
	    data.push({ "label": "Email", "value": tx.email });

	if (tx.order) {
	    for (let item of tx.order.items) {

		let amount = "";
		if (item.amount) {
		    amount = (item.amount / 100).toFixed(2).toString();
		    amount = " (£" + amount +")";
		}

		let rsrc;
		if (item.kind == "vat") rsrc = "VAT credit";
		if (item.kind == "corptax") rsrc = "Corp tax credit";
		if (item.kind == "accounts") rsrc = "Accounts filing";

		if (rsrc) {
		    data.push({
			"label": rsrc, "value": item.quantity.toString() + amount,
		    });
		}

	    }

	    if (tx.order.subtotal)
		data.push({
		    "label": "Subtotal",
		    "value": "£" + (tx.order.subtotal / 100).toFixed(2).toString()
		});

	    if (tx.order.vat)
		data.push({
		    "label": "VAT",
		    "value": "£" + (tx.order.vat / 100).toFixed(2).toString()
		});

	    if (tx.order.total)
		data.push({
		    "label": "Total",
		    "value": "£" + (tx.order.total / 100).toFixed(2).toString()
		});

	}

	if (tx.valid != undefined)
	    data.push({ "label": "Valid", "value": tx.valid.toString() });

	if (tx.vat_number)
	    data.push({ "label": "VAT no.", "value": tx.vat_number });

	this.data.data = data;

    }

}

