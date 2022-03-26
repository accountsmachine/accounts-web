
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CommerceComponent } from './commerce/commerce.component';
import { BalanceComponent } from './balance/balance.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TransactionListComponent
       } from './transaction-list/transaction-list.component';

const routes: Routes = [
    { path: "", component: ListComponent },
    { path: "commerce", children: [
	  { path: "", redirectTo: 'balance', pathMatch: 'full' },
	  { path: "balance", component: BalanceComponent },
	  { path: "purchase", component: CheckoutComponent },
	  { path: "transactions", component: TransactionListComponent },
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilingRoutingModule { }

