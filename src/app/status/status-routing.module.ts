import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { VatComponent } from './vat/vat.component';
import { CorptaxComponent } from './corptax/corptax.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: Routes = [
    { path: '', component: OverviewComponent },
    { path: ':id', children: [
	{ path: 'vat', component: VatComponent },
	{ path: 'corptax', component: CorptaxComponent },
	{ path: 'accounts', component: AccountsComponent },
    ] }
];
    
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusRoutingModule { }

