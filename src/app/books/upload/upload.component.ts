import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BooksService } from '../books.service';

@Component({
    selector: 'upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

    file = "";
    filename = "";
    status = "idle";
    kind = "gnucash-sqlite"
    
    books_info : any = null;

    get length() {
	return Math.round(this.books_info.length / 1024) + " kB"
    }

    get time() {
	let d = new Date(this.books_info.time + "Z");
	return d;
    }

    mode : ProgressBarMode = "determinate";

    uploadProgress : number = 0;
    uploadSub : Subscription | null = null;

    constructor(
	private route : ActivatedRoute,
	private router : Router,
	private books : BooksService,
	private snackBar: MatSnackBar,
    ) {
    }

    update_books_info() {
	this.books.get_books_info(this.id).subscribe(
	    obs => this.books_info = obs
	);
    }

    id : string = "";

    ngOnInit() : void {}

    ngAfterViewInit(): void {
	this.route.params.subscribe(
	    params => {
		if (params["id"]) {
		    this.id = params["id"];
		    this.update_books_info();
		}
	    }
	);
    }

    calc(event : any) : number {
	let val = Math.round(100 * (event.loaded / event.total));
	return val;
    }

    onProgress(num : number) {
	this.uploadProgress = num;
	if (num >= 99) {
	    this.mode = 'indeterminate';
	    this.status = 'processing...';
	}
    }

    onComplete() {
	this.mode = 'determinate';
	this.status = 'complete';
	this.uploadSub = null;
	this.update_books_info();
	this.router.navigate(["/books/" + this.id + "/detail"]);
    }

    onError(err : any) {

	this.mode = 'determinate';
	this.status = 'complete';
	this.uploadSub = null;

	console.log(err);

	var errmsg = "";
	if (err.error) {
	    errmsg = err.error;
	} else {
	    errmsg = err.toString();
	}

	this.snackBar.open(errmsg, "dismiss", { duration: 5000 });

    }

    onFileSelected(event : any) {

	this.mode = 'determinate';
	this.status = 'uploading...';
        const file:File = event.target.files[0];
	
        if (file) {
	    
            this.filename = file.name;

	    this.uploadSub = this.books.upload(
		this.id, file, this.kind
	    ).subscribe({
		next: (obs : number) => { this.onProgress(obs); },
		error: (err : Error) => { this.onError(err); }, 
		complete: () => { this.onComplete(); },
	    });

	}
    }

    cancelUpload() {
	if (this.uploadSub) {
	    this.uploadSub.unsubscribe();
	    this.uploadSub = null;
	    this.status = "cancelled";
	    this.mode = "determinate";
	    this.uploadProgress = 0;
	}
    }

    reset() {
	this.uploadSub = null;
    }
    
}
