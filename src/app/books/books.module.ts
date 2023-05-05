import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from '../date-formats';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { BooksRoutingModule } from './books-routing.module';
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';
import { DetailComponent } from './detail/detail.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { MappingComponent } from './mapping/mapping.component';
import { AccountsSelectionComponent } from './accounts-selection/accounts-selection.component';

@NgModule({
    declarations: [
	ListComponent,
	UploadComponent,
	DetailComponent,
	DeleteConfirmationComponent,
        MappingComponent,
	AccountsSelectionComponent,
    ],
    imports: [
	CommonModule,
	MatButtonModule,
	MatRadioModule,
	MatCardModule,
	BooksRoutingModule,
	MatIconModule,
	MatInputModule,
	MatProgressBarModule,
	MatMenuModule,
	MatTableModule,
	MatSortModule,
	MatDialogModule,
	MatSnackBarModule,
	MatCheckboxModule,
	MatRippleModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
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
	{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
    ]
})
export class BooksModule { }
