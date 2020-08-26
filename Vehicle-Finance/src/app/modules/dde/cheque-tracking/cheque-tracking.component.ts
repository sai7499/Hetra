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
  statusValue: string;
  showChequeNumError: boolean;
  isDirty = false

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
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getLOV();
    this.leadId = (await this.getLeadId()) as number;
    console.log('leadid', this.leadId)
    this.sharedService.loanNumber$.subscribe((loanNumber) => {
      console.log('loanNumber', loanNumber)
      this.loanNumber = loanNumber
    })
    console.log('loanNumber', this.loanNumber)
    this.getChequeTrckingData();

  }
  initForm() {
    this.chequeForm = new FormGroup({
      details: new FormArray([]),
      // chequeNum: new FormControl(''),
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
        this.addUnit(data)
        setTimeout(() => {
          this.chequeData = data;
          
        })
        

      }
    })
  }



  addUnit(data) {
    const control = this.chequeForm.controls.details as FormArray;
    console.log(data, 'control', control)
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        control.push(this.setChequeData(data[i]));
      }
    }
  }

  setChequeData(data) {
    const chequeDate = data.chequeDate !== null ? new Date(
      this.utilityService.getDateFromString(data.chequeDate)
    ) : '';
    const statusUpdatedOn = data.statusUpdatedOn !== null ? new Date(
      this.utilityService.getDateFromString(data.statusUpdatedOn)
    ) : '';
    return new FormGroup({
      chequeNum: new FormControl(data.chequeNum),
      // chequeDate: new FormControl(chequeDate),
      // statusUpdatedOn: new FormControl(statusUpdatedOn ),
    });

  }



  onChangeStatus(event) {

    const value = event.target.value;
    this.statusValue = value;
    const status = this.LOV.LOVS.chequeStatus
    const findValue = status.find(element => element.key == value)
    if (this.selectedData) {
      this.selectedData.chequeStatusDesc = findValue.value
    }
    if (value == 'HANDEDOVERCHEQUESTS') {
      this.chequeForm.get('statusUpdatedOn').setValidators([Validators.required]);
      this.chequeForm.get('statusUpdatedOn').updateValueAndValidity();
      this.showStatusDate = true;
    }
    else {
      this.chequeForm.get('statusUpdatedOn').clearValidators();
      this.chequeForm.get('statusUpdatedOn').updateValueAndValidity();
      this.chequeData[this.index].statusUpdatedOn= '-'
      this.showStatusDate = false;
    }
  }
  onGetChequeData(data, index, event) {
    this.disableUpdate = false;
    this.index = index;

    this.selectedData = data;
    console.log('statusUpdaed', this.selectedData)
    const control = this.chequeForm.controls.details as FormArray;

    this.selectedData.chequeNum = control.controls[index].value.chequeNum;

    this.chequeForm.get('status').setValue('')

  }

  onChangeCheque(i, event) {
    if (this.selectedData) {
      if (this.index == i) {
        this.selectedData.chequeNum = event;
      }
    }
  }

  updateStatusDate(event){
    this.chequeData[this.index].statusUpdatedOn=this.utilityService.getDateFormat(event)
  }
  onUpdate() {
    const value = this.chequeForm.value;
    console.log('value', value)

    const control = this.chequeForm.controls.details as FormArray;
    if (this.chequeForm.invalid) {
      console.log('valid', this.chequeForm)
      this.isDirty = true;
      this.toasterService.showError( 'Please fill mandatory fields.',
      'Cheque Tracking')
      return;
    }
    if (this.statusValue == 'BRNCHRECEIVEDCHEQUESTS') {
      if (control.controls[this.index].get('chequeNum').value == '' || undefined || null) {
        this.toasterService.showError( 'Please fill mandatory fields.',
        'Cheque Tracking')
        return;
      }

    }
    if (!this.selectedData) {
      return null
    }
  
    const chequeData = {
      chequeAmt: this.selectedData.chequeAmt,
      chequeDate: this.selectedData.chequeDate,
      chequeNum: this.selectedData.chequeNum,
      chequeStatus: value.status,
      disbId: this.selectedData.disbId,
      favTo: this.selectedData.favTo,
      mode: this.selectedData.mode,
      payableTo: this.selectedData.payableTo,
      statusUpdatedOn: this.utilityService.getDateFormat(value.statusUpdatedOn ) || "",
      trancheId: this.selectedData.trancheId,
      remarks: value.remarks

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
