import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { ChequeTrackingService } from '@services/cheque-tracking.service'
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { element } from 'protractor';

@Component({
  selector: 'app-cheque-tracking',
  templateUrl: './cheque-tracking.component.html',
  styleUrls: ['./cheque-tracking.component.css']
})
export class ChequeTrackingComponent implements OnInit {
  labels: any = {};
  validationData: any;
  LOV: any = [];
  statusLov = [];
  status: any;
  leadId: number;
  chequeData = [];
  selectedData: any;
  chequeForm: FormGroup;
  loanNumber: string;
  index: number;
  disableUpdate: boolean = true;
  showStatusDate: boolean;
  showChequeNum: boolean;
  showRemark: boolean;
  statusValue: string;

  showChequeNumError: boolean;
  isDirty = false;
  statusMsg ='Please select one'

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private chequeTrackingService: ChequeTrackingService,
    private sharedService: SharedService,
    private applicantStoreService: ApplicantDataStoreService
  ) { }

  async ngOnInit() {
    this.initForm()

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data.default;
        this.validationData = data.default.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getLOV();
    this.leadId = (await this.getLeadId()) as number;
    console.log('leadid', this.leadId)
    // this.sharedService.loanNumber$.subscribe((loanNumber) => {
    //   console.log('loanNumber', loanNumber)
    //   this.loanNumber = loanNumber
    // })
    this.getChequeTrckingData();

  }
  initForm() {
    this.chequeForm = new FormGroup({
      //details: new FormArray([]),
      chequeNum: new FormControl(''),
      // chequeDate: new FormControl(''),
      // statusUpdatedOn: new FormControl(''),
      status: new FormControl('', Validators.required),
      statusUpdatedOn: new FormControl(''),
      remarks: new FormControl('')
    })
  }

  getLeadId() {
    return new Promise((resolve) => {
      this.activatedRoute.parent.params.subscribe((value: any) => {
        if (!value.leadId) {
          resolve(null);
        }
        resolve(Number(value.leadId));
      });
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      console.log('lov', this.LOV)
    });
  }
  getChequeTrckingData() {
    const data = {
      leadId: this.leadId,

    }
    this.chequeTrackingService.getChequeTracking(data).subscribe((res) => {
      if (res['ProcessVariables'].error.code == '0') {
        const data = res['ProcessVariables'].chequeData;
        //this.addUnit(data)
        setTimeout(() => {
          this.chequeData = data;

        })


      }
    })
  }



  // addUnit(data) {
  //   const control = this.chequeForm.controls.details as FormArray;
  //   console.log(data, 'control', control)
  //   if (data && data.length > 0) {
  //     for (let i = 0; i < data.length; i++) {
  //       control.push(this.setChequeData(data[i]));
  //     }
  //   }
  // }

  // setChequeData(data) {
  // const chequeDate = data.chequeDate !== null ? new Date(
  //   this.utilityService.getDateFromString(data.chequeDate)
  // ) : '';
  // const statusUpdatedOn = data.statusUpdatedOn !== null ? new Date(
  //   this.utilityService.getDateFromString(data.statusUpdatedOn)
  // ) : '';
  // return new FormGroup({
  //   chequeNum: new FormControl(data.chequeNum),
  // chequeDate: new FormControl(chequeDate),
  // statusUpdatedOn: new FormControl(statusUpdatedOn ),
  //   });

  // }



  onChangeStatus(event) {

    const value = event.target.value;

    this.showChequeNum = false;
    this.showRemark = false;
    this.showStatusDate = false;
    const status = this.LOV.LOVS.chequeStatus
    const findValue = status.find(element => element.key == value)
    if (this.selectedData) {
      this.selectedData.chequeStatusDesc = findValue.value
    }
    this.forHandedOver(value);
    this.forBranchReceived(value);
    this.forOnHold(value);
  }

  forHandedOver(value) {
    if (value == 'HANDEDOVERCHEQUESTS') {
      this.chequeForm.get('statusUpdatedOn').setValidators([Validators.required]);
      this.chequeForm.get('statusUpdatedOn').updateValueAndValidity();
      this.showStatusDate = true;
      this.chequeForm.get('statusUpdatedOn').setValue('')

    }
    else {
      this.chequeForm.get('statusUpdatedOn').clearValidators();
      this.chequeForm.get('statusUpdatedOn').updateValueAndValidity();
      //this.chequeData[this.index].statusUpdatedOn= '-'
      this.showStatusDate = false;
    }
  }
  forBranchReceived(value) {
    if (value == 'BRNCHRECEIVEDCHEQUESTS') {
      this.chequeForm.get('chequeNum').setValidators([Validators.required]);
      this.chequeForm.get('chequeNum').updateValueAndValidity();
      this.showChequeNum = true;
      this.chequeForm.get('chequeNum').setValue('')
    }
    else {
      this.chequeForm.get('chequeNum').clearValidators();
      this.chequeForm.get('chequeNum').updateValueAndValidity();
      //this.chequeData[this.index].statusUpdatedOn= '-'
      this.showChequeNum = false;
    }
  }

  forOnHold(value) {
    if (value == 'ONHOLDCHEQUESTS') {
      this.chequeForm.get('remarks').setValidators([Validators.required]);
      this.chequeForm.get('remarks').updateValueAndValidity();
      this.showRemark = true;
      this.selectedData.remarks = '-';
      this.chequeForm.get('remarks').setValue('')
    }
    else {
      this.chequeForm.get('remarks').clearValidators();
      this.chequeForm.get('remarks').updateValueAndValidity();
      //this.chequeData[this.index].statusUpdatedOn= '-'
      this.showRemark = false;
    }
  }
  onGetChequeData(data, index, event) {

    this.disableUpdate = false;
    this.index = index;

    this.selectedData = data;
    console.log('statusUpdaed', this.selectedData)


    this.chequeForm.get('status').setValue('')
    this.showChequeNum = false;
    this.showRemark = false;
    this.showStatusDate = false;
    if (this.selectedData.chequeStatus == "ONHOLDCHEQUESTS") {
      this.showRemark = true;
    }
    if(this.selectedData.chequeStatus == "HANDEDOVERCHEQUESTS"){
      this.chequeForm.get('status').clearValidators();
      this.chequeForm.get('status').updateValueAndValidity();
      this.statusMsg=''
      this.disableUpdate = true;
    }else{
      this.chequeForm.get('status').setValidators([Validators.required]);
      this.chequeForm.get('status').updateValueAndValidity();
      this.statusMsg='Please Select One'
      this.disableUpdate = false;
    }


  }

  onChangeCheque(event) {
    this.selectedData.chequeNum = event;
  }

  onRemarkValue(event) {
    //console.log('event', event)
    this.selectedData.remarks = event;


  }
  onUpdate() {
    const value = this.chequeForm.value;
    console.log('value', this.chequeForm)

    // const control = this.chequeForm.controls.details as FormArray;
    if (this.chequeForm.invalid) {
      this.isDirty = true;
      this.toasterService.showError('Please fill mandatory fields.',
        'Cheque Tracking')
      return;
    }
    // if (this.statusValue == 'BRNCHRECEIVEDCHEQUESTS') {
    //   const chequeNumValue=control.controls[this.index].get('chequeNum').value
    //   if (chequeNumValue == null ||chequeNumValue== undefined || chequeNumValue== '') {
    //     this.toasterService.showError( 'Please fill mandatory fields.',
    //     'Cheque Tracking')
    //     return;
    //   }

    // }
    if (!this.selectedData) {
      return null
    }

    const chequeData = {
      chequeAmt: this.selectedData.chequeAmt || '',
      chequeDate: this.selectedData.chequeDate || '',
      chequeNum: this.selectedData.chequeNum || '',
      chequeStatus: value.status || '',
      disbId: this.selectedData.disbId || '',
      favTo: this.selectedData.favTo || '',
      mode: this.selectedData.mode || '',
      payableTo: this.selectedData.payableTo || '',
      statusUpdatedOn: this.utilityService.getDateFormat(value.statusUpdatedOn) || "",
      trancheId: this.selectedData.trancheId || '',
      remarks: value.remarks || '',
      loanAccNo: this.selectedData.loanAccNo || ''

    }

    const data = {
      leadId: this.leadId,
      chequeData: {
        ...chequeData
      }
    }
    this.chequeTrackingService.saveUpdateChequeTracking(data).subscribe((res) => {

      if (res['ProcessVariables'].error.code == '0') {
        this.toasterService.showSuccess('Record Updated Successfully',
          '')
        //this.router.navigate([`/pages/dashboard`]);
      }
      else {
        this.toasterService.showError(res['ProcessVariables'].error.message,
          '')
      }
    })

  }
  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }

}
