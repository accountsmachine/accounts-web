import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';

import { DATE_FORMATS } from '../date-formats';

import { HttpClientModule } from '@angular/common/http';

import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FrontComponent } from './front/front.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { LoginComponent } from './login/login.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import {
    ChangePasswordComponent
} from './change-password/change-password.component';
import { NavComponent } from './nav/nav.component';
import { OverviewComponent } from './overview/overview.component';
import {
    DeleteConfirmationComponent
} from './delete-confirmation/delete-confirmation.component';
import { DeleteComponent } from './delete/delete.component';
import { BillingDetailsComponent
       } from './billing-details/billing-details.component';

@NgModule({
    declarations: [
	ProfileComponent,
	ResetPasswordComponent,
	FrontComponent,
	RegisterComponent,
	VerifyEmailComponent,
	LoginComponent,
	UpdateProfileComponent,
	ChangeEmailComponent,
	ChangePasswordComponent,
	NavComponent,
	OverviewComponent,
	DeleteConfirmationComponent,
	DeleteComponent,
 BillingDetailsComponent,
    ],
    exports: [
	ProfileComponent,
	ResetPasswordComponent,
	FrontComponent,
	RegisterComponent,
	VerifyEmailComponent,
	LoginComponent,
    ],
    imports: [
	RouterModule,
	BrowserModule,
	BrowserAnimationsModule,
	MatCardModule,
	MatFormFieldModule,
	MatButtonModule,
	MatDialogModule,
	MatNativeDateModule,
	MatInputModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatTabsModule,
	MatSidenavModule,
	MatSnackBarModule,
	HttpClientModule,
	FormsModule,
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

export class ProfileModule {}


