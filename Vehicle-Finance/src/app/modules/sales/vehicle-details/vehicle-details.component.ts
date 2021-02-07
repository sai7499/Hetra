import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { CommonDataService } from '@services/common-data.service';
import { LabelsService } from '@services/labels.service';
import { LoanViewService } from '@services/loan-view.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailsComponent implements OnInit {

  leadId: any;
  isFemaleForNCV: boolean;
  applicantList: any = []

  public label: any;
  public errorMsg: string;
  formValue: any;
  userDefineForm: any;

  isDirty: boolean;
  routerId = '0';
  udfScreenId: string = '';
  udfGroupId: string = 'VLG002';
  udfDetails: any = [];

  // process variable for save/update vehicle collaterals
  userId: number;
  productCatoryCode: string;

  isLoan360: boolean;

  constructor(
    private applicantDataStoreService: ApplicantDataStoreService,
    private createLeadDataService: CreateLeadDataService,
    private commonDataService: CommonDataService,
    private toasterService: ToasterService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private labelsData: LabelsService,
    private router: Router,
    private vehicleDetailService: VehicleDetailService,
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private loanViewService: LoanViewService
  ) { }

  async ngOnInit() {
    this.leadId = (await this.getLeadId()) as string;
    this.applicantList = this.applicantDataStoreService.getApplicantList();

    this.isLoan360 = this.loanViewService.checkIsLoan360();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    if (leadData && leadData['vehicleCollateral']) {
      this.routerId = leadData['vehicleCollateral'].length > 0 ? leadData['vehicleCollateral'][0].collateralId : '0';
    }

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

        this.labelsData.getScreenId().subscribe((data) => {
          let udfScreenId = data.ScreenIDS;
    
          this.udfScreenId = udfScreenId.ADE.vehicleDetailADE ;
    
        })

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

    this.sharedService.userDefined$.subscribe((form: any) => {
      this.userDefineForm = form;
    })

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

  onNext() {

    let isUdfField = true;

    if (this.userDefineForm) {
      isUdfField = this.userDefineForm.udfData ? this.userDefineForm.udfData.valid ? true : false : true
    }

    if (this.formValue.invalid && !isUdfField) {
      return
    }

    const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
    const product = leadSectioData.leadDetails.productCatCode;

    if (product === 'NCV' || product === 'UCV' || product === 'UC') {
      const showNotCoApplicant= this.applicantDataStoreService.findCoApplicant(this.applicantList)
      if (!showNotCoApplicant) {
         this.toasterService.showInfo('There should be one Co-Applicant for this lead', '')
      }
    }

    if (product === "NCV") {
      const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
      if (!result) {
        this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
      }
    }
    this.route.navigate([`pages/sales/${this.leadId}/reference`]);
  }

  onFormSubmit() {

    let isUdfField = true;

    if (this.userDefineForm) {
     isUdfField = this.userDefineForm.udfData ? this.userDefineForm.udfData.valid ? true : false : true
    }

    if (this.formValue.valid && isUdfField) {
      let data = this.formValue.value.vehicleFormArray[0];

      if (this.formValue.value.isCheckDedpue === false) {
        this.toasterService.showError('Please check dedupe', 'Vehicle Detail')
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

        if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC'|| this.productCatoryCode === 'UTCR') {
          data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY');
          data.ageOfAsset = data.ageOfAsset ? data.ageOfAsset.split(' ')[0] : null;
          data.ageAfterTenure = data.ageAfterTenure ? data.ageAfterTenure.split(' ')[0] : null;
        }

        data.udfDetails = [{
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId,
          "udfData": JSON.stringify(
            this.userDefineForm && this.userDefineForm.udfData ?
              this.userDefineForm.udfData.getRawValue() : {})
        }]

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
