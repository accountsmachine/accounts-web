import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { DATE_FORMATS } from '../date-formats';

import { SafePipe } from './safe.pipe';
import {
    ImageUploaderComponent
} from './image-uploader/image-uploader.component';
import { RenderComponent } from './render/render.component';
import {
    KeyValueTableComponent
} from './key-value-table/key-value-table.component';
import {
    ErrorDialogComponent
} from './error-dialog/error-dialog.component';

@NgModule({
    declarations: [
	SafePipe,
        ImageUploaderComponent,
        RenderComponent,
        KeyValueTableComponent,
	ErrorDialogComponent,
    ],
    imports: [
	CommonModule,
	MatProgressBarModule,
	MatIconModule,
	MatTableModule,
	MatDialogModule,
	MatProgressSpinnerModule,
	MatButtonModule,
    ],
    exports: [
	SafePipe,
        ImageUploaderComponent,
	RenderComponent,
	KeyValueTableComponent,
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
export class SharedModule { }
