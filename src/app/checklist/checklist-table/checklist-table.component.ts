
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

import { Checklist, Check } from '../checklist.model';

@Component({
    selector: 'checklist-table',
    templateUrl: './checklist-table.component.html',
    styleUrls: ['./checklist-table.component.scss']
})
export class ChecklistTableComponent implements OnInit, OnChanges {

    table : MatTableDataSource<Check> =
	new MatTableDataSource<Check>([]);

    pending = false;

    @Input()
    checklist : Checklist = new Checklist();

    ngOnChanges(changes : any) {
    	this.pending = this.checklist.pending;
	this.table.data = this.checklist.list;
    }

    columns = [ "kind", "description", "action" ];

    constructor(
	private router : Router,
    ) {
	this.pending = true;
    }

    ngOnInit(): void {
	this
    }

    select(row : Check) {
	this.router.navigate([row.href]);
	return false;
    }

}

