import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
