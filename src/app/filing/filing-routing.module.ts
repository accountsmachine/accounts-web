
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilingComponent }
    from './filing/filing.component';

const routes: Routes = [
    { path: "", component: FilingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilingRoutingModule { }

