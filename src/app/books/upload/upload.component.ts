import { Component, AfterViewInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ProgressBarMode, MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BooksService, BookInfo } from '../books.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    imports: [MatButton, MatIcon, MatRadioGroup, FormsModule, MatRadioButton, MatProgressBar, DatePipe]
})
export class UploadComponent implements AfterViewInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private books = inject(BooksService);
    private snackBar = inject(MatSnackBar);


    file = "";
    filename = "";
    status = "idle";
    kind = "gnucash-sqlite"
    
    books_info : BookInfo | null = null;

    get length() {
	return Math.round(this.books_info!.length / 1024) + " kB"
    }

    get time() {
	const d = new Date(this.books_info!.time + "Z");
	return d;
    }

    mode : ProgressBarMode = "determinate";

    uploadProgress  = 0;
    uploadSub : Subscription | null = null;

    update_books_info() {
	this.books.get_books_info(this.id).subscribe(
	    obs => this.books_info = obs
	);
    }

    id  = "";

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

    calc(event : { loaded: number; total: number }) : number {
	const val = Math.round(100 * (event.loaded / event.total));
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

    onError(err : Error | { error?: string }) {

	this.mode = 'determinate';
	this.status = 'complete';
	this.uploadSub = null;

	console.log(err);

	const errmsg = ('error' in err && err.error) ? err.error : err.toString();

	this.snackBar.open(errmsg, "dismiss", { duration: 5000 });

    }

    onFileSelected(event : Event) {

	this.mode = 'determinate';
	this.status = 'uploading...';
        const file:File = (event.target as HTMLInputElement).files![0];
	
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
