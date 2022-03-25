
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CommerceComponent } from './commerce/commerce.component';

const routes: Routes = [
    { path: "", component: ListComponent },
    { path: "commerce", component: CommerceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilingRoutingModule { }

