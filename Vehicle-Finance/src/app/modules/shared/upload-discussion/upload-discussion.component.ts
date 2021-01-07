import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

@Component({
    selector: 'app-upload-discussion',
    templateUrl: './upload-discussion.component.html',
    styleUrls: ['./upload-discussion.component.css']

})
export class UploadDiscussionComponent implements OnChanges {

    @Input() showUpload: boolean;
    @Output() cancel = new EventEmitter();
    @Output() save = new EventEmitter();
    @Input() details;

    itemsPerPage = '5';
    // pageNumber = 1;
    // currentPage = 1;
    // totalItems: any;
    // count = 1;
    // slicedArray: any;
    q;

    constructor() {
        if (window.screen.width > 768) {
          this.itemsPerPage = '5';
        } else if (window.screen.width <= 768) {
          this.itemsPerPage = '5';
        }
    }

    ngOnChanges() {
        // if(this.details) {
        //     this.slicedArray = this.details.slice(0, this.pageNumber * 5);
        //     this.totalItems = this.details.length;
        //     this.count = this.count = Number(this.details.length) * Number(5);
        // }
    }

    onCancel() {
        this.showUpload = false;
        this.cancel.emit();
    }

    onSave() {
        this.save.emit();
    }



}