import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {

    @Input()
    get progress() { return this._progress; }

    @Input()
    uploader : any = {};

    file = "";
    filename = "";
    status = "idle";

    uploaded = false;

    mode : ProgressBarMode = "determinate";

    _progress : number = 0;

    set progress(num : number) {
	this._progress = num;
	if (num >= 99) {
	    this.mode = 'indeterminate';
	    this.status = 'processing...';
	}
    }

    uploadSub : Subscription | null = null;

    constructor(
	private route : ActivatedRoute,
    ) {
    }

    id : string = "";

    ngOnInit(): void {
    }

    private calc(event : any) : number {
	let val = Math.round(100 * (event.loaded / event.total));
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

    onFileSelected(event : any) {

	this.mode = 'determinate';
	this.status = 'uploading...';
        const file:File = event.target.files[0];
	
        if (file) {
	    
            this.filename = file.name;

	    let cmp = this;
	    
	    this.uploadSub = this.uploader.upload(
		file
	    ).subscribe({
		next(obs : number) { cmp.progress = obs; },
		complete() { cmp.onComplete(); }
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

