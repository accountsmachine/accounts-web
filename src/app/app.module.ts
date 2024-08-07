import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';

import { DATE_FORMATS } from './date-formats';

import { HttpClientModule } from '@angular/common/http';

import { AppInitService } from './initialise';

import { ConfigurationService } from './configuration.service';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';

import { HomeComponent } from './home/home.component';
import { TabsComponent } from './tabs/tabs.component';

import { SharedModule } from './shared/shared.module';
import { ProfileModule } from './profile/profile.module';

const initAppFn =
      (svc: ConfigurationService) => {
	  return () => svc.loadConfig('/assets/config.json');
      };

const getFirebaseFn =
      (svc: ConfigurationService) => {
	  return svc.getFirebase();
      };

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        TabsComponent,
    ],
    bootstrap: [AppComponent], imports: [AppRoutingModule,
        RouterModule,
        BrowserModule,
        //	provideFirebaseApp(() => initializeApp()),
        BrowserAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatExpansionModule,
        MatNativeDateModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTabsModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileModule], providers: [
        ConfigurationService,
        {
            provide: APP_INITIALIZER,
            useFactory: initAppFn,
            multi: true,
            deps: [ConfigurationService],
        },
        {
            provide: FIREBASE_OPTIONS,
            useFactory: getFirebaseFn,
            deps: [ConfigurationService],
        },
        { provide: LOCALE_ID, useValue: "en-GB" },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'GBP' },
        {
            provide: DateAdapter, useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
        provideHttpClient(withInterceptorsFromDi()),
    ] })

export class AppModule {}

