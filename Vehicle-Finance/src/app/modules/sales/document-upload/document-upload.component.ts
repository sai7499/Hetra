import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentUploadService } from '@services/document-upload.service';
import { ToasterService } from '@services/toaster.service';

@Component({
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {

  constructor(private aRoute: ActivatedRoute,
              private router: Router,
              private doucmentUploadService: DocumentUploadService,
              private toStarService: ToasterService) {

  }
  leadId;
  isModelShow = false;
  errorMessage: string;
  ngOnInit() {
    this.aRoute.parent.params.subscribe(val => this.leadId = val.leadId);
  }

  submitToCredit() {
    const data = {
      userId: localStorage.getItem('userId'),
      leadId: Number(this.leadId)
    };
    console.log('submit call');
    this.doucmentUploadService.submitToCredit(data).subscribe(
      response => {
        if (response['Error'] && response['Error'] == 0
          && response['ProcessVariables'].error['code'] == 0) {
          this.errorMessage = 'Lead is submitted to Credit sucessfully';
          this.isModelShow = true;
        } else{
          this.toStarService.showError(response['ProcessVariables'].error['message'],"Submit To Credit")
        }
      }
    );
  }

  navigateToDashBoard() {
    this.isModelShow = false;
    this.router.navigateByUrl(`/pages/dashboard/leads-section/leads`);

  }

  onUploadFile(event: any) {

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const maxFileSize = 1024 * 1024 * 2;
      if (file.size < maxFileSize) {
        // this.imageChangedEvent = event;
        // form.patchValue({
        //   isImageCropped: true
        // })
      } else {
        this.toStarService.showError('File size is exceeded..., File Size Should be 2MB', '');
      }
    }
  }

}
