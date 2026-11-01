import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Transaction } from '../commerce.model';
import { CommerceService } from '../commerce.service';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';
import { UpperCasePipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent, UpperCasePipe, CurrencyPipe, DatePipe]
})
export class TransactionComponent {
    private route = inject(ActivatedRoute);
    private commerce = inject(CommerceService);


    id = "";
    tx : Transaction = new Transaction();

    constructor()
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

    load(tx : Transaction) {
	this.tx = tx;
    }

}

