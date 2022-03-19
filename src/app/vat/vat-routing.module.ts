import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewComponent } from './new/new.component';
import { LabelComponent } from './label/label.component';
import { CompanyComponent } from './company/company.component';
import { PeriodComponent } from './period/period.component';
import { PreviewComponent } from './preview/preview.component';
import { SubmitComponent } from './submit/submit.component';
import { ReportComponent } from './report/report.component';
import { DataComponent } from './data/data.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
    { path: 'new', component: NewComponent },
    { path: ':id', children: [
	{ path: '', redirectTo: 'label', pathMatch: "full" },
	{ path: 'label', component: LabelComponent },
	{ path: 'company', component: CompanyComponent },
	{ path: 'period', component: PeriodComponent },
	{ path: 'preview', component: PreviewComponent },
	{ path: 'submit', component: SubmitComponent },
	{ path: 'report', component: ReportComponent },
	{ path: 'data', component: DataComponent },
	{ path: 'status', component: StatusComponent },
    ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VatRoutingModule { }

