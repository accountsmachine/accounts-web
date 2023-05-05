import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'; 
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { DATE_FORMATS } from '../date-formats';

import { CompanyRoutingModule } from './company-routing.module';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';

import { NavComponent } from './nav/nav.component';
import { BusinessConfigComponent } from './business-config/business-config.component';
import { AddressConfigComponent } from './address-config/address-config.component';
import { ContactConfigComponent } from './contact-config/contact-config.component';
import { WebConfigComponent } from './web-config/web-config.component';
import { ActivitiesConfigComponent } from './activities-config/activities-config.component';
import { TaxConfigComponent } from './tax-config/tax-config.component';

import { SharedModule } from '../shared/shared.module';
import { LogoComponent } from './logo/logo.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';

@NgModule({
    declarations: [
	ListComponent,
	NewComponent,
	NavComponent,
	BusinessConfigComponent,
	AddressConfigComponent,
	ActivitiesConfigComponent,
	ContactConfigComponent,
	WebConfigComponent,
	TaxConfigComponent,
	LogoComponent,
	DeleteConfirmationComponent,
    ],
    imports: [
	CommonModule,
	RouterModule,

	CompanyRoutingModule,
	MatSidenavModule,
	FormsModule,
	MatFormFieldModule,
	MatSnackBarModule,
	ReactiveFormsModule,
	MatNativeDateModule,
	MatInputModule,
	MatDialogModule,
	MatCardModule,
	MatSelectModule,
	MatSlideToggleModule,
	MatButtonModule,
	MatCheckboxModule,
	MatChipsModule,
	MatIconModule,
	MatDatepickerModule,

	SharedModule,
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
export class CompanyModule { }

