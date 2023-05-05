import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { ChecklistTableComponent
       } from './checklist-table/checklist-table.component';

@NgModule({
    declarations: [
	ChecklistTableComponent,
    ],
    exports: [
	ChecklistTableComponent,
    ],
    imports: [
	MatIconModule,
	MatTableModule,
	MatButtonModule,
	CommonModule,
    ]
})
export class ChecklistModule { }
