import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
} from '@angular/material/dialog';

import { BooksService } from '../books.service';
import { CompanyService, Companies } from '../../company/company.service';
import {
    DeleteConfirmationComponent
} from '../delete-confirmation/delete-confirmation.component';
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

    companies : Companies = {};

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

    update(books : any, companies : any) {

	let data = [];

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

    reload() {
	this.working.start();
	combineLatest({
	    books: this.booksService.get_list(),
	    companies: this.companyService.get_list(),
	}).subscribe(
	    e => {
		this.working.stop();
		this.update(e.books, e.companies);
	    }
	);
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

}

