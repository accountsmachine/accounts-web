import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { MatLegacyTable as MatTable, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';

import { WorkingService } from '../../working.service';
import { AccountBalance, BooksService } from '../books.service';

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit {

    summary : MatTableDataSource<AccountBalance> =
	new MatTableDataSource<AccountBalance>([]);

    id : string = "";

    @ViewChild(MatPaginator) paginator? : MatPaginator;
    @ViewChild(MatSort) sort? : MatSort;

    columns = ['account', 'balance'];

    constructor(
	private route : ActivatedRoute,
	private router : Router,
	private booksService : BooksService,
	private working : WorkingService,
	private dialog : MatDialog,
    )
    {
    }

    ngOnInit() {}

    configure() {
	this.summary!.paginator = this.paginator!;
	this.summary!.sort = this.sort!;
    }

    ngAfterViewInit(): void {
	this.reload();
    }

    reload(): void {

	this.configure();

	this.route.params.subscribe(
	    params => {
		if (params["id"]) {

		    let id = params["id"];
		    this.id = id;

		    this.working.start();

		    this.booksService.get_books_detail(id).subscribe({
			next: (e : AccountBalance[]) => {
			    this.summary.data = e;
			    this.working.stop();
			},
			error: err => {
			    this.working.stop();
			    this.error("Failed to load accounting books");
			},
			complete: () => {
			},
		    });

		}
	    }
	);

    }

    apply_filter(f : any) {
	let filt = f!.value.trim().toLowerCase();
	this.summary.filter = filt;
    }

    error(m : string) {
	const dialogRef = this.dialog.open(
	    ErrorDialogComponent, {
		width: '550px',
		data: {
		    retry: false,
		    message: m,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

