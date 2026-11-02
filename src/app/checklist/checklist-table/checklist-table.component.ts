
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';

import { Checklist, Check } from '../checklist.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { LowerCasePipe } from '@angular/common';

@Component({
    selector: 'checklist-table',
    templateUrl: './checklist-table.component.html',
    styleUrls: ['./checklist-table.component.scss'],
    imports: [MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, LowerCasePipe]
})
export class ChecklistTableComponent implements OnChanges {
    private router = inject(Router);


    table : MatTableDataSource<Check> =
	new MatTableDataSource<Check>([]);

    pending = false;

    @Input()
    checklist : Checklist = new Checklist();

    ngOnChanges(_changes : SimpleChanges) {
    	this.pending = this.checklist.pending;
	this.table.data = this.checklist.list;
    }

    columns = [ "kind", "description", "action" ];

    constructor() {
	this.pending = true;
    }

    select(row : Check) {
	this.router.navigate([row.href]);
	return false;
    }

}

