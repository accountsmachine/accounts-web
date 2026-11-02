import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
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



import { ConfigurationService } from './configuration.service';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';


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

@NgModule({ declarations: [AppComponent], bootstrap: [AppComponent], imports: [AppRoutingModule,
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
        ProfileModule, HomeComponent,
        TabsComponent], providers: [
        ConfigurationService,
        provideAppInitializer(() => {
            const initializerFn = (initAppFn)(inject(ConfigurationService));
            return initializerFn();
        }),
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

