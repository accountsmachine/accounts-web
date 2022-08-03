import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
    )
    {
    }

    ngOnInit() {}

    configure() {
	this.summary!.paginator = this.paginator!;
	this.summary!.sort = this.sort!;
    }

    ngAfterViewInit(): void {

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

}

