import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-upload-discussion',
    templateUrl: './upload-discussion.component.html',
    styleUrls: ['./upload-discussion.component.css']

})
export class UploadDiscussionComponent {

    @Input() showUpload: boolean;

    onCancel() {
        this.showUpload = false;
    }

}
