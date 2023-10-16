import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import * as moment from 'moment';

import { CompanyService, Company, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';
import { VatConfig } from '../vat-config';
import { VatConfigService } from '../vat-config.service';
import { ConfigurationService } from '../../configuration.service';
import { CalculationService, Calculation } from '../calculation.service';
import { MappingService } from '../../books/mapping.service';

import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';

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
    reversed : boolean = false;
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

	if (calc.error) {
	    console.log(calc.error);

	    if (calc.error.message)
		this.error(calc.error.message);
	    else
		this.error("Calculation error - check account books are correct");
	    return;
	}

	if (!calc.calculation) {
	    console.log("Calculation should not be null");
	    return;
	}

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

	    line.amount = 0;

	    if (box in calc.calculation) {

		for (let row in calc.calculation[box]) {

		    let acct = calc.calculation[box][row];

		    let acctn = new AccountNode();
		    acctn.description = row;
		    acctn.reversed = acct.reversed;
		    acctn.amount = acct.transactions.reduce(
			(acc, cur) => acc + cur.amount,
			0
		    );
		    if (acct.reversed) acctn.amount = -acctn.amount;
		    acctn.children = acct.transactions.map(
			(tx) => {
			    let tn = new TransactionNode();
			    tn.amount = acct.reversed ? -tx.amount : tx.amount;
			    tn.description = tx.description;
			    tn.date = tx.date;
			    return tn;
			}
		    );

		    line.children.push(acctn);

		    line.amount += acctn.amount;

		}

	    }

	    tree_data.push(line);

	}

	this.dataSource.data = tree_data;

	this.treeControl.dataNodes = tree_data;
	this.treeControl.expandAll();

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
	private dialog : MatDialog,
    ) {

	this.route.params.subscribe(params => {

	    // FIXME: Id gets assigned multiple times?
	    this.id = params["id"];
	    this.reload();
	});

	this.dataSource.data = [];

    }

    ngOnInit() : void {
    }

    reload() {
	this.get_config(this.id);
    }

    isLine(num : number, n : Node) {
	return n.kind() == "line";
    }

    isAccount(num : number, n : Node) {
	return n.kind() == "account";
    }

    isTransaction(num : number, n : Node) {
	return n.kind() == "transaction";
    }

    error(m : string) {
	const dialogRef = this.dialog.open(
	    ErrorDialogComponent, {
		width: '550px',
		data: {
		    retry: false,
		    message: m,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

