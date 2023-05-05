import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { VatRoutingModule } from './vat-routing.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';

import { NewComponent } from './new/new.component';
import { PreviewComponent } from './preview/preview.component';
import { SubmitComponent } from './submit/submit.component';
import { NavComponent } from './nav/nav.component';
import { PeriodComponent } from './period/period.component';
import { CompanyComponent } from './company/company.component';

import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatStepperModule } from '@angular/material/stepper'; 
import { DATE_FORMATS } from '../date-formats';

import { SharedModule } from '../shared/shared.module';
import { ChecklistModule } from '../checklist/checklist.module';

import { ChecklistComponent } from './checklist/checklist.component';
import { ReportComponent } from './report/report.component';
import { StatusComponent } from './status/status.component';
import { DataComponent } from './data/data.component';
import { RecordComponent } from './record/record.component';
import { LabelComponent } from './label/label.component';

@NgModule({
    declarations: [
	NewComponent,
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

