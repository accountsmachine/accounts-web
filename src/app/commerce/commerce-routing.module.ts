
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CommerceComponent } from './commerce/commerce.component';
import { BalanceComponent } from './balance/balance.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { TransactionListComponent
       } from './transaction-list/transaction-list.component';
import { TransactionComponent
       } from './transaction/transaction.component';

const routes: Routes = [
    { path: "", redirectTo: 'balance', pathMatch: 'full' },
    { path: "balance", component: BalanceComponent },
    { path: "purchase", component: CheckoutComponent },
    { path: "transactions", component: TransactionListComponent },
    { path: "transaction", children: [
	{ path: ":id", component: TransactionComponent },
    ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommerceRoutingModule { }
