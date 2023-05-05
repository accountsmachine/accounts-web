import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { DATE_FORMATS } from '../date-formats';

import { FilingRoutingModule } from './filing-routing.module';
import { ListComponent } from './list/list.component';
import {
    DeleteConfirmationComponent
} from './delete-confirmation/delete-confirmation.component';

@NgModule({
    declarations: [
	ListComponent,
	DeleteConfirmationComponent,
    ],
    imports: [
	CommonModule,
	MatCardModule,
	MatIconModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatTableModule,
	MatSidenavModule,
	MatSnackBarModule,
	RouterModule,
	FilingRoutingModule,
	FormsModule,
	MatFormFieldModule,
	ReactiveFormsModule,
    ],
    providers: [
	{ provide: LOCALE_ID, useValue: "en-GB" },
	{ provide: DEFAULT_CURRENCY_CODE, useValue: 'GBP' },
	{
            provide: DateAdapter, useClass: MomentDateAdapter,
	    deps: [MAT_DATE_LOCALE]
	},
	{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    ],
})
export class FilingModule { }
