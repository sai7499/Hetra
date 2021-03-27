import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from '@services/applicant.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '../shared-service/shared-service';

@Component({
  selector: 'app-negative-list-modal',
  templateUrl: './negative-list-modal.component.html',
  styleUrls: ['./negative-list.modal.component.css'],
})
export class NegativeListModalComponent {
  @Input() showModal: boolean;
  @Input() modalInput: {
    isNLFound?: boolean;
    isNLTRFound?: boolean;
    nlRemarks?: string;
    nlTrRemarks?: string;
  };
  showModalNL: boolean;
  remarks: string;
  showRemarks: string;

  @Output() onButtonClick = new EventEmitter();
  rejectData: {
    title: string,
    product: any;
    flowStage: string;
    productCode: any;

  }
  @Input() applicantId;
  submitReject: boolean;
  userId: any;
  leadId: any;

  textarea = {
    "maxLength": {
      "rule": 1500
    }
  }

  @Input() udfScreenId: string;
  @Input() udfGroupId: string;

  constructor(private sharedService: SharedService,
    private applicantService: ApplicantService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private router: Router) {
    console.log(this.applicantId);

    // this.applicantId = this.activatedRoute.snapshot.params.applicantId;
    // this.applicantId = Number(this.activatedRoute.snapshot.parent.firstChild.params.applicantId);
    // console.log(this.activatedRoute.snapshot);

  }

  onClose() {
    this.showModal = false;
  }



  triggerClick(eventName: string) {
    this.onButtonClick.emit({
      name: eventName,
      remarks: this.remarks,
    });
  }


  // from this line
  reject() {

    let productCode = ''
    this.sharedService.productCatCode$.subscribe((value) => {

      productCode = value;
    })
    const productId = productCode || '';
    this.showModalNL = true;
    this.rejectData = {
      title: 'Select Reject Reason',
      product: '',
      productCode: productId,
      flowStage: null
    }

  }

  onOkay(reasonData) {

    this.rejectNL(reasonData['reason'].reasonCode);
  }

  onNLCancel() {
    this.showModalNL = false;
  }

  rejectNL(reasonCode?: string) {
    this.submitReject = true;
    // if(this.rejectReasonForm.valid){
    // processData["isRefer"]= true;
    let processData = {};
    //   processData['rejectReason'] =this.rejectReasonForm.value['rejectReason'];


    // processData["roleId"] =this.referForm.value['roleId'];
    processData["applicantId"] = this.applicantId;
    processData["isProceed"] = false;
    processData["reasonCode"] = reasonCode;
    this.applicantService.applicantNLUpdatingRemarks(processData).subscribe(res => {
      //  console.log(res);

      if (res['ProcessVariables'].error['code'] == 0) {
        this.toasterService.showSuccess("Record Rejected successfully!", '');
        this.router.navigate([`pages/dashboard`]);
      } else if (res['ProcessVariables'].error['code'] == "1") {
        this.toasterService.showError(res['ProcessVariables'].error['message'], '');

      } else if (res['Error'] == "1") {
        this.toasterService.showError(res['ErrorMessage'], '');
      }
    })
    // }else{
    //   return
    // }


  }
}
