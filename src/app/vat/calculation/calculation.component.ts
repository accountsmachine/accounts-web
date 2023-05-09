import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import * as moment from 'moment';

import { CompanyService, Company, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { ConfigurationService } from '../../configuration.service';
import { CalculationService, Calculation } from '../calculation.service';
import { MappingService } from '../../books/mapping.service';

class Node {
    kind() { return ""; }
    children : Node[] = [];
};

class LineNode extends Node {
    description : string = "n/a";
    amount : number = 0;
    override kind() { return "line"; }
};

class AccountNode extends Node {
    description : string = "n/a";
    amount : number = 0;
    override kind() { return "account"; }
};

class TransactionNode extends Node {
    date : string = "-";
    description : string = "n/a";
    amount : number = 0;
    override kind() { return "transaction"; }
};

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent {

    debug : string = "debug";

    calc : Calculation = new Calculation();

    companies : Companies = {};

    id : string = "";
    config : any = {};

    company : any = {};

    get_config(id : string) {

	this.working.start();

	this.filing.load(id).subscribe({

	    next: e => {

		this.working.stop();

                if (e.config.company) {
		    this.get_company(e.config.company);
		} else {
		    this.company = {};
		}

		this.id = e.id;
	    	this.config = e.config;
		this.get_calcs(e.id);
	    },

	    error: e => {

		this.working.stop();

		this.id = "";
		this.config = {};
	    }

	});

    }

    get_company(id : string) {

	this.working.start();

	this.companyService.load(id).subscribe({

	    next: c => {
		this.working.stop();
		this.company = c;
	    },

	    error: e => {
		this.working.stop();
		this.company = {};
	    },

	});
    }

    get_calcs(id : string) {

	this.working.start();

	this.calcs.load(id).subscribe({

	    next: record => {
		this.working.stop();
		this.load_calcs(record);
	    },

	    error: e => {
		this.working.stop();
		this.calc = new Calculation();
	    }

	});

    }

    load_calcs(calc : Calculation) {

	this.debug = JSON.stringify(calc, null, 4);
	this.calc = calc;

	let tree_data : LineNode[] = [];

	const boxes = [
	    "vat-output-sales",
	    "vat-output-acquisitions",
	    "vat-input",
  	    "total-vatex-sales",
	    "total-vatex-purchases",
	    "total-vatex-goods-supplied",
	    "total-vatex-acquisitions"
	];

	for (let box of boxes) {

	    let line = new LineNode();

	    line.description = "Box " + this.mapping.vat_box(box).toString() +
		": " + this.mapping.vat_desc(box);
	    line.amount = 100;

	    if (box in calc) {

		for (let row in calc[box]) {

		    let acct = calc[box][row];

		    let acctn = new AccountNode();
		    acctn.description = row;
		    acctn.amount = 100;
		    acctn.children = acct.map(
			(tx) => {
			    let tn = new TransactionNode();
			    tn.amount = tx.amount;
			    tn.description = tx.description;
			    tn.date = tx.date;
			    return tn;
			}
		    );

		    line.children.push(acctn);

		}

	    }

	    tree_data.push(line);



/*

	    let children : TransactionNode[] = [];

	    if (!(box in calc)) continue;

	    for(let row in calc[box]) {

		let acct = calc[box][row];

		if (acct.length == 0) {
		    children.push({
			description: row,
			children: [
/*
			    {
				description: "no transactions",
			    }
*/

	    /*
			]
		    });
		    continue;
		}

		children.push({
		    description: row,
		    children: acct,
		});
*/


//	    console.log(calc[box]);
/*
	    for (let acct of calc[box]) {
		children.push({
		    description: acct
		});
		}
		*/


	/*
	for(let line in calc) {
	    tree_data.push({
		description: line,
		children: [
		    {
			description: "asd",
		    },
		    {
			description: "def",
		    }
		],
	    });
	    }*/

	}

	console.log(tree_data);

	/*
	for (let node of tree_data) {
	    console.log(">>", node);
	    console.log(node.kind);
	    console.log(node.kind());
	    }
	    */

	//	this.tree_data = tree_data;

	console.log(tree_data[1].kind());
	this.dataSource.data = tree_data;

    }

    treeControl = new NestedTreeControl<Node>(node => node.children);
    dataSource = new MatTreeNestedDataSource<LineNode>();

    constructor(
	private route : ActivatedRoute,
	private filing : VatConfigService,
	private companyService : CompanyService,
	private router : Router,
	private calcs : CalculationService,
	private working : WorkingService,
	private configSvc : ConfigurationService,
	private mapping : MappingService,
    ) {

	this.route.params.subscribe(params => {
	    this.get_config(params["id"]);
	});

	this.dataSource.data = [];

    }

    ngOnInit() : void {
    }
/*
    hasChild(_ : number, node : TransactionNode) {
	return !!node.children;
//	    && node.children.length > 0;
}
*/

    isLine(num : number, n : Node) {
	return n.kind() == "line";
    }

    isAccount(num : number, n : Node) {
	return n.kind() == "account";
    }

    isTransaction(num : number, n : Node) {
	return n.kind() == "transaction";
    }

}

