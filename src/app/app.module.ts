import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
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

import { DATE_FORMATS } from './date-formats';

import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './main/main.component';
import { FrontComponent } from './front/front.component';

import { SharedModule } from './shared/shared.module';

import { AppInitService } from './initialise';
import { ErrorInterceptor } from './error-interceptor';
import { AuthHeaderInterceptor } from './auth-header-interceptor';

import { environment } from "src/environments/environment";

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
//import { USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/compat/database';
//import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
//import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';
//import { USE_EMULATOR as USE_FIRE_AUTH_EMULATOR } from '@angular/fire/compat/auth';


export function init(appInitService: AppInitService) {
    return (): Promise<any> => { 
	return appInitService.Init();
    }
}

@NgModule({
    declarations: [
	AppComponent,
	HomeComponent,
	MainComponent,
	FrontComponent,
    ],
    imports: [
	AppRoutingModule,
	RouterModule,
	BrowserModule,

	AngularFireModule.initializeApp(environment.firebase),
	AngularFireAuthModule,

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
	SharedModule,
    ],
    providers: [
	{
	    provide: USE_AUTH_EMULATOR,
	    useValue:
	    environment.useEmulators ?
		["http://localhost:9099"] :
		undefined
	},
	{ provide: LOCALE_ID, useValue: "en-GB" },
	{ provide: DEFAULT_CURRENCY_CODE, useValue: 'GBP' },
	{
            provide: DateAdapter, useClass: MomentDateAdapter,
	    deps: [MAT_DATE_LOCALE]
	},
	{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
        AppInitService,
	{
	    provide: APP_INITIALIZER,
	    useFactory: init,
	    deps: [AppInitService],
	    multi: true
	},
	{
	    provide: HTTP_INTERCEPTORS,
	    useClass: ErrorInterceptor,
	    multi: true
	},
	{
	    provide: HTTP_INTERCEPTORS,
	    useClass: AuthHeaderInterceptor,
	    multi: true
	}
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule {}


