import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from '../date-formats';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';

import { BooksRoutingModule } from './books-routing.module';
import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';
import { DetailComponent } from './detail/detail.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { MappingComponent } from './mapping/mapping.component';

@NgModule({
    declarations: [
	ListComponent,
	UploadComponent,
	DetailComponent,
	DeleteConfirmationComponent,
        MappingComponent,
    ],
    imports: [
	CommonModule,
	MatButtonModule,
	MatCardModule,
	BooksRoutingModule,
	MatIconModule,
	MatInputModule,
	MatProgressBarModule,
	MatMenuModule,
	MatTableModule,
	MatSortModule,
	MatDialogModule,
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
