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
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { LoginStoreService } from '@services/login-store.service';

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
  statusMsg = 'Please select one';
  isChecked: boolean = false;
  showModal: boolean = false;
  idProofValues: any = [];
  applicantList: any = [];
  leadSectioData: any;
  chequeCollctedBy: string;
  applicantArray: any = [];
  disburseDate: Date;
  minHandoverDate: Date;
  isInvalidChequeNum: boolean = false;
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId = '';
  udfGroupId = 'CTG001';
  toDayDate = new Date();
  isSales: boolean;
  isCPC = false;
  statusHistory = [];

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private chequeTrackingService: ChequeTrackingService,
    private sharedService: SharedService,
    private applicantStoreService: ApplicantDataStoreService,
    private createLeadDataService: CreateLeadDataService,
    private loginStoreService: LoginStoreService,
  ) {
    this.toDayDate = this.utilityService.setTimeForDates(this.toDayDate)
  }

  async ngOnInit() {

    this.initForm()

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getLOV();


    this.leadId = (await this.getLeadId()) as number;
    const roles = this.loginStoreService.getRolesAndUserDetails();
    this.activatedRoute.params.subscribe((params) => {
      if (roles) {
        this.isSales = roles.roles[0].roleType === 1;
      }
    })

    console.log('leadid', this.leadId)
    this.getApplicantDetails()
    // this.sharedService.loanNumber$.subscribe((loanNumber) => {
    //   console.log('loanNumber', loanNumber)
    //   this.loanNumber = loanNumber
    // })
    this.getChequeTrckingData();
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.sales.chequeTrackingSales;

    })
  }
  initForm() {
    this.chequeForm = new FormGroup({
      //details: new FormArray([]),
      chequeNum: new FormControl(''),
      chequeDate: new FormControl(''),
      // statusUpdatedOn: new FormControl(''),
      status: new FormControl('', Validators.required),
      statusUpdatedOn: new FormControl(''),
      remarks: new FormControl(''),
      chequeCollectedBy: new FormControl(''),
      idProof: new FormControl('')
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

  getApplicantDetails() {
    if (this.leadId) {
      const gotLeadData = this.activatedRoute.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        this.createLeadDataService.setLeadSectionData(leadData);
      }
    }
    this.leadSectioData = this.createLeadDataService.getLeadSectionData();
    this.applicantArray = this.leadSectioData['applicantDetails']

    this.applicantArray.forEach((val) => {
      const keyValue = {
        key: val.applicantId,
        value: val.fullName
      }
      this.applicantList.push(keyValue)
    })

  }

  getLOV() {

    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      console.log('lov', this.LOV)
    });
    this.getDocumentLov();
  }

  getDocumentLov() {
    const documentLov = this.commomLovService.getDocumentCategories()
    console.log('documentLov', documentLov)
    let idProofLov = documentLov.find((data: any) => {
      if (data.code == 70) {
        return data;
      }
    })
    idProofLov = idProofLov.subcategories.find((data: any) => {
      if (data.code == 12) {
        return data;
      }
    })
    //console.log('idProofLov', idProofLov['docList'])
    const idProofValues = idProofLov['docList']
    idProofValues.forEach((val) => {
      const keyValue = {
        key: val.code,
        value: val.desc
      }
      this.idProofValues.push(keyValue)
    })


  }
  getChequeTrckingData() {

  let getDataId = this.sharedService.getDataIds();
  console.log('getDataId', getDataId)
    let data = {}
    if(this.isSales){
      data = {
        leadId: this.leadId,
        "udfDetails": [
          {
            "udfGroupId": this.udfGroupId,
          }
        ]
  
      }
    }else{
      data = {
        trancheId : getDataId.trancheId,
        disbId : getDataId.disbId,
        taskId : getDataId.taskId,
        "udfDetails": [
          {
            "udfGroupId": this.udfGroupId,
          }
        ]
  
      }
    }

    this.chequeTrackingService.getChequeTracking(data).subscribe((res) => {
      if (res['ProcessVariables'].error.code == '0') {
        const data = res['ProcessVariables'].chequeData;
        const disbDate = res['ProcessVariables'].disbDate
        //this.addUnit(data)
        this.disburseDate = this.utilityService.getDateFromString(disbDate);
        this.statusHistory = res['ProcessVariables'].chequeStatusList || [];
        console.log('this.disburseDate', this.disburseDate)
        // data.map((element)=>{
        //   if(element.chequeNum.length !==6){

        //   }
        // })
        this.udfDetails = res['ProcessVariables'].udfDetails;
        setTimeout(() => {
          this.chequeData = data;
        })

      } else {
        this.toasterService.showError(res['ProcessVariables'].error.message, '')
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

  onChangeCheque(event) {
    // const isValid=this.chequeForm.get('chequeNum').valid;
    // if(isValid){
    //   const value = Number(event)
    //   if(value === 0){
    //     this.isInvalidChequeNum = true;
    //     console.log('INVALID')
    //   }else{
    //     this.isInvalidChequeNum = false;
    //     console.log("Valid")
    //   }
    // }
    this.selectedData.chequeNum = event;
  }


  onChangeChequeCollected(event) {
    console.log('event', event)
    const value = event.target.value;
    let app = this.applicantArray.find((data) => {
      return Number(value) === data.applicantId
    })
    this.chequeCollctedBy = app.fullName;
  }

  onChequeDateChange(event) {
    // let date = new Date(event)
    console.log('date error', this.chequeForm.get('chequeDate'))
    const date = this.utilityService.getDateFormat(event);
    this.selectedData.chequeDate = date;
  }



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
      this.chequeForm.get('chequeCollectedBy').setValidators([Validators.required]);
      this.chequeForm.get('chequeCollectedBy').updateValueAndValidity();
      this.chequeForm.get('idProof').setValidators([Validators.required]);
      this.chequeForm.get('idProof').updateValueAndValidity();
      this.showStatusDate = true;
      this.chequeForm.get('statusUpdatedOn').setValue('');
      this.chequeForm.get('chequeCollectedBy').setValue('');
      this.chequeForm.get('idProof').setValue('');


    }
    else {
      this.chequeForm.get('statusUpdatedOn').clearValidators();
      this.chequeForm.get('statusUpdatedOn').updateValueAndValidity();
      this.chequeForm.get('chequeCollectedBy').clearValidators();
      this.chequeForm.get('chequeCollectedBy').updateValueAndValidity();
      this.chequeForm.get('idProof').clearValidators();
      this.chequeForm.get('idProof').updateValueAndValidity();
      //this.chequeData[this.index].statusUpdatedOn= '-'
      this.showStatusDate = false;

    }
  }
  forBranchReceived(value) {
    if (value == 'BRNCHRECEIVEDCHEQUESTS') {
      this.chequeForm.get('chequeNum').setValidators([Validators.required]);
      this.chequeForm.get('chequeNum').updateValueAndValidity();
      this.chequeForm.get('chequeDate').setValidators([Validators.required]);
      this.chequeForm.get('chequeDate').updateValueAndValidity();
      this.showChequeNum = true;
      this.chequeForm.get('chequeNum').setValue('')
      this.chequeForm.get('chequeDate').setValue('')
    }
    else {
      this.chequeForm.get('chequeNum').clearValidators();
      this.chequeForm.get('chequeNum').updateValueAndValidity();
      this.chequeForm.get('chequeDate').clearValidators();
      this.chequeForm.get('chequeDate').updateValueAndValidity();
      //this.chequeData[this.index].statusUpdatedOn= '-'
      this.showChequeNum = false;
    }
  }

  forOnHold(value) {
    if (value == 'ONHOLDCHEQUESTS') {
      this.chequeForm.get('remarks').setValidators([Validators.required]);
      this.chequeForm.get('remarks').updateValueAndValidity();
      this.showRemark = true;
      if (this.isSales) {
        this.selectedData.remarks = '-';
      }

      this.chequeForm.get('remarks').setValue('')
    }
    else {
      this.chequeForm.get('remarks').clearValidators();
      this.chequeForm.get('remarks').updateValueAndValidity();
      //this.chequeData[this.index].statusUpdatedOn= '-'
      this.showRemark = false;
    }
  }
  onGetChequeData(data, index, event?) {
    console.log(data, 'event', event, 'index', index)
    this.selectedData = data;

    if (this.isChecked && this.index === index) {
      if (this.selectedData.chequeStatus == "HANDEDOVERCHEQUESTS") {
        this.disableUpdate = true;
      } else {
        this.disableUpdate = false;
      }

      return;
    }
    this.isChecked = event.target.checked;
    if (this.isChecked) {
      this.disableUpdate = false;
      this.index = index;


      this.selectedData = data;
      this.chequeCollctedBy = this.selectedData.chequeCollectedByDesc;
      console.log('statusUpdaed', this.selectedData)
      const recieveDate = this.selectedData.chequeDate
      this.minHandoverDate = this.utilityService.getDateFromString(recieveDate || '')


      this.chequeForm.get('status').setValue('')
      this.showChequeNum = false;
      this.showRemark = false;
      this.showStatusDate = false;
      // if (this.selectedData.chequeStatus == "ONHOLDCHEQUESTS") {
      //   this.showRemark = true;
      // }
    }


    if (this.selectedData.chequeStatus == "HANDEDOVERCHEQUESTS") {
      this.showStatusDate = true;
      this.chequeForm.patchValue({
        status: this.selectedData.chequeStatus || '',
        statusUpdatedOn: this.utilityService.getDateFromString(this.selectedData.statusUpdatedOn) || '',
        chequeCollectedBy: this.selectedData.chequeCollectedBy || '',
        idProof: this.selectedData.idProof || ''
      })

      this.chequeForm.get('status').clearValidators();
      this.chequeForm.get('status').updateValueAndValidity();
      this.statusMsg = ''
      this.disableUpdate = true;
    } else if (this.selectedData.chequeStatus == "ONHOLDCHEQUESTS") {
      this.showRemark = true;
      this.chequeForm.get('status').setValidators([Validators.required]);
      this.chequeForm.get('status').updateValueAndValidity();
      this.chequeForm.patchValue({
        status: this.selectedData.chequeStatus || '',
        remarks: this.selectedData.remarks || ''
      })
      this.statusMsg = ''
      this.disableUpdate = false;
    } else if (this.selectedData.chequeStatus == "BRNCHRECEIVEDCHEQUESTS") {
      this.showChequeNum = true;
      this.chequeForm.get('status').setValidators([Validators.required]);
      this.chequeForm.get('status').updateValueAndValidity();
      this.chequeForm.patchValue({
        status: this.selectedData.chequeStatus || '',
        chequeNum: this.selectedData.chequeNum || '',
        chequeDate: this.utilityService.getDateFromString(this.selectedData.chequeDate) || ''
      })
      this.statusMsg = ''
      this.disableUpdate = false;
    } else {
      this.chequeForm.get('status').setValidators([Validators.required]);
      this.chequeForm.get('status').updateValueAndValidity();
      this.statusMsg = 'Status is required'
      this.disableUpdate = false;
    }
  }
  onRemarkValue(event) {
    //console.log('event', event)
    this.selectedData.remarks = event;
  }

  checkFormUpdate() {
    const value = this.chequeForm.value;
    console.log('value', value);
    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false
    if (this.chequeForm.invalid || isUDFInvalid) {
      this.isDirty = true;
      this.toasterService.showError('Please fill mandatory fields.',
        'Cheque Tracking')
      return;
    }
    this.showModal = true
  }
  onUpdate() {
    const value = this.chequeForm.value;
    console.log('value', this.chequeForm)
    if (!this.isSales) {
      this.selectedData = this.chequeData[0];
      this.isCPC = true;
    }

    // if (this.statusValue == 'BRNCHRECEIVEDCHEQUESTS') {
    //   const chequeNumValue=control.controls[this.index].get('chequeNum').value
    //   if (chequeNumValue == null ||chequeNumValue== undefined || chequeNumValue== '') {
    //     this.toasterService.showError( 'Please fill mandatory fields.',
    //     'Cheque Tracking')
    //     return;
    //   }

    // }

    const chequeData = {
      chequeAmt: this.selectedData.chequeAmt || '',
      chequeDate: this.selectedData.chequeDate || '',
      chequeNum: this.selectedData.chequeNum || '',
      chequeStatus: value.status || '',
      disbId: this.selectedData.disbId || '',
      favTo: this.selectedData.favTo || '',
      mode: this.selectedData.mode || '',
      payableTo: this.selectedData.payableTo || '',
      statusUpdatedOn: this.utilityService.getDateFormat(value.statusUpdatedOn) || '',
      trancheId: this.selectedData.trancheId || '',
      remarks: value.remarks || '',
      loanAccNo: this.selectedData.loanAccNo || '',
      idProof: value.idProof,
      chequeCollectedBy: value.chequeCollectedBy


    }
    const udfData = this.userDefineForm ? JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    const data = {
      leadId: this.leadId,
      isCPC: this.isCPC,
      chequeData: {
        ...chequeData
      },
      udfDetails: [{
        "udfGroupId": this.udfGroupId,
        //"udfScreenId": this.udfScreenId,
        "udfData": udfData
      }]
    }
    //return console.log('DATA', data);
    
    this.chequeTrackingService.saveUpdateChequeTracking(data).subscribe((res) => {

      if (res['ProcessVariables'].error.code == '0') {
        if(!this.isSales){
          this.toasterService.showSuccess('Disbursement Initiated Successfully',
          '')
          this.router.navigate([`/pages/dashboard`]);
          return;
        }
        this.toasterService.showSuccess('Record Updated Successfully',
          '')
        this.selectedData = {};
        this.chequeCollctedBy = ''
        this.statusMsg = ''
        this.index = null;
        this.getChequeTrckingData();
        this.chequeForm.get('status').setValue('')
        this.showRemark = false;
        this.showStatusDate = false;
        this.showChequeNum = false;
        this.disableUpdate = true;
        //this.router.navigate([`/pages/dashboard`]);
      }
      else {
        this.toasterService.showError(res['ProcessVariables'].error.message,
          '')
      }
      this.showModal = false;
    })

  }
  onBack() {
    this.router.navigate([`/pages/dashboard`]);
  }

  onNext() {
    this.router.navigateByUrl(`/pages/cheque-tracking/${this.leadId}/welcome-letter`);
  }

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value)
  }

}
