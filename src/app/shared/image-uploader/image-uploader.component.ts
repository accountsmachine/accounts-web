import { Component, Input, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ProgressBarMode, MatProgressBar } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

interface Uploader {
    upload(file: File): Observable<number>;
}

@Component({
    selector: 'image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss'],
    imports: [MatButton, MatIcon, MatProgressBar]
})
export class ImageUploaderComponent {
    private route = inject(ActivatedRoute);


    @Input()
    uploader!: Uploader;

    file = "";
    filename = "";
    status = "idle";

    uploaded = false;

    mode : ProgressBarMode = "determinate";

    _progress  = 0;

    @Input()
    get progress() { return this._progress; }
    set progress(num : number) {
	this._progress = num;
	if (num >= 99) {
	    this.mode = 'indeterminate';
	    this.status = 'processing...';
	}
    }

    uploadSub : Subscription | null = null;

    id  = "";

    private calc(event : { loaded: number; total: number }) : number {
	const val = Math.round(100 * (event.loaded / event.total));
	return val;
    }

    complete() {
    }

    onComplete() {
	this.mode = 'determinate';
	this.status = 'complete';
	this.uploadSub = null;
	this.complete();
    }

    onFileSelected(event : Event) {

	this.mode = 'determinate';
	this.status = 'uploading...';
        const file:File = (event.target as HTMLInputElement).files![0];
	
        if (file) {
	    
            this.filename = file.name;

	    this.uploadSub = this.uploader.upload(
		file
	    ).subscribe({
		next: (obs : number) => { this.progress = obs; },
		complete: () => { this.onComplete(); }
	    });

	}
    }

    cancelUpload() {
	if (this.uploadSub) {
	    this.uploadSub.unsubscribe();
	    this.uploadSub = null;
	    this.status = "cancelled";
	    this.mode = "determinate";
	    this.progress = 0;
	}
    }

    reset() {
	this.uploadSub = null;
    }
    
}

