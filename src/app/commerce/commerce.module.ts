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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { NgxStripeModule } from 'ngx-stripe';

import { DATE_FORMATS } from '../date-formats';

import { CommerceRoutingModule } from './commerce-routing.module';
import {
    DeleteConfirmationComponent
} from './delete-confirmation/delete-confirmation.component';
import { CommerceComponent } from './commerce/commerce.component';
import { BalanceComponent } from './balance/balance.component';
import { ShopComponent } from './shop/shop.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionComponent } from './transaction/transaction.component';
import { NavComponent } from './nav/nav.component';
import { OrderComponent } from './order/order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CompleteComponent } from './complete/complete.component';

@NgModule({
    declarations: [
	DeleteConfirmationComponent,
	CommerceComponent,
	BalanceComponent,
        ShopComponent,
        TransactionListComponent,
        TransactionComponent,
        NavComponent,
        OrderComponent,
        CheckoutComponent,
        CompleteComponent
    ],
    imports: [
//        NgxStripeModule.forRoot("pk_test_51Khz14ImWys2SCctYBeX8uqlDHma6bHjO6mig7oHpaVTENa71keRcTiE1vDEpQewPc7UJWMX31CTJU6B2ycamnZa00PuWMDZPX"),
        NgxStripeModule.forChild("pk_test_51Khz14ImWys2SCctYBeX8uqlDHma6bHjO6mig7oHpaVTENa71keRcTiE1vDEpQewPc7UJWMX31CTJU6B2ycamnZa00PuWMDZPX"),
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
	CommerceRoutingModule,
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
export class CommerceModule { }
