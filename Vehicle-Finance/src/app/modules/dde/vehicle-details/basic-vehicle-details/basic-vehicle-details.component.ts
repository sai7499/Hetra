import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { LabelsService } from '@services/labels.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-basic-vehicle-details',
  templateUrl: './basic-vehicle-details.component.html',
  styleUrls: ['./basic-vehicle-details.component.css']
})
export class BasicVehicleDetailsComponent implements OnInit, OnDestroy {

  public leadData: any;
  public leadId: number;
  public label: any;
  public routerId: number;
  disableSaveBtn: boolean;

  public formValue: any;
  userDefineForm: any;

  public isDirty: boolean;
  public subscription: any;
  public unsubForm: any;
  udfScreenId = '1002';
  udfGroupId: number = 2000;
  udfDetails: any;

  productCatoryCode: string;

  constructor(private createLeadDataService: CreateLeadDataService, public vehicleDataStoreService: VehicleDataStoreService, private toasterService: ToasterService,
    private vehicleDetailService: VehicleDetailService, private utilityService: UtilityService, private router: Router,
    private activatedRoute: ActivatedRoute, private sharedService: SharedService, private labelsData: LabelsService,
    private toggleDdeService: ToggleDdeService,
    private loanViewService: LoanViewService) { }

  ngOnInit() {

    this.leadData = this.createLeadDataService.getLeadSectionData();
    this.leadId = this.leadData.leadId;
    let leadDetails = this.leadData['leadDetails']
    this.productCatoryCode = leadDetails['productCatCode'];

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
        return data
      },
        error => {
          console.log('error', error)
        });

    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
    })

    this.subscription = this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

    this.unsubForm = this.sharedService.userDefined$.subscribe((form: any) => {
      this.userDefineForm = form;
    })

    const operationType = this.toggleDdeService.getOperationType();
    if (operationType) {
      this.disableSaveBtn = true;
    }

    if (this.loanViewService.checkIsLoan360()) {
      this.disableSaveBtn = true;
    }
  }

  onSubmit() {

    if (this.formValue.valid && this.userDefineForm.udfData.valid) {

      if (this.formValue.value.isCheckDedpue === false) {
        this.toasterService.showError('Please check dedupe', 'Vehicle Detail')
        return
      }

      if (this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber && this.formValue.value.isVaildFinalAssetCost) {
        let data = this.formValue.value.vehicleFormArray[0];

        if (data && data.fcExpiryDate) {
          data.fcExpiryDate = data.fcExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.fcExpiryDate, 'DD/MM/YYYY') : ''
        }

        if (data.firFiled) {
          data.firFiled = data.firFiled === true ? '1' : '0';
        }

        if (data.onlineVerification) {
          data.onlineVerification = data.onlineVerification === true ? '1' : '0';
        }

        if (data.accidentDate) {
          data.accidentDate = data.accidentDate ? this.utilityService.convertDateTimeTOUTC(data.accidentDate, 'DD/MM/YYYY') : '';
        }

        if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC') {
          data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY');
          data.expectedNOCDate = data.expectedNOCDate ? this.utilityService.convertDateTimeTOUTC(data.expectedNOCDate, 'DD/MM/YYYY') : '';
        }

        data.invoiceDate = data.invoiceDate ? this.utilityService.convertDateTimeTOUTC(data.invoiceDate, 'DD/MM/YYYY') : '';
        data.fitnessDate = data.fitnessDate ? this.utilityService.convertDateTimeTOUTC(data.fitnessDate, 'DD/MM/YYYY') : '';
        data.permitExpiryDate = data.permitExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.permitExpiryDate, 'DD/MM/YYYY') : '';
        data.vehicleRegDate = data.vehicleRegDate ? this.utilityService.convertDateTimeTOUTC(data.vehicleRegDate, 'DD/MM/YYYY') : '';
        data.insuranceValidity = data.insuranceValidity ? this.utilityService.convertDateTimeTOUTC(data.insuranceValidity, 'DD/MM/YYYY') : '';

        data.fsrdFundingReq = data.fsrdFundingReq === true ? '1' : '0';

        data.udfDetails = [{
          groupScreenID: this.udfGroupId,
          udfData: JSON.stringify(this.userDefineForm.udfData.getRawValue())
        }]


        this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {

          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Vehicle Detail');
            this.router.navigate(['pages/dde/' + this.leadId + '/vehicle-list']);
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Detail')
          }

        }, error => {
          console.log(error, 'error')
          this.toasterService.showError(error, 'Vehicle Detail')
        })

      } else {
        if (!this.formValue.value.isInvalidMobileNumber) {
          this.toasterService.showError('applicant and dealer of vehicle owner mobile number both are same', 'Invalid mobile no')
        } else if (!this.formValue.value.isValidPincode) {
          this.toasterService.showError('Please enter valid pincode', 'Invalid pincode')
        } else if (!(this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber)) {
          this.toasterService.showError('Please enter valid pincode and mobile no', 'Invalid pincode & mobile no')
        } else if (!this.formValue.value.isVaildFinalAssetCost) {
          this.toasterService.showError('Discount should not greater than Ex show room price', 'Invalid Final Asset Cost')
        }
      }

    } else {
      this.isDirty = true;
      this.utilityService.validateAllFormFields(this.formValue)
      this.toasterService.showError('Please enter all mandatory field', 'Vehicle Detail')
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.unsubForm.unsubscribe();
  }

}

