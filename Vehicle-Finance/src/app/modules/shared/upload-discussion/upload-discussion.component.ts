import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-upload-discussion',
    templateUrl: './upload-discussion.component.html',
    styleUrls: ['./upload-discussion.component.css']

})
export class UploadDiscussionComponent {

    @Input() showUpload: boolean;
    @Output() cancel = new EventEmitter();
    @Output() save = new EventEmitter();
    @Input() details;

    onCancel() {
        this.showUpload = false;
        this.cancel.emit();
    }

    onSave() {
        this.save.emit();
    }

}
