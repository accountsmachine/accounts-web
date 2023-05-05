import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import {
    MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';

import { BooksService, BooksMap } from '../books.service';
import { CompanyService, Companies } from '../../company/company.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
import {
    ErrorDialogComponent
} from '../../shared/error-dialog/error-dialog.component';
import { WorkingService } from '../../working.service';

class BookItem {
    company? : string;
    number? : string;
    size? : number;
    uploaded? : Date;
}

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    companies? : Companies;
    book_list? : BooksMap;

    columns = [ "company", "number", "size", "uploaded", "actions" ];

    books : MatTableDataSource<BookItem> =
	new MatTableDataSource<BookItem>([]);

    constructor(
	private router : Router,
	private booksService : BooksService,
	private companyService : CompanyService,
	private dialog : MatDialog,
	private working : WorkingService,
    ) { }

    length(val : any) {
	if (val > 0)
	    return Math.round(val / 1024) + " kB";
	else
	    return "-";
    }

    time(val : any) {
	if (val instanceof Date) {
	    return val;
	} else
	    return "";
    }

    update() {

	let data = [];

	let companies = this.companies;
	let books = this.book_list;

	if (!companies) return;
	if (!books) return;

	for(let k in companies) {

	    let row : BookItem = {
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
	    error: err => {
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
	    error: err => {
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

    selected(c : any) {
	this.router.navigate(["/books/" + c.number + "/detail"])
    }

    upload(c : any) {
	this.router.navigate(["/books/" + c.number + "/upload"])
    }

    delete(c : any) {
	const dialogRef = this.dialog.open(
	    DeleteConfirmationComponent, {
		width: '450px',
		data: {
		    proceed: false,
		    company: c,
		},
	    }
	);
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.proceed) {
		    this.booksService.delete(
			result.company.number
		    ).subscribe(() => {
			this.reload();
		    });
		}
	    }
	});
    }

    info(c : any) {
	this.router.navigate(["/books/" + c.number + "/detail"])
    }

    mapping(c : any) {
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
	dialogRef.afterClosed().subscribe((result : any) => {
	    if (result) {
		if (result.retry) {
		    this.reload();
		}
	    }
	});
    }

}

