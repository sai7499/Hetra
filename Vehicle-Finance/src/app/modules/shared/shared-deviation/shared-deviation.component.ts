import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
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
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-shared-deviation',
  templateUrl: './shared-deviation.component.html',
  styleUrls: ['./shared-deviation.component.css']
})
export class SharedDeviationComponent implements OnInit, OnChanges {

  deviationsForm: FormGroup;
  modalForm: FormGroup;
  taskId: any;

  @ViewChild('closebutton', { static: true }) closebutton;

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
  disableSaveBtn: boolean;
  isApprove: boolean;
  isWaiverTrigger: boolean;

  @Input() isSubmitToCredit: boolean;
  @Input() isDirty: boolean;

  public isSendBacktoCredit = false;
  locationIndex: string = '';

  isLoan360: boolean;

  deviationListRes: any;

  // userDefineFields
  udfScreenId = 'RCS002';
  udfGroupId: string = 'RCG001';
  jsonScreenId: any;

  isDeviationEmpty: boolean;
  isShowReferModal: boolean;

  constructor(private labelsData: LabelsService, private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService,
    private deviationService: DeviationService, private toasterService: ToasterService, private sharedService: SharedService,
    private loginStoreService: LoginStoreService, private router: Router, private utilityService: UtilityService, private location: Location,
    private toggleDdeService: ToggleDdeService,
    private loanViewService: LoanViewService) { }

  ngOnInit() {

    this.isLoan360 = this.loanViewService.checkIsLoan360();

    this.labelsData.getScreenId().subscribe((data: any) => {
      this.jsonScreenId = data.ScreenIDS;
    })

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
    this.disableSaveBtn = (this.roleType === 5) ? true : false;
    this.sharedService.getFormValidation(this.deviationsForm);

    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      }
    );
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
      isDuplicateDeviation: true,
      autoDeviationFormArray: this._fb.array([]),
      waiverNormsFormArray: this._fb.array([]),
      manualDeviationFormArray: this._fb.array([])
    })

    this.modalForm = this._fb.group({
      typeOfModal: [''],
      recommendation: ['', Validators.required]
    })
  }

  ngOnChanges() {
    this.sharedService.updateDev$.subscribe((value: any) => {
      if (value && value.length > 0) {
        this.getDeviationMaster()
      }
    })
  }

  onApproveDeclineAction(value: any, obj) {

    const data = {
      "leadId": this.leadId,
      "userId": this.userId,
      "devRuleId": obj.value.devRuleId,
      "statusCode": value + '',
      "isRevert": obj.value.statusCode === value ? true : false
    }

    this.deviationService.approveDeclineDeviation(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        let DevisionApproveDecline = res.ProcessVariables ? res.ProcessVariables : {};
        this.toasterService.showSuccess('Deviation status updated successfully', 'Deviation approval')
        this.getDeviationDetails()
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Deviation approval')
      }
    })

  }

  getLocationIndex(url) {
    if (url.includes('dde')) {
      this.isSubmitToCredit = false;
      this.isSendBacktoCredit = false;
      this.udfScreenId = this.jsonScreenId.DDE.triggerDeviaitonsDDE;
      return 'dde';
    } else if (url.includes('credit-decisions')) {
      this.isSubmitToCredit = true;
      this.isSendBacktoCredit = true;
      this.udfScreenId = this.jsonScreenId.creditDecision.deviaitonsListCreditDecision;
      return 'credit-decisions';
    } else if (url.includes('deviation-dashboard')) {
      this.isSubmitToCredit = true;
      this.isApprove = true;
      this.isSendBacktoCredit = false;
      this.udfScreenId = this.jsonScreenId.DeviationApproval.deviationsApproval;
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
        this.getDeviationDetails()
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Deviation Master')
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
    this.deviationsForm.patchValue({
      isDuplicateDeviation: true
    })
    let myArray = this.deviationsForm.controls.manualDeviationFormArray['controls'];
    let test = myArray.filter(data => data.controls.devCode.value == name.controls.devCode.value && name.controls.devCode.value != null)
    let role = myArray.filter(data => data.controls.approverRole.value == name.controls.approverRole.value && name.controls.approverRole.value != null)

    if (test.length > 1 && role.length > 1) {
      this.deviationsForm.patchValue({
        isDuplicateDeviation: false
      })
      return true;
    } else {
      this.deviationsForm.patchValue({
        isDuplicateDeviation: true
      })
      return false
    }
  }

  getManualDeviations() {
    return this._fb.group({
      approverRole: ['', Validators.required],
      approverRoleName: [''],
      approverRoles: [''],
      devCode: ['', Validators.required],
      devDesc: [""],
      otherMitigant: [''],
      rulesRemarks: [''],
      devRuleId: 0,
      type: 0,
      isManualDev: '1',
      hierarchy: [0],
      isSameRole: false,
      justification: ['', Validators.required],
      statusCode: [{ value: null, disabled: true }],
    });
  }

  addDeviationUnit() {
    const memberListForm = <FormArray>this.deviationsForm.controls['manualDeviationFormArray'];
    const add = memberListForm.value.length + 1;
    memberListForm.insert(add, this.getManualDeviations())
    this.isDeviationEmpty = false;
  }

  softDeleteDeviation(index: number, id) {
    this.findIndex = index;
    this.selectDeviationId = Number(id)
  }

  onPatchRecommendationModal(value: string) {
    this.modalForm.patchValue({
      typeOfModal: value
    })
    this.isShowReferModal = true;
  }

  removeDeviationIndex(id, i?: any) {
    const control = this.deviationsForm.controls.manualDeviationFormArray as FormArray;

    if (id && id !== 0) {

      this.deviationService.getDeleteDeviation(id).subscribe((res: any) => {
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          this.toasterService.showSuccess('Delete Devision Successfully', 'Delete Deviation');
          this.getDeviationDetails();
        } else {
          this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Delete Deviation')
        }
      })
    } else {
      if (control.controls.length > 0) {
        control.removeAt(i);

        this.isDeviationEmpty = control.controls.length === 0 ? true : false;
      }
    }
  }

  getDeviationDetails() {
    this.deviationService.getDeviationsDetails(this.leadId).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables && res.ProcessVariables.error.code === '0') {
        if (res.ProcessVariables.deviation && res.ProcessVariables.deviation.length > 0) {
          this.isDeviationEmpty = false;
          this.autoDeviationArray = res.ProcessVariables.deviation ? res.ProcessVariables.deviation : [];
          this.onPatchFormArrayValue(this.autoDeviationArray)
        } else {
          this.isDeviationEmpty = true;
        }
        this.recommendationArray = res.ProcessVariables.recommendation ? res.ProcessVariables.recommendation : [];
        this.deviationsForm.patchValue({
          enableApprove: res.ProcessVariables.enableApprove,
          enableSendBack: res.ProcessVariables.enableSendBack
        })
        if (this.locationIndex === 'dde' && res.ProcessVariables.enableApprove === true) {
          this.isApprove = true;
        }
      } else {
        this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Get Deviation Details')
      }
    }, err => {
      console.log('err', err)
      this.toasterService.showError(err, 'Get Deviation')
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

      splitData = approverRole.split('|');

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
            approverRoleName: typeofRole ? typeofRole.name ? typeofRole.name : '' : '',
            devCode: data.devCode,
            devDesc: data.devDesc,
            type: type,
            devRuleId: data.devRuleId,
            isManualDev: data.isManualDev,
            hierarchy: hierarchy,
            isWaiverNormsDev: data.isWaiverNormsDev,
            justification: data.justification,
            otherMitigant: data.other_mitigant,
            rulesRemarks: data.rulesRemarks,
            isSameRole: typeofRole ? typeofRole.id === this.roleId ? true : false : false,
            statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= this.hierarchy) }]
          }))
      } else if (data.isWaiverNormsDev === null || data.isWaiverNormsDev === false) {
        if (data.isManualDev === '1') {

          manualDiviationFormArray.push(
            this._fb.group({
              approverRole: data.approverRole,
              approverRoleName: typeofRole ? typeofRole.name ? typeofRole.name : '' : '',
              devCode: data.devCode,
              devDesc: data.devDesc,
              type: type,
              devRuleId: data.devRuleId,
              isManualDev: data.isManualDev,
              hierarchy: hierarchy,
              otherMitigant: data.other_mitigant,
              rulesRemarks: data.rulesRemarks,
              justification: data.justification,
              isWaiverNormsDev: data.isWaiverNormsDev,
              isSameRole: typeofRole ? typeofRole.id === this.roleId ? true : false : false,
              statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= this.hierarchy) }]
            }))
        } else if (data.isManualDev === '0') {
          autoDeviationFormArray.push(
            this._fb.group({
              approverRole: data.approverRole,
              approverRoleName: typeofRole ? typeofRole.name ? typeofRole.name : '' : '',
              devCode: data.devCode,
              devDesc: data.devDesc,
              devRuleId: data.devRuleId,
              isManualDev: data.isManualDev,
              type: type,
              isWaiverNormsDev: data.isWaiverNormsDev,
              otherMitigant: data.other_mitigant,
              rulesRemarks: data.rulesRemarks,
              hierarchy: hierarchy,
              justification: data.justification,
              isSameRole: typeofRole ? typeofRole.id === this.roleId ? true : false : false,
              statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= this.hierarchy) }]
            }))
        }
      }

      if (this.locationIndex === 'credit-decisions') {
        this.isApprove = false;

        if (localStorage.getItem('salesResponse') === 'false' || localStorage.getItem('is_pred_done') === 'true') {
          this.deviationsForm.disable();
        }

        if (localStorage.getItem('salesResponse') === 'true' && localStorage.getItem('is_pred_done') === 'false' &&
          localStorage.getItem('isPreDisbursement') === 'false') {
          this.isSendBacktoCredit = true;
          this.isWaiverTrigger = true;

          setTimeout(() => {
            this.disableInputs();
            this.disableAutoDeviation()
          })

        }

        if (localStorage.getItem('salesResponse') === 'true' && localStorage.getItem('is_pred_done') === 'false' &&
          localStorage.getItem('isPreDisbursement') === 'true') {
          this.isWaiverTrigger = false;
          this.deviationsForm.disable();
        }

      }

    })

    this.deviationsForm.patchValue({
      isSaveEdit: true
    })

    this.sharedService.getFormValidation(this.deviationsForm)
  }

  public ReferDeviation() {
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
          this.closebutton.nativeElement.click();
          setTimeout(() => {
            if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
              this.router.navigate(['pages/dashboard'])
              this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Leads Refer Deviation')
            } else {
              this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Leads Refer Deviation')
            }
          }, 1000)
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Refer Error')
        })

      } else if (this.modalForm.controls['typeOfModal'].value === 'ApproveDeviations') {

        data = {
          "leadId": this.leadId,
          "userId": this.userId,
          "recommendation": this.modalForm.controls['recommendation'].value,
          "taskId": this.taskId,
        }

        this.deviationService.approveDeviation(data).subscribe((res: any) => {
          this.closebutton.nativeElement.click();
          setTimeout(() => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Approve Deviation')
            this.router.navigateByUrl('/pages/dashboard')
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Approve Deviation Error')
          }
        }, 1000)
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Approve Error')
        })
      } else if (this.modalForm.controls['typeOfModal'].value === 'sendBackToCredit') {

        data = {
          "leadId": this.leadId,
          "userId": this.userId,
          "recommendation": this.modalForm.controls['recommendation'].value,
          "taskId": this.taskId
        }

        this.deviationService.sendBackToCredit(data).subscribe((res: any) => {
          this.closebutton.nativeElement.click();
          setTimeout(() => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Send Back to Credit')
            this.router.navigate(['pages/dashboard'])
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Send Back to Credit')
          }
        }, 1000)
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Send Back to Credit Error')
        })
      }
    } else {
      this.utilityService.validateAllFormFields(this.modalForm);
      this.toasterService.showInfo('Please Select Recommend', 'Recommend')
    }
  }

}
