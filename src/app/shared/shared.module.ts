import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import {
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { DATE_FORMATS } from '../date-formats';

import { SafePipe } from './safe.pipe';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { RenderComponent } from './render/render.component';
import { KeyValueTableComponent } from './key-value-table/key-value-table.component';

@NgModule({
    declarations: [
	SafePipe,
        ImageUploaderComponent,
        RenderComponent,
        KeyValueTableComponent,
    ],
    imports: [
	CommonModule,
	MatProgressBarModule,
	MatIconModule,
	MatTableModule,
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
