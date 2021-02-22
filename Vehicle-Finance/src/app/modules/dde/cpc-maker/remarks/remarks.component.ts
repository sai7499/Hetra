import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CpcRolesService } from '@services/cpc-roles.service';
import { LabelsService } from '@services/labels.service';
import { LoginStoreService } from '@services/login-store.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { ReappealService } from '@services/reappeal.service';
import { ToasterService } from '@services/toaster.service';
import { promise } from 'protractor';


@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {

  remarksForm: FormGroup;
  leadId: any;
  apiValue: any;
  formvalue: any;
  showModalApprove = false;
  showSendCredit = false;
  roleType: any;
  isDeclinedFlow: boolean;
  taskId: any;
  isDirty = false
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId = 'CDS001';
  udfGroupId = 'CDG001';
  initUDFValues: any;
  editedUDFValues: any;
  showRejectModal: boolean;
  rejectData: { title: string; product: string; productCode: string; flowStage: string; };
  roleAndUserDetails: any;
  labels: any;
  validationData: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cpcService: CpcRolesService,
    private toasterService: ToasterService,
    private objectComparisonService: ObjectComparisonService,
    private loginStoreService: LoginStoreService,
    private sharedService: SharedService,
    private reappealService: ReappealService,
    private labelService: LabelsService
  ) {
    this.sharedService.isDeclinedFlow.subscribe((res: any) => {
      console.log(res, ' declined flow');
      if (res) {
        this.isDeclinedFlow = res;
      }
    });
  }

  async ngOnInit() {

    this.labelService.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
    });

    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.sharedService.taskId$.subscribe((val: any) => (this.taskId = val ? val : ''));
    this.initForm();
    this.leadId = (await this.getLeadId()) as number;
    console.log('lead id', this.leadId);
    this.getRemarks();

  }

  initForm() {
    this.remarksForm = new FormGroup({
      remarks: new FormControl('', Validators.required)
    });
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  getRemarks() {
    const data = {
      leadId: this.leadId,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
        }
      ]
    };
    if (!this.isDeclinedFlow) {
      this.cpcService.getAssetRemarks(data).subscribe((res: any) => {
        const response = res;
        const processVaribles = response.ProcessVariables;
        if (response.Error == '0' && processVaribles.error.code == '0') {
          this.udfDetails = response.ProcessVariables.udfDetails;
          this.setRemarks(processVaribles);
        } else {
          this.toasterService.showError(response.error.message, '');
        }
      });
    } else {
      this.cpcService.getDeclientRemarks(data).subscribe((res: any) => {
        const response = res;
        const processVaribles = response.ProcessVariables;
        if (response.Error == '0' && processVaribles.error.code == '0') {
          this.udfDetails = response.ProcessVariables.udfDetails
          this.setRemarks(processVaribles);
        } else {
          this.toasterService.showError(response.error.message, '');
        }
      });
    }
  }

  setRemarks(values) {
    const formControl = this.remarksForm;
    formControl.patchValue({
      remarks: values.remarks
    });

    this.apiValue = this.remarksForm.getRawValue();

  }

  onBack() {
    if (this.roleType == '7') {
      this.router.navigateByUrl(`pages/cpc-maker/${this.leadId}/check-list`);
    } else if (this.roleType == '1') {
      this.router.navigateByUrl(`pages/credit-decisions/${this.leadId}/credit-condition`);
    }

  }

  onsave() {
    const formvalue = this.remarksForm.getRawValue();
    const remarks = formvalue.remarks;
    const udfData = this.userDefineForm?  JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    const data = {
      leadId: this.leadId,
      remarks: remarks,
      userId: localStorage.getItem('userId'),
      udfDetails : [{
        "udfGroupId": this.udfGroupId,
        //"udfScreenId": this.udfScreenId,
        "udfData": udfData
      }]
    };
    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false;
    if (this.remarksForm.invalid || isUDFInvalid) {
      this.toasterService.showError('Please enter any remarks', '');
    } else {
      if (!this.isDeclinedFlow) {
        this.cpcService.saveAssetRemarks(data).subscribe((res: any) => {
          const responce = res;
          const processVaribles = responce.ProcessVariables;
          if (responce.Error == '0' && processVaribles.error.code == '0') {
            this.toasterService.showSuccess('Record Saved Successfully', '');
            this.apiValue = this.remarksForm.getRawValue();
            this.initUDFValues = this.userDefineForm.udfData.getRawValue();
          } else {
            this.toasterService.showError(processVaribles.error.message, '');
          }
        });
      } else {
        this.cpcService.saveDeclientRemarks(data).subscribe((res: any) => {
          const responce = res;
          const processVaribles = responce.ProcessVariables;
          if (responce.Error == '0' && processVaribles.error.code == '0') {
            this.toasterService.showSuccess('Record Saved Successfully', '');
            this.apiValue = this.remarksForm.getRawValue();
            this.initUDFValues = this.userDefineForm.udfData.getRawValue();
          } else {
            this.toasterService.showError(processVaribles.error.message, '');
          }
        });
      }
    }
  }

  onApproval() {
    this.formvalue = this.remarksForm.getRawValue();
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.formvalue);

    this.editedUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)
    // console.log('isValueCheck', isValueCheck)
    // console.log(this.apiValue,'values', this.formvalue)
    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false;
    if (this.remarksForm.invalid || isUDFInvalid) {
      this.toasterService.showError('Save before Submitting', '');
      return;
    }
    if (!isValueCheck || !isUDFCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    this.showModalApprove = true;

  }

  callApproval() {
    if (!this.isDeclinedFlow) {
      const body = {
        leadId: this.leadId,
        userId: localStorage.getItem('userId'),
        isCPCMaker: false,
        isCPCChecker: false,
        sendBackToCredit: false,
        isSubmitCAD: true,
        taskId: this.taskId,
      };
      this.cpcService.assignCPCMaker(body).subscribe((res: any) => {
        // tslint:disable-next-line: triple-equals
        this.showModalApprove = false;
        if (res.ProcessVariables.error.code == '0') {

          this.toasterService.showSuccess('Approved Successfully', '');
          this.router.navigate([`pages/dashboard`]);

        } else {
          this.toasterService.showError(res.Processvariables.error.message, '');
        }
      });
    } else {
      return this.submitReappeal();
    }
  }

  onCancel() {
    this.showModalApprove = false;
  }

  onSendToCredit() {
    // this.formvalue = this.remarksForm.getRawValue();
    // const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.formvalue);
    // if (this.remarksForm.invalid) {
    //   this.toasterService.showError('Save before Submitting', '');
    //   return;
    // }
    // if (!isValueCheck) {
    //   this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
    //   return;
    // }

    this.showSendCredit = true;


  }


  callSendBackToCredit() {
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isCPCMaker: false,
      isCPCChecker: false,
      sendBackToCredit: true,
      taskId: this.taskId,
    };
    this.cpcService.getCPCRolesDetails(body).subscribe((res: any) => {
      // tslint:disable-next-line: triple-equals
      this.showSendCredit = false;
      if (res.ProcessVariables.error.code == '0') {

        this.toasterService.showSuccess('Record Send Back To Credit Successfully', '');

        this.router.navigate([`pages/dashboard`]);
      } else {
        this.toasterService.showError(res.Processvariables.error.message, '');
      }
    });
  }

  onCancelCredit() {
    this.showSendCredit = false;
  }
  onReappeal() {
    this.formvalue = this.remarksForm.getRawValue();
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.formvalue);
    this.editedUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)
    // console.log('isValueCheck', isValueCheck)
    // console.log(this.apiValue,'values', this.formvalue)
    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false;
    if (this.remarksForm.invalid || isUDFInvalid) {
      this.toasterService.showError('Please enter any remarks', '');
      return;
    }
    if (!isValueCheck || !isUDFCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    this.showModalApprove = true;
  }

  submitReappeal() {
    const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      isReAppeal: true,
      taskId: this.taskId
    };
    this.reappealService.saveReappealData(body).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
        this.toasterService.showSuccess('Succesfully reappealed', '');
        this.router.navigateByUrl(`pages/dashboard`);
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }

  onDecline(){
    let productCode = ''
    this.sharedService.productCatCode$.subscribe((value) => {
      productCode = value;
    })
    const productId = productCode || '';
    this.showRejectModal = true;
    this.rejectData = {
      title: 'Select Reject Reason',
      product: '',
      productCode: productId,
      flowStage: '85'
    }
    
  }

  onOkay(reasonData) {
  const body = {
      leadId: this.leadId,
      userId: localStorage.getItem('userId'),
      taskId : this.taskId,
      isDeclineReject : true,
      rejectReason: reasonData['reason'].reasonCode
    };
    this.cpcService.getRejectRemarks(body).subscribe((res: any) => {
      console.log(res);
      if (res && res.ProcessVariables.error.code === '0') {
        this.toasterService.showSuccess('Record Rejected successfully!', '')
        this.router.navigateByUrl(`/pages/dashboard`);
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '')
      }
    });
  }

  onCancelReject() {
    this.showRejectModal = false;
  }

 

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value);
    if(value.event === 'init'){
      this.initUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    }
  }

}
