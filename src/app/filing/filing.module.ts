import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import {
    SubscriptionsListComponent
} from './subscriptions-list/subscriptions-list.component';
import { CheckoutComponent } from './checkout/checkout.component';


@NgModule({
    declarations: [
	ListComponent,
	DeleteConfirmationComponent,
	SubscriptionsComponent,
        SubscriptionsListComponent,
        CheckoutComponent
    ],
    imports: [
	CommonModule,
	MatCardModule,
	MatIconModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatDialogModule,
	MatTableModule,
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
