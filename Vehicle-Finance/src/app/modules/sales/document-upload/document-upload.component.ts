import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentUploadService } from '@services/document-upload.service';
import { ToasterService } from '@services/toaster.service';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { LabelsService } from '@services/labels.service';

@Component({
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.css'],
})
export class DocumentUploadComponent implements OnInit {

  isLoan360: boolean;
  taskId: any;
  showModal : boolean;
  modalDetails: any;
  modalButtons: any;

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private doucmentUploadService: DocumentUploadService,
    private toStarService: ToasterService,
    private loanViewService: LoanViewService,
    private sharedService: SharedService,
    private labelsData: LabelsService,
  ) {}
  leadId;
  isModelShow = false;
  errorMessage: string;
  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.aRoute.parent.params.subscribe((val) => (this.leadId = val.leadId));
    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    this.labelsData.getModalDetails().subscribe((data)=>{
      const details = data.afterEligibility.submitToCredit;
      this.modalDetails = details.modalDetails,
      this.modalButtons = details.modalButtons

    })
  }

  submitToCredit() {
    const data = {
      userId: localStorage.getItem('userId'),
      leadId: Number(this.leadId),
      taskId: this.taskId
    };
    console.log('submit call');
    this.doucmentUploadService.submitToCredit(data).subscribe((response) => {
      if (
        response['Error'] &&
        response['Error'] == 0 &&
        response['ProcessVariables'].error['code'] == 0
      ) {
        this.errorMessage = 'Lead is submitted to credit successfully';
        this.isModelShow = true;
      } else {
        this.toStarService.showError(
          response['ProcessVariables'].error['message'],
          'Submit To Credit'
        );
      }
    });
  }

  navigateToDashBoard() {
    this.isModelShow = false;
    this.router.navigateByUrl(`/pages/dashboard`);
  }
}
