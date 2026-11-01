import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource, MatTree, MatTreeNodeDef, MatTreeNode, MatTreeNodeToggle, MatNestedTreeNode, MatTreeNodeOutlet } from '@angular/material/tree';
import {
    MatDialog
} from '@angular/material/dialog';


import { Company, CompanyService, Companies } from '../../company/company.service';
import { WorkingService } from '../../working.service';
import { VatConfigService } from '../vat-config.service';
import { VatConfig } from '../vat-config';
import { ConfigurationService } from '../../configuration.service';
import { CalculationService, Calculation } from '../calculation.service';
import { MappingService } from '../../books/mapping.service';

import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

class Node {
    kind() { return ""; }
    children : Node[] = [];
};

class LineNode extends Node {
    description  = "n/a";
    amount  = 0;
    override kind() { return "line"; }
};

class AccountNode extends Node {
    description  = "n/a";
    amount  = 0;
    reversed  = false;
    override kind() { return "account"; }
};

class TransactionNode extends Node {
    date  = "-";
    description  = "n/a";
    amount  = 0;
    override kind() { return "transaction"; }
};

@Component({
    selector: 'app-calculation',
    templateUrl: './calculation.component.html',
    styleUrls: ['./calculation.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, MatTree, MatTreeNodeDef, MatTreeNode, MatTreeNodeToggle, MatNestedTreeNode, MatIconButton, MatIcon, MatTreeNodeOutlet]
})
export class CalculationComponent {
    private route = inject(ActivatedRoute);
    private filing = inject(VatConfigService);
    private companyService = inject(CompanyService);
    private router = inject(Router);
    private calcs = inject(CalculationService);
    private working = inject(WorkingService);
    private configSvc = inject(ConfigurationService);
    private mapping = inject(MappingService);
    private dialog = inject(MatDialog);


    calc : Calculation = new Calculation();

    companies : Companies = {};

    id  = "";
    config : VatConfig = {};

    company : Company = new Company();

    get_config(id : string) {

	this.working.start();

	this.filing.load(id).subscribe({

	    next: e => {

		this.working.stop();

                if (e.config.company) {
		    this.get_company(e.config.company);
		} else {
		    this.company = new Company();
		}

		this.id = e.id;
	    	this.config = e.config;
		this.get_calcs(e.id);
	    },

	    error: _e => {

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
		this.company = c ?? new Company();
	    },

	    error: _e => {
		this.working.stop();
		this.company = new Company();
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

	    error: _e => {
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

	const tree_data : LineNode[] = [];

	const boxes = [
	    "vat-output-sales",
	    "vat-output-acquisitions",
	    "vat-input",
  	    "total-vatex-sales",
	    "total-vatex-purchases",
	    "total-vatex-goods-supplied",
	    "total-vatex-acquisitions"
	];

	for (const box of boxes) {

	    const line = new LineNode();

	    line.description = "Box " + this.mapping.vat_box(box).toString() +
		": " + this.mapping.vat_desc(box);

	    line.amount = 0;

	    if (box in calc.calculation) {

		for (const row in calc.calculation[box]) {

		    const acct = calc.calculation[box][row];

		    const acctn = new AccountNode();
		    acctn.description = row;
		    acctn.reversed = acct.reversed;
		    acctn.amount = acct.transactions.reduce(
			(acc, cur) => acc + cur.amount,
			0
		    );
		    if (acct.reversed) acctn.amount = -acctn.amount;
		    acctn.children = acct.transactions.map(
			(tx) => {
			    const tn = new TransactionNode();
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
    
    constructor() {

	this.route.params.subscribe(params => {

	    // FIXME: Id gets assigned multiple times?
	    this.id = params["id"];
	    this.reload();
	});

	this.dataSource.data = [];

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
	dialogRef.afterClosed().subscribe((result : { retry?: boolean } | undefined) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

