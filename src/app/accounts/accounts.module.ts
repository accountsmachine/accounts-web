import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AccountsRoutingModule } from './accounts-routing.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

import { DATE_FORMATS } from '../date-formats';

import { NavComponent } from './nav/nav.component';
import { NewComponent } from './new/new.component';
import { PeriodsComponent } from './periods/periods.component';
import { AuthorisationComponent } from './authorisation/authorisation.component';
import { EmployeesComponent } from './employees/employees.component';
import { StructureComponent } from './structure/structure.component';
import { PreviewComponent } from './preview/preview.component';
import { SubmitComponent } from './submit/submit.component';

import { SharedModule } from '../shared/shared.module';
import { CompanyComponent } from './company/company.component';
import { SignatureComponent } from './signature/signature.component';
import { LabelComponent } from './label/label.component';
import { ReportComponent } from './report/report.component';
import { StatusComponent } from './status/status.component';
import { DataComponent } from './data/data.component';

@NgModule({
    declarations: [
	NavComponent,
	NewComponent,
	PeriodsComponent,
	AuthorisationComponent,
	EmployeesComponent,
	StructureComponent,
	PreviewComponent,
	SubmitComponent,
	CompanyComponent,
	SignatureComponent,
	ReportComponent,
	StatusComponent,
	DataComponent,
 LabelComponent,
    ],
    exports : [
	NavComponent,
	NewComponent,
	PeriodsComponent,
	AuthorisationComponent,
	EmployeesComponent,
	StructureComponent,
	PreviewComponent,
	SubmitComponent,
    ],
    imports: [
	AccountsRoutingModule,
	CommonModule,
	MatSidenavModule,
	FormsModule,
	MatFormFieldModule,
	ReactiveFormsModule,
	MatNativeDateModule,
	MatSelectModule,
	MatIconModule,
	RouterModule,
	MatButtonModule,
	MatSlideToggleModule,
	MatProgressSpinnerModule,
	SharedModule,
	MatDatepickerModule,
	MatInputModule,
	MatSnackBarModule,
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
export class AccountsModule { }
