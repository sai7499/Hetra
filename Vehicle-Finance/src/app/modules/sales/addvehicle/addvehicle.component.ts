import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LabelsService } from '@services/labels.service';
import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';


import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-addvehicle',
  templateUrl: './addvehicle.component.html',
  styleUrls: ['./addvehicle.component.css']
})
export class AddvehicleComponent implements OnInit {

  public label: any = {};
  public errorMsg: string;
  formValue: any;

  isDirty: boolean;
  routerId = 0;

  // process variable for save/update vehicle collaterals
  userId: number;
  leadId: number;

  productCatoryCode: string;

  isLoan360: boolean;

  constructor(
    private labelsData: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private vehicleDetailService: VehicleDetailService,
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private toasterService: ToasterService,
    private loanViewService: LoanViewService) { }

  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadId = leadData['leadId']
    let leadDetails = leadData['leadDetails']
    this.productCatoryCode = leadDetails['productCatCode'];

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          this.errorMsg = error;
        });

    this.activatedRoute.params.subscribe((value) => {
      this.routerId = value ? value.vehicleId : null;
    })

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

  }

  onFormSubmit() {

    if (this.formValue.valid === true) {
      let data = this.formValue.value.vehicleFormArray[0];

      // && this.formValue.value.isCheckDedpue

      if (this.formValue.value.isCheckDedpue === false) {
        this.toasterService.showError('Please click check dedupe', 'Vehicle Detail')
        return
      }

      if (this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber) {

        if (data && data.fcExpiryDate) {
          data.fcExpiryDate = data.fcExpiryDate ? this.utilityService.convertDateTimeTOUTC(data.fcExpiryDate, 'DD/MM/YYYY') : ''
        }

        if (data.firFiled) {
          data.firFiled = data.firFiled === true ? '1' : '0';
        }

        if (data.onlineVerification) {
          data.onlineVerification = data.onlineVerification === true ? '1' : '0';
        }

        if (data.insuranceValidity) {
          data.insuranceValidity = data.insuranceValidity ? this.utilityService.convertDateTimeTOUTC(data.insuranceValidity, 'DD/MM/YYYY') : '';
        }

        if (data.accidentDate) {
          data.accidentDate = data.accidentDate ? this.utilityService.convertDateTimeTOUTC(data.accidentDate, 'DD/MM/YYYY') : '';
        }

        if (data.invoiceDate) {
          data.invoiceDate = data.invoiceDate ? this.utilityService.convertDateTimeTOUTC(data.invoiceDate, 'DD/MM/YYYY') : '';
        }

        if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC') {
          data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY')
        }
        this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Vehicle List');
            this.router.navigate(['pages/sales/' + this.leadId + '/vehicle-list']);
          } else {
            this.toasterService.showError(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Details')
          }
        }, error => {
          console.log(error, 'error')
          this.toasterService.showError(error, 'Vehicle Details')
        })
      } else {
        if (!this.formValue.value.isInvalidMobileNumber) {
          this.toasterService.showError('applicant and dealer of vehicle owner mobile number both are same', 'Invalid mobile no')
        } else if (!this.formValue.value.isValidPincode) {
          this.toasterService.showError('Please enter valid pincode', 'Invalid pincode')
        } else if (!(this.formValue.value.isValidPincode && this.formValue.value.isInvalidMobileNumber)) {
          this.toasterService.showError('Please enter valid pincode and mobile no', 'Invalid pincode & mobile no')
        }
      }
    } else {
      this.isDirty = true;
      this.utilityService.validateAllFormFields(this.formValue)
      this.toasterService.showError('Please enter all mandatory field', 'Vehicle Detail')
    }
  }

}
