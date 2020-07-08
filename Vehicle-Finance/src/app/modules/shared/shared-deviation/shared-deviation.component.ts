import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { DeviationService } from '@services/deviation.service';
import { ToasterService } from '@services/toaster.service';
import { ArrayType } from '@angular/compiler';
import { SharedService } from '../shared-service/shared-service';
import { LoginStoreService } from '@services/login-store.service';
import { Router } from '@angular/router';
import { UtilityService } from '@services/utility.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';

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
  public deviationLov: any = {};
  public creditRoles: any = [];

  public leadDetails: any;
  public leadId: number;
  public userId: string;
  public productCatoryId: number;
  public productCatoryCode: string = 'NC';
  public businessDivision: string;
  public roleId: number;
  public roleType: number;
  public hierarchy: any;
  public isRequired: string = 'Approver Level Required';

  public selectDeviationId: number = 0;
  public findIndex;

  @Input() isSubmitToCredit: boolean;
  @Input() isDirty: boolean;

  @Output() formDataOutput = new EventEmitter<ArrayType>();
  public isSendBacktoCredit: boolean;
  public result: number = 0;

  constructor(private labelsData: LabelsService, private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService,
    private deviationService: DeviationService, private toasterService: ToasterService, private sharedService: SharedService,
    private loginStoreService: LoginStoreService, private router: Router, private utilityService: UtilityService, private vehicleDataStoreService: VehicleDataStoreService) { }

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
    this.hierarchy = roles[0].hierarchy;
    this.userId = roleAndUserDetails.userDetails.userId;

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadDetails = leadData['leadDetails'];
    this.leadId = leadData['leadId'];
    this.productCatoryCode = this.leadDetails['productCatCode'];
    this.businessDivision = this.leadDetails['bizDivision']
    this.productCatoryId = this.leadDetails['productId'];

    this.getDeviationMaster();
    this.sharedService.getFormValidation(this.deviationsForm)
    this.getTrigurePolicy();

    this.sharedService.taskId$.subscribe((id) => {
      this.taskId = id ? id : '';
    })

  }

  initForms() {

    this.deviationsForm = this._fb.group({
      approverRole: [''],
      autoDeviationFormArray: this._fb.array([]),
      manualDeviationFormArray: this._fb.array([this.getManualDeviations()])
    })

    this.modalForm = this._fb.group({
      typeOfModal: [''],
      recommendation: ['', Validators.required]
    })

  }

  ngOnChanges() {
    this.sharedService.updateDev$.subscribe((value: any) => {
      if (value && value.length > 0) {
        this.getTrigurePolicy()
      }
    })
  }

  onApproveDeclineAction(value: any, obj) {

    const data = {
      "leadId": this.leadId,
      "userId": this.userId,
      "devRuleId": obj.value.devRuleId,
      "statusCode": value + '',
      "isRevert": Number(obj.value.statusCode) === value ? true : false,
    }

    this.deviationService.approveDeclineDeviation(data).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
        let DevisionApproveDecline = res.ProcessVariables ? res.ProcessVariables : {};
        this.toasterService.showSuccess((value === 1 ? 'Approve' : value === 2 ? 'Refer to Next Level' : 'Decline') + 'Deviation Successfully', 'Status of Deviation')
        this.getTrigurePolicy()
      } else {
        this.toasterService.showError(res.ErrorMessage, 'Approve Decline Deviation')
      }
    })

    setTimeout(() => {
      this.isApproveDeviation()
    })
  }

  isApproveDeviation() {
    for (let i = 0; i < this.deviationsForm.controls['autoDeviationFormArray'].value.length; i++) {
      if (this.deviationsForm.controls['autoDeviationFormArray'].value[i].statusCode === "0") {
        this.result = 0;
        this.isSendBacktoCredit = true;
        break;
      } else if (this.deviationsForm.controls['autoDeviationFormArray'].value[i].statusCode === "1") {
        this.result = 1;
        this.isSendBacktoCredit = false;
        break;
      }
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
          let creditRoleArray = []

          this.creditRoles.map((data: any) => {
            if (data.id !== this.roleId) {
              creditRoleArray.push({
                key: data.id,
                value: data.name,
                hierarchy: data.hierarchy
              })
            }
            return data
          })
          this.deviationLov.approvalLevel = creditRoleArray;
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
      shortDeDesc: [''],
      devCode: ['', Validators.required],
      devDesc: [""],
      devRuleId: 0,
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
          this.getTrigurePolicy()
          this.toasterService.showSuccess('Delete Devision Successfully', 'Delete Deviation')
        } else {
          this.toasterService.showError(res.ErrorMessage, 'Delete Deviation')
        }
      })
    } else {
      if (control.controls.length > 1) {
        control.removeAt(i);
      } else {
        this.toasterService.showInfo("Atleast One Row Required", 'Remove Deviation');
      }
    }
  }

  getTrigurePolicy() {
    this.deviationService.getDeviationsDetails(this.leadId).subscribe((res: any) => {
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

        if (res.ProcessVariables.deviation && res.ProcessVariables.deviation.length > 0) {
          this.autoDeviationArray = res.ProcessVariables.deviation ? res.ProcessVariables.deviation : [];
          this.onPatchFormArrayValue(this.autoDeviationArray)
          this.isApproveDeviation()
        }
        this.sharedService.getFormValidation(this.deviationsForm)
      } else {
        this.toasterService.showError(res.ErrorMessage, 'Get Deviation Details')
      }
    }, err => {
      console.log('err', err)
      this.toasterService.showError(err, 'Get Deviation Details')
    })
  }

  onPatchFormArrayValue(array) {

    const autoDeviationFormArray = (this.deviationsForm.get('autoDeviationFormArray') as FormArray);

    const manualDiviationFormArray = (this.deviationsForm.get('manualDeviationFormArray') as FormArray);

    manualDiviationFormArray.controls = [];
    autoDeviationFormArray.controls = [];

    array.map((data: any) => {

      let typeofRole = this.creditRoles.find((res: any) => {
        return Number(data.approverRole) === res.id;
      })

      let type = typeofRole ? Number(typeofRole.type) : 0;
      let hierarchy = typeofRole ? typeofRole.hierarchy + '' : '0';

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
            shortDeDesc: data.short_dev_desc,
            statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= this.hierarchy) }]
            // statusCode: [{ value: data.statusCode, disabled: (type !== this.roleType) ? true : false }]
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
            hierarchy: hierarchy,
            justification: data.justification,
            statusCode: [{ value: data.statusCode, disabled: !(type === this.roleType && hierarchy <= this.hierarchy) }]
          }))
      }
    })

    if (this.deviationsForm.get('manualDeviationFormArray')['controls'].length === 0) {
      manualDiviationFormArray.push(this.getManualDeviations())
    }
  }

  formDataOutputMethod(event) {
    this.sharedService.getFormValidation(this.deviationsForm)
    this.formDataOutput.emit(this.deviationsForm.value)
  }

  ReferDeviation() {

    if (this.modalForm.valid) {

      if (this.modalForm.controls['typeOfModal'].value === 'Recommendation') {
        const data = {
          "leadId": this.leadId,
          "userId": this.userId,
          "approverRole": this.deviationsForm.controls['approverRole'].value,
          "recommendation": this.modalForm.controls['recommendation'].value,
          "taskId": this.taskId
        }

        this.deviationService.getReferNextLevel(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.router.navigate(['pages/dashboard/deviation/deviation-with-branch'])
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Leads to ' + this.deviationsForm.controls['approverRole'].value + 'Deviation')
          } else {
            this.toasterService.showError(res.ErrorMessage, 'Refer Deviation Error')
          }
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Refer Error')
        })
      } else if (this.modalForm.controls['typeOfModal'].value === 'ApproveDeviations') {

        const data = {
          "leadId": this.leadId,
          "userId": this.userId,
          "recommendation": this.modalForm.controls['recommendation'].value
        }

        this.deviationService.approveDeviation(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Approve Deviation')
          } else {
            this.toasterService.showError(res.ErrorMessage, 'Approve Deviation Error')
          }
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Approve Error')
        })
      } else if (this.modalForm.controls['typeOfModal'].value === 'sendBackToCredit') {

        const data = {
          "leadId": this.leadId,
          "userId": this.userId,
          "recommendation": this.modalForm.controls['recommendation'].value
        }

        this.deviationService.sendBackToCredit(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess(res.ProcessVariables.error.message, 'Approve Deviation')
          } else {
            this.toasterService.showError(res.ErrorMessage, 'Approve Deviation Error')
          }
        }, err => {
          console.log('err', err)
          this.toasterService.showError(err, 'Approve Error')
        })
      }
    } else {
      this.utilityService.validateAllFormFields(this.modalForm)
      this.toasterService.showInfo('Please Select Recommend', 'Recommend')
    }
  }

}
