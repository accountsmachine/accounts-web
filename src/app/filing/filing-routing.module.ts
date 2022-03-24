
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';

const routes: Routes = [
    { path: "", component: ListComponent },
    { path: "subscriptions", component: SubscriptionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilingRoutingModule { }

