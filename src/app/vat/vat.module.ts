import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VatRoutingModule } from './vat-routing.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTreeModule } from '@angular/material/tree';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatStepperModule } from '@angular/material/stepper'; 
import { DATE_FORMATS } from '../date-formats';

import { NavComponent } from './nav/nav.component';
import { NewComponent } from './new/new.component';
import { CompanyComponent } from './company/company.component';
import { PeriodComponent } from './period/period.component';
import { CalculationComponent } from './calculation/calculation.component';
import { PreviewComponent } from './preview/preview.component';
import { SubmitComponent } from './submit/submit.component';
import { ChecklistModule } from '../checklist/checklist.module';
import { ChecklistComponent } from './checklist/checklist.component';
import { ReportComponent } from './report/report.component';
import { StatusComponent } from './status/status.component';
import { DataComponent } from './data/data.component';
import { RecordComponent } from './record/record.component';
import { LabelComponent } from './label/label.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
	NewComponent,
	CalculationComponent,
	PreviewComponent,
	SubmitComponent,
	NavComponent,
	PeriodComponent,
        CompanyComponent,
        ReportComponent,
        StatusComponent,
        DataComponent,
        RecordComponent,
        LabelComponent,
        ChecklistComponent,
        CalculationComponent,
    ],
    exports: [
	NewComponent,
	PreviewComponent,
	SubmitComponent,
	NavComponent,
	PeriodComponent,
    ],
    imports: [
        VatRoutingModule,
	MatStepperModule,
	CommonModule,
	MatSidenavModule,
	FormsModule,
	MatFormFieldModule,
	ReactiveFormsModule,
	MatSlideToggleModule,
	MatNativeDateModule,
	MatIconModule,
        MatTreeModule,	
	MatTableModule,
	MatSelectModule,
	RouterModule,
	MatButtonModule,
	MatInputModule,
	MatProgressSpinnerModule,
	MatSnackBarModule,
	SharedModule,
	ChecklistModule,
    ],
    providers: [
	{ provide: LOCALE_ID, useValue: "en-GB" },
	{ provide: DEFAULT_CURRENCY_CODE, useValue: 'GBP' },
	{
            provide: DateAdapter, useClass: MomentDateAdapter,
	    deps: [MAT_DATE_LOCALE]
	},
	{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
    ]
})
export class VatModule { }

