import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {
    MatDialog
} from '@angular/material/dialog';

import { BooksService, BooksMap } from '../books.service';
import { CompanyService, Companies } from '../../company/company.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';
import { WorkingService } from '../../working.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuContent, MatMenuItem } from '@angular/material/menu';
import { DatePipe } from '@angular/common';

class BookItem {
    company? : string;
    number? : string;
    size? : number;
    uploaded? : Date;
}

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatButton, MatIcon, MatMenuTrigger, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatMenu, MatMenuContent, MatMenuItem, DatePipe]
})
export class ListComponent implements OnInit {
    private router = inject(Router);
    private booksService = inject(BooksService);
    private companyService = inject(CompanyService);
    private dialog = inject(MatDialog);
    private working = inject(WorkingService);


    companies? : Companies;
    book_list? : BooksMap;

    columns = [ "company", "number", "size", "uploaded", "actions" ];

    books : MatTableDataSource<BookItem> =
	new MatTableDataSource<BookItem>([]);

    length(val : number | undefined) {
	if (val && val > 0)
	    return Math.round(val / 1024) + " kB";
	else
	    return "-";
    }

    time(val : Date | string | undefined) {
	if (val instanceof Date) {
	    return val;
	} else
	    return "";
    }

    update() {

	const data = [];

	const companies = this.companies;
	const books = this.book_list;

	if (!companies) return;
	if (!books) return;

	for(const k in companies) {

	    const row : BookItem = {
		company: k in companies ? companies[k].company_name : "",
		number: k,
		size: k in books ? books[k].length : undefined,
		uploaded: k in books ? new Date(books[k].time + "Z") : undefined,
	    };

	    data.push(row);
	    
	}

	this.books.data = data;

    }

    ngOnInit(): void {
	this.reload();
    }

    reload_companies() : void {

	this.working.start();

	this.companyService.get_list().subscribe({
	    next: (e : Companies) => {
		this.working.stop();
		this.companies = e;
		this.reload_books();
	    },
	    error: _err => {
		this.error("Failed to load books overview");
		this.working.stop();
	    },
	    complete: () => {
	    },
	});

    }

    reload_books() {

	this.working.start();

	this.booksService.get_list().subscribe({
	    next: (e : BooksMap) => {
		this.working.stop();
		this.book_list = e;
		this.update();
	    },
	    error: _err => {
		this.working.stop();
		this.error("Failed to load books overview");
	    },
	    complete: () => {
	    },
	});
	
    }

    reload() {
	this.reload_companies();
    }

    selected(c : BookItem) {
	this.router.navigate(["/books/" + c.number + "/detail"])
    }

    upload(c : BookItem) {
	this.router.navigate(["/books/" + c.number + "/upload"])
    }

    delete(c : BookItem) {
	const dialogRef = this.dialog.open(
	    DeleteConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    company: c,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : { proceed?: boolean; company?: BookItem } | undefined) => {
	    if (result) {
		if (result.proceed) {
		    this.booksService.delete(
			result.company!.number!
		    ).subscribe(() => {
			this.reload();
		    });
		}
	    }
	});
    }

    info(c : BookItem) {
	this.router.navigate(["/books/" + c.number + "/detail"])
    }

    mapping(c : BookItem) {
	this.router.navigate(["/books/" + c.number + "/mapping"])
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

