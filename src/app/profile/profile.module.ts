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

@NgModule({
    declarations: [
	ProfileComponent,
    ],
    exports: [
	ProfileComponent,
    ],
    imports: [
	RouterModule,
	BrowserModule,
	BrowserAnimationsModule,
	MatCardModule,
	MatFormFieldModule,
	MatButtonModule,
	MatNativeDateModule,
	MatInputModule,
	MatProgressSpinnerModule,
	MatIconModule,
	MatTabsModule,
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

