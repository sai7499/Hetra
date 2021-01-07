import {
   Component,
   OnInit,
   Input,
   Output,
   EventEmitter } from '@angular/core';

@Component({
selector: 'app-lead-upload-discussion',
templateUrl: './lead-upload-discussion.component.html',
styleUrls: ['./lead-upload-discussion.component.css']
})
export class LeadUploadDiscussionComponent implements OnInit {

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


constructor() {}

ngOnInit() {

}

onCancel() {
  this.showUpload = false;
  this.cancel.emit();
}

onSave() {
  this.save.emit();
}
}