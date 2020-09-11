import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { DeviationService } from '@services/deviation.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '../shared-service/shared-service';
import { LoginStoreService } from '@services/login-store.service';
import { Router } from '@angular/router';
import { UtilityService } from '@services/utility.service';
import { Location } from '@angular/common';
import { group } from 'console';

@Component({
  selector: 'app-shared-deviation',
  templateUrl: './shared-deviation.component.html',
  styleUrls: ['./shared-deviation.component.css']
})
export class SharedDeviationComponent implements OnInit, OnChanges {

  deviationsForm: FormGroup;
  modalForm: FormGroup;
  taskId: any;

  public labels: any = {};
  public autoDeviationArray: any = [];
  public manualDeviationMaster: any = [];
  public recommendationArray: any = [];
  public deviationLov: any = {};
  public creditRoles: any = [];
  public deviationList: any = [];

  public leadDetails: any;
  public leadId: number;
  public userId: string;
  public productCatoryId: number;
  public productCatoryCode: string = 'NC';
  public businessDivision: string;
  public roleId: number;
  public roleType: number;
  public hierarchy: number = 0;

  public selectDeviationId: number = 0;
  public findIndex;
  isOne: boolean;
  isZero: boolean;

  @Input() isSubmitToCredit: boolean;
  @Input() isDirty: boolean;

  public isSendBacktoCredit = false;
  locationIndex: string = '';

  constructor(private labelsData: LabelsService, private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService,
    private deviationService: DeviationService, private toasterService: ToasterService, private sharedService: SharedService,
    private loginStoreService: LoginStoreService, private router: Router, private utilityService: UtilityService, private location: Location) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      }
    );

    this.initForms();

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    let roles = roleAndUserDetails.roles;
    this.roleId = roles[0].roleId;
    this.roleType = roles[0].roleType;
    this.hierarchy = Number(roles[0].hierarchy);
    this.userId = roleAndUserDetails.userDetails.userId;

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadDetails = leadData['leadDetails'];
    this.leadId = leadData['leadId'];
    this.productCatoryCode = this.leadDetails['productCatCode'];
    this.businessDivision = this.leadDetails['bizDivision']
    this.productCatoryId = this.leadDetails['productId'];

    this.getDeviationMaster();

    let currentUrl = this.location.path();
    this.locationIndex = this.getLocationIndex(currentUrl);

    this.location.onUrlChange((url: string) => {
      this.locationIndex = this.getLocationIndex(url);
    });

    this.sharedService.taskId$.subscribe((id) => {
      this.taskId = id ? id : '';
    })

  }

  disableInputs() {
    (<FormArray>this.deviationsForm.get('manualDeviationFormArray'))
      .controls
      .forEach(control => {
        control.disable();
      })
  }

  disableAutoDeviation() {
    (<FormArray>this.deviationsForm.get('autoDeviationFormArray'))
      .controls
      .forEach(control => {
        control.disable();
      })
  }

  initForms() {

    this.deviationsForm = this._fb.group({
      approverRole: [''],
      isSaveEdit: false,
      enableApprove: false,
      enableSendBack: false,
      autoDeviationFormArray: this._fb.array([]),
      waiverNormsFormArray: this._fb.array([]),
      manualDeviationFormArray: this._fb.array([])
    })

    this.modalForm = this._fb.group({
      typeOfModal: [''],
      recommendation: ['', Validators.required]
    })
    this.sharedService.getFormValidation(this.deviationsForm)
  }

  ngOnChanges() {
    this.sharedService.updateDev$.subscribe((value: any) => {
      if (value && value.length > 0) {
        this.getDeviationDetails()
      }
    })
  }

  onApproveDeclineAction(value: any, obj) {

    const data = {
      "leadId": this.leadId,
      "userId": this.userId,
      "devRuleId": obj.value.devRuleId,
      "statusCode": value + '',
      "isRevert": false
    }

    this.deviationService.approveDeclineDeviation(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        let DevisionApproveDecline = res.ProcessVariables ? res.ProcessVariables : {};
        this.toasterService.showSuccess('Deviation status updated successfully', 'Deviation approval')
        this.getDeviationDetails()
      } else {
        this.toasterService.showError(res.ErrorMessage, 'Deviation approval')
      }
    })

  }

  getLocationIndex(url) {
    if (url.includes('dde')) {
      this.isSubmitToCredit = false;
      this.isSendBacktoCredit = false;
      return 'dde';
    } else if (url.includes('credit-decisions')) {
      this.isSubmitToCredit = true;
      this.isSendBacktoCredit = true;
      return 'credit-decisions';
    } else if (url.includes('deviation-dashboard')) {
      this.isSubmitToCredit = true;
      this.isSendBacktoCredit = false;
      return 'deviation-dashboard';
    }
  }

  getDeviationMaster() {

    const data = {
      "bizDivId": this.businessDivision,
      "prodCatCode": this.productCatoryCode
    };

    this.deviationService.getDeviationsMaster(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

        this.creditRoles = res.ProcessVariables.creditRoles ? res.ProcessVariables.creditRoles : [];
        this.manualDeviationMaster = res.ProcessVariables.deviations ? res.ProcessVariables.deviations : [];

        if (res.ProcessVariables.creditRoles && res.ProcessVariables.creditRoles.length > 0) {
          let creditRoleArray = [];
          let conditionalArray = [];

          this.creditRoles.map((data: any) => {

            creditRoleArray.push({
              key: data.id,
              value: data.name,
              hierarchy: data.hierarchy
            })
            if (data.id !== this.roleId) {
              conditionalArray.push({
                key: data.id,
                value: data.name,
                hierarchy: data.hierarchy
              })
            }
            return data
          })
          this.deviationLov.approverRole = conditionalArray;
          this.deviationLov.approvalLevel = this.isSubmitToCredit ? creditRoleArray : conditionalArray;
        }
        if (res.ProcessVariables.deviations && res.ProcessVariables.deviations.length > 0) {

          let deviationArray = [];

          this.manualDeviationMaster.map((data: any) => {
            deviationArray.push({
              key: data.dev_code,
              value: data.short_dev_desc
            })
            return data
          })
          this.deviationLov.deviation = deviationArray;
        }
        this.getDeviationDetails();

      } else {
        this.toasterService.showError(res.ErrorMessage, 'Get Deviation Master')
      }
    }, err => {
      console.log('err', err)
      this.toasterService.showError(err, 'Get Deviation Master')
    })
  }

  onGetDeviationCode(event, i: number) {
    const formArray = (this.deviationsForm.get('manualDeviationFormArray') as FormArray);

    let item = this.deviationLov.deviation.find((element) => {
      return element.key === Number(event.target.value);
    })
    let obj = this.manualDeviationMaster.find((element) => {
      return element.dev_code === Number(event.target.value);
    })

    formArray.controls[i].patchValue({
      shortDeDesc: item.value,
      devDesc: obj.dev_desc
    })
  }

  onGetApprovalLevel(event, i: number) {
    const formArray = (this.deviationsForm.get('manualDeviationFormArray') as FormArray);

    let item = this.deviationLov.approvalLevel.find((element) => {
      return element.key === Number(event.target.value);
    })
    formArray.controls[i].patchValue({
      approverRoleName: item.value
    })
  }

  findDuplicate(name, p): boolean {
    let myArray = this.deviationsForm.controls.manualDeviationFormArray['controls'];
    let test = myArray.filter(data => data.controls.devCode.value == name && name != null)

    if (test.length > 1) {
      return true;
    } else {
      return false
    }
  }

  getManualDeviations() {
    return this._fb.group({
      approverRole: ['', Validators.required],
      approverRoleName: [''],
      approverRoles: [''],
      shortDeDesc: [''],
      devCode: ['', Validators.required],
      devDesc: [""],
      devRuleId: 0,
      type: 0,
      isManualDev: '1',
      hierarchy: [0],
      justification: ['', Validators.required],
      statusCode: [{ value: null, disabled: true }],
    });
  }

  addDeviationUnit() {
    const memberListForm = <FormArray>this.deviationsForm.controls['manualDeviationFormArray'];
    const add = memberListForm.value.length + 1;
    memberListForm.insert(add, this.getManualDeviations())
  }

  softDeleteDeviation(index: number, id) {
    this.findIndex = index;
    this.selectDeviationId = Number(id)
  }

  onPatchRecommendationModal(value: string) {
    this.modalForm.patchValue({
      typeOfModal: value
    })
  }

  removeDeviationIndex(id, i?: any) {
    const control = this.deviationsForm.controls.manualDeviationFormArray as FormArray;

    if (id && id !== 0) {

      this.deviationService.getDeleteDeviation(id).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess('Delete Devision Successfully', 'Delete Deviation');
          this.getDeviationDetails();
        } else {
          this.toasterService.showError(res.ErrorMessage, 'Delete Deviation')
        }
      })
    } else {
      if (control.controls.length > 0) {
        control.removeAt(i);
      }
    }
  }

  getDeviationDetails() {
    this.deviationService.getDeviationsDetails(this.leadId).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables && res.ProcessVariables.error.code === '0') {
        if (res.ProcessVariables.deviation && res.ProcessVariables.deviation.length > 0) {
          this.autoDeviationArray = res.ProcessVariables.deviation ? res.ProcessVariables.deviation : [];
          this.recommendationArray = res.ProcessVariables.recommendation ? res.ProcessVariables.recommendation : [];
          this.deviationsForm.patchValue({
            enableApprove: res.ProcessVariables.enableApprove ? res.ProcessVariables.enableApprove : false,
            enableSendBack: res.ProcessVariables.enableSendBack ? res.ProcessVariables.enableSendBack : false,
          })
          this.onPatchFormArrayValue(this.autoDeviationArray)
        }
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Deviation Details')
      }
    }, err => {
      console.log('err', err)
      this.toasterService.showError(err, 'Get Deviation Details')
    })
  }

  getTrigurePolicy() {
    const data = {
      leadId: this.leadId,
      userId: this.userId
    }

    this.deviationService.autoDeviationDetails(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === "0") {
        this.getDeviationDetails();
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Auto Deviation')
      }
    }, err => {
      this.toasterService.showError(err, 'Auto Deviation')
    })
  }

  getTriggerWaiverNorms() {

    const data = {
      leadId: this.leadId,
      userId: this.userId,
      productCategory: this.productCatoryCode
    }

    this.deviationService.getTriggerWaiverNorms(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === "0") {
        this.getDeviationDetails();
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Waiver Norms')
      }
    }, err => {
      this.toasterService.showError(err, 'Waiver Norms')
    })

  }

  onPatchFormArrayValue(array) {

    let autoDeviationFormArray = (this.deviationsForm.get('autoDeviationFormArray') as FormArray);

    let manualDiviationFormArray = (this.deviationsForm.get('manualDeviationFormArray') as FormArray);

    let waiverNormsFormArray = (this.deviationsForm.get('waiverNormsFormArray') as FormArray);

    manualDiviationFormArray.controls = [];
    autoDeviationFormArray.controls = [];
    waiverNormsFormArray.controls = [];

    let typeofRole;
    let splitData = [];

    array.map((data: any) => {

      let approverRole = data.approverRoles && data.approverRoles !== "undefined" ? data.approverRoles : data.approverRole ? data.approverRole : '';

      splitData = approverRole.split('|')

      splitData.find((role: any) => {
        typeofRole = this.creditRoles.find((res: any) => {
          if (Number(role) === res.id) {
            return res
          }
        })
        return typeofRole;
      })

      let type = typeofRole ? Number(typeofRole.type) : 0;
      let hierarchy = typeofRole ? typeofRole.hierarchy : 0;

      if (data.isWaiverNormsDev !== null && data.isWaiverNormsDev) {

        waiverNormsFormArray.push(
          this._fb.group({
            approverRole: data.approverRole,
            approverRoleName: data.approverRoleName,
            devCode: data.devCode,
            devDesc: data.devDesc,
            type: type,
            devRuleId: data.devRuleId,
            isManualDev: data.isManualDev,
            hierarchy: hierarchy,
            isWaiverNormsDev: data.isWaiverNormsDev,
            justification: data.justification,
            shortDeDesc: data.short_dev_desc,
            statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= (this.hierarchy)) }]
          }))
      } else if (data.isWaiverNormsDev === null || data.isWaiverNormsDev === false) {
        if (data.isManualDev === '1') {

          manualDiviationFormArray.push(
            this._fb.group({
              approverRole: data.approverRole,
              approverRoleName: data.approverRoleName,
              devCode: data.devCode,
              devDesc: data.devDesc,
              type: type,
              devRuleId: data.devRuleId,
              isManualDev: data.isManualDev,
              hierarchy: hierarchy,
              justification: data.justification,
              isWaiverNormsDev: data.isWaiverNormsDev,
              shortDeDesc: data.short_dev_desc,
              statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= (this.hierarchy)) }]
            }))
        } else if (data.isManualDev === '0') {
          autoDeviationFormArray.push(
            this._fb.group({
              approverRole: data.approverRole,
              approverRoleName: data.approverRoleName,
              devCode: data.devCode,
              devDesc: data.devDesc,
              devRuleId: data.devRuleId,
              isManualDev: data.isManualDev,
              shortDeDesc: data.short_dev_desc,
              type: type,
              isWaiverNormsDev: data.isWaiverNormsDev,
              hierarchy: hierarchy,
              justification: data.justification,
              statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= this.hierarchy) }]
            }))
        }
      }

      if (this.locationIndex === 'credit-decisions') {
        if (localStorage.getItem('salesResponse') === 'false' || localStorage.getItem('is_pred_done') === 'true') {
          this.deviationsForm.disable();
        }

        if (localStorage.getItem('salesResponse') === 'true' && localStorage.getItem('is_pred_done') === 'false' &&
          localStorage.getItem('isPreDisbursement') === 'false') {
          this.isSendBacktoCredit = true;
          this.isZero = true;

          let autoDeviationFormArray = (this.deviationsForm.get('autoDeviationFormArray') as FormArray);

          let manualDiviationFormArray = (this.deviationsForm.get('manualDeviationFormArray') as FormArray);

          let waiverNormsFormArray = (this.deviationsForm.get('waiverNormsFormArray') as FormArray);

          setTimeout(() => {
            this.disableInputs();
            this.disableAutoDeviation()
          })

        }

        if (localStorage.getItem('salesResponse') === 'true' && localStorage.getItem('is_pred_done') === 'false' &&
          localStorage.getItem('isPreDisbursement') === 'true') {
          this.isZero = false;
          this.deviationsForm.disable();
        }

      }

    })

    this.deviationsForm.patchValue({
      isSaveEdit: true
    })

    this.sharedService.getFormValidation(this.deviationsForm)

  }

  ReferDeviation() {

    if (this.modalForm.valid) {

      let data = {};

      if (this.modalForm.controls['typeOfModal'].value === 'Recommendation') {

        if (this.locationIndex === 'dde') {
          data = {
            "leadId": this.leadId,
            "userId": this.userId,
            "approverRole": this.deviationsForm.controls['approverRole'].value,
            "recommendation": this.modalForm.controls['recommendation'].value,
            "taskId": this.taskId,
            "isDDE": true
          }
        } else if (this.locationIndex === 'deviation-dashboard') {
          data = {
            "leadId": this.leadId,
            "userId": this.userId,
            "approverRole": this.deviationsForm.controls['approverRole'].value,
            "recommendation": this.modalForm.controls['recommendation'].value,
            "taskId": this.taskId,
            "isDeviation": true
          }
        } else if (this.locationIndex === 'credit-decisions') {
          data = {
            "leadId": this.leadId,
            "userId": this.userId,
            "approverRole": this.deviationsForm.controls['approverRole'].value,
            "recommendation": this.modalForm.controls['recommendation'].value,
            "taskId": this.taskId,
            "isCC": true
          }
        }

        this.deviationService.getReferNextLevel(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.router.navigate(['pages/dashboard'])
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Leads Refer Deviation')
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Leads Refer Deviation')
          }
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Refer Error')
        })

      } else if (this.modalForm.controls['typeOfModal'].value === 'ApproveDeviations') {

        data = {
          "leadId": this.leadId,
          "userId": this.userId,
          "recommendation": this.modalForm.controls['recommendation'].value
        }

        this.deviationService.approveDeviation(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Approve Deviation')
            this.router.navigateByUrl('/pages/dashboard')
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Approve Deviation Error')
          }
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Approve Error')
        })
      } else if (this.modalForm.controls['typeOfModal'].value === 'sendBackToCredit') {

        data = {
          "leadId": this.leadId,
          "userId": this.userId,
          "recommendation": this.modalForm.controls['recommendation'].value
        }

        this.deviationService.sendBackToCredit(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Send Back to Credit')
            this.router.navigate(['pages/dashboard'])
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Send Back to Credit')
          }
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Send Back to Credit Error')
        })
      }
    } else {
      this.utilityService.validateAllFormFields(this.modalForm)
      this.toasterService.showInfo('Please Select Recommend', 'Recommend')
    }
  }

}