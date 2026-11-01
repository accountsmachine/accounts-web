import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
    MatDialog
} from '@angular/material/dialog';

import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';

import { WorkingService } from '../../working.service';
import { AccountBalance, BooksService } from '../books.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    imports: [MatFormField, MatInput, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator, CurrencyPipe]
})
export class DetailComponent implements AfterViewInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private booksService = inject(BooksService);
    private working = inject(WorkingService);
    private dialog = inject(MatDialog);


    summary : MatTableDataSource<AccountBalance> =
	new MatTableDataSource<AccountBalance>([]);

    id  = "";

    @ViewChild(MatPaginator) paginator? : MatPaginator;
    @ViewChild(MatSort) sort? : MatSort;

    columns = ['account', 'balance'];

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

		    const id = params["id"];
		    this.id = id;

		    this.working.start();

		    this.booksService.get_books_detail(id).subscribe({
			next: (e : AccountBalance[]) => {
			    this.summary.data = e;
			    this.working.stop();
			},
			error: _err => {
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

    apply_filter(f : HTMLInputElement) {
	const filt = f.value.trim().toLowerCase();
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
	dialogRef.afterClosed().subscribe((result : { retry?: boolean } | undefined) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

