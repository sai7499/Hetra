import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { DeviationService } from '@services/deviation.service';
import { ToasterService } from '@services/toaster.service';
import { ArrayType } from '@angular/compiler';
import { SharedService } from '../shared-service/shared-service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-shared-deviation',
  templateUrl: './shared-deviation.component.html',
  styleUrls: ['./shared-deviation.component.css']
})
export class SharedDeviationComponent implements OnInit, OnChanges {

  deviationsForm: FormGroup;
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

  @Input() isSubmitToCredit: boolean;
  @Input() isDirty: boolean;

  @Output() formDataOutput = new EventEmitter<ArrayType>();

  constructor(private labelsData: LabelsService, private _fb: FormBuilder, private createLeadDataService: CreateLeadDataService,
    private deviationService: DeviationService, private toasterService: ToasterService, private sharedService: SharedService,
    private loginStoreService: LoginStoreService) { }

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      },
      error => {
        console.log(error);
      }
    );

    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    let roles = roleAndUserDetails.roles;
    this.roleId = roles[0].roleId;
    this.userId = roleAndUserDetails.userDetails.userId;

    const leadData = this.createLeadDataService.getLeadSectionData();
    this.leadDetails = leadData['leadDetails'];
    this.leadId = leadData['leadId'];
    this.productCatoryCode = this.leadDetails['productCatCode'];
    this.businessDivision = this.leadDetails['bizDivision']
    this.productCatoryId = this.leadDetails['productId'];


    this.deviationsForm = this._fb.group({
      approverRole: [''],
      autoDeviationFormArray: this._fb.array([]),
      manualDeviationFormArray: this._fb.array([this.getManualDeviations()])
    })
    this.getDeviationMaster()
    this.sharedService.getFormValidation(this.deviationsForm)
    this.getTrigurePolicy()
  }

  ngOnChanges() {
    this.sharedService.updateDev$.subscribe((value: any) => {
      console.log('value', value)
      if (value && value.length > 0) {
        this.getTrigurePolicy()
      }
    })
  }

  onApproveDeclineAction(value: any, obj) {

    if (value !== 2) {

      const data = {
        "leadId": this.leadId,
        "userId": this.userId,
        "devRuleId": obj.value.devRuleId,
        "statusCode": value + ''
      }

      this.deviationsForm.controls["approverRole"].clearValidators();
      this.deviationsForm.controls["approverRole"].updateValueAndValidity();

      this.deviationService.approveDeclineDeviation(data).subscribe((res: any) => {
        console.log('eeds', res)
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

          let DevisionApproveDecline = res.ProcessVariables ? res.ProcessVariables : {}

          obj.patchValue({
            devRuleId: DevisionApproveDecline ? DevisionApproveDecline.devRuleId : obj.value.devRuleId,
            statusCode: DevisionApproveDecline ? DevisionApproveDecline.statusCode : value
          })
          this.toasterService.showSuccess((value === 1 ? 'Approve' : 'Decline') + 'Deviation Successfully', 'Status of Deviation')

        } else {
          this.toasterService.showError(res.ErrorMessage, 'Approve Decline Deviation')
          this.toasterService.showInfo('Please Select Approvel Role', 'Refer Deviation')
        }
      })

    } else if (value == 2) {
      this.deviationsForm.controls["approverRole"].setValidators([Validators.required]);
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
            creditRoleArray.push({
              key: data.id,
              value: data.name,
              hierarchy: data.hierarchy
            })
            return data
          })
          this.deviationLov.approvalLevel = creditRoleArray;
        }

        if (res.ProcessVariables.deviations && res.ProcessVariables.deviations.length > 0) {

          let deviationArray = []

          this.manualDeviationMaster.map((data: any) => {
            deviationArray.push({
              key: data.dev_code,
              value: data.dev_desc
            })
            return {
              key: data.dev_code,
              value: data.dev_desc
            }
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
    formArray.controls[i].patchValue({
      devDesc: item.value
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
      devCode: ['', Validators.required],
      devDesc: [""],
      devRuleId: 0,
      justification: ['', Validators.required],
      approveAction: [{ value: 1, disabled: true }],
      referAction: [{ value: 2, disabled: true }],
      declineAction: [{ value: 0, disabled: true }],
      isManualDev: true,
      statusCode: null,
    });
  }

  addDeviationUnit(obj, i) {
    const memberListForm = <FormArray>this.deviationsForm.controls['manualDeviationFormArray'];
    const add = memberListForm.value.length + 1;
    memberListForm.insert(add, this.getManualDeviations())
  }

  removeDeviationIndex(id, i?: any) {
    const control = this.deviationsForm.controls.manualDeviationFormArray as FormArray;

    if (id && id !== 0) {

      this.deviationService.getDeleteDeviation(id).subscribe((res: any) => {
        console.log('Test', res)
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') { } else {
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
          console.log(this.autoDeviationArray)
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

    array.map((data: any) => {
      if (data.isManualDev === '1') {

        manualDiviationFormArray.controls = [];

        manualDiviationFormArray.push(
          this._fb.group({
            approverRole: data.approverRole,
            approverRoleName: data.approverRoleName,
            devCode: data.devCode,
            devDesc: data.devDesc,
            devRuleId: data.devRuleId,
            isManualDev: data.isManualDev,
            justification: data.justification,
            statusCode: data.statusCode,
            approveAction: [1],
            referAction: [2],
            declineAction: [0]
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
            justification: data.justification,
            statusCode: data.statusCode,
            approveAction: [1],
            referAction: [2],
            declineAction: [0]
          }))
      }
    })
    console.log('FormArray', this.deviationsForm)
  }

  formDataOutputMethod(event) {
    this.sharedService.getFormValidation(this.deviationsForm)
    this.formDataOutput.emit(this.deviationsForm.value)
  }

}
