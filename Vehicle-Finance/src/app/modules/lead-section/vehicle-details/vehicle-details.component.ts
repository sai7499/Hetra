import { Component, OnInit } from '@angular/core';
import { CreditScoreService } from '@services/credit-score.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { ToasterService } from '@services/toaster.service';
import { TermAcceptanceService } from '@services/term-acceptance.service';
import { LoanViewService } from '@services/loan-view.service';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { UtilityService } from '@services/utility.service';
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { LoginStoreService } from '@services/login-store.service';
import { LabelsService } from '@services/labels.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.css']
})
export class VehicleDetailComponent implements OnInit {
  leadId: any;
  isModelShow = false;
  errorMessage: any;
  isFemaleForNCVFromApp: boolean;
  isFemaleForNCVFromPool: boolean;
  isFemaleForNCV: boolean;
  showEligibilityScreen: boolean;
  eligibleModal: boolean;
  userId: any;
  applicantList: any = []
  showNotCoApplicant: boolean;

  finalValue: any;
  apiValue: any;

  public label: any;
  public errorMsg: string;
  formValue: any;
  userDefineForm: any;

  isDirty: boolean;
  routerId: any = '0';

  udfScreenId: string = '';
  udfGroupId: string = 'VLG002';
  udfDetails: any = [];

  productCatoryCode: string;
  isLoan360: boolean;

  constructor(private creditService: CreditScoreService,
    private activatedRoute: ActivatedRoute,
    private createLeadDataService: CreateLeadDataService,
    private applicantDataStoreService: ApplicantDataStoreService,
    private toasterService: ToasterService,
    private utilityService: UtilityService,
    private sharedService: SharedService,
    private loanViewService: LoanViewService,
    private termsService: TermAcceptanceService,
    private vehicleDetailService: VehicleDetailService,
    private vehicleDataStoreService: VehicleDataStoreService,
    private labelsData: LabelsService,
    private objectComparisonService: ObjectComparisonService,
    private loginStoreService: LoginStoreService,
    private route: Router) { }

  async ngOnInit() {
    this.userId = localStorage.getItem('userId');
    this.leadId = (await this.getLeadId()) as string;

    this.applicantList = this.applicantDataStoreService.getApplicantList();

    this.isLoan360 = this.loanViewService.checkIsLoan360();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    this.userId = roleAndUserDetails.userDetails.userId;
    const leadData = this.createLeadDataService.getLeadSectionData();

    this.leadId = leadData['leadId'];
    let leadDetails = leadData['leadDetails']
    this.productCatoryCode = leadDetails['productCatCode'];

    if (leadData && leadData['vehicleCollateral']) {
      this.routerId = leadData['vehicleCollateral'].length > 0 ? leadData['vehicleCollateral'][0].collateralId : '0';
      this.vehicleDataStoreService.setLoanAmount(leadData['vehicleCollateral'][0].loanAmount)
    }

    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.QDE.vehicleDetailQDE;

    })

    this.sharedService.vaildateForm$.subscribe((value) => {
      this.formValue = value;
    })

    this.sharedService.userDefined$.subscribe((form: any) => {
      this.userDefineForm = form;
    })

    this.sharedService.apiValue$.subscribe((val: any) => {
      this.apiValue = val;
    })

    this.labelsData.getLabelsData()
      .subscribe(data => {
        this.label = data;
      },
        error => {
          this.errorMsg = error;
        });

  }

  forFindingCoApplicantType() {
    if (this.applicantList) {
      const findCoApplicant = this.applicantList.find((data) => data.applicantTypeKey == "COAPPAPPRELLEAD")
      this.showNotCoApplicant = findCoApplicant == undefined ? true : false;
    } else {
      this.showNotCoApplicant = true;
    }
  }

  onCredit() {

    let isUdfField = true;
    this.isDirty = true;

    if (this.userDefineForm) {
      isUdfField = this.userDefineForm.udfData ? this.userDefineForm.udfData.valid ? true : false : true;
    }

    this.finalValue = this.formValue.getRawValue().vehicleFormArray[0];

    if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC' || this.productCatoryCode === 'UTCR') {
      // this.finalValue.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(this.finalValue.manuFacMonthYear, 'DD/MM/YYYY');
      this.finalValue.ageOfAsset = this.finalValue.ageOfAsset ? this.finalValue.ageOfAsset.split(' ')[0] : null;
      this.finalValue.ageAfterTenure = this.finalValue.ageAfterTenure ? this.finalValue.ageAfterTenure.split(' ')[0] : null;
    }

    console.log(this.finalValue, 'finalvalue', this.apiValue[0])

    if (this.formValue.valid && isUdfField) {

      const isValueCheck = this.objectComparisonService.compare(this.apiValue[0], this.finalValue);
      // const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)
      const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false

      if (!isValueCheck) {
        this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
        return;
      }

      const body = { leadId: this.leadId };
      this.creditService.getCreditScore(body).subscribe((res: any) => {
        const resObj = res;
        // tslint:disable-next-line: no-bitwise
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
          const bodyRes = res;
          this.creditService.setResponseForCibil(bodyRes);

          const leadSectioData: any = this.createLeadDataService.getLeadSectionData();
          const product = leadSectioData.leadDetails.productCatCode;
          if (product === 'NCV' || product === 'UCV' || product === 'UC' || product === 'UTCR') {
            this.showNotCoApplicant = this.applicantDataStoreService.findCoApplicant(this.applicantList)
            if (!this.showNotCoApplicant) {
              this.toasterService.showInfo('There should be one Co-Applicant for this lead', '')
            }
          }

          if (product === "NCV") {
            const result = this.applicantDataStoreService.checkFemaleAppForNCV(this.applicantList)
            if (!result) {
              this.toasterService.showInfo('There should be atleast one FEMALE applicant for this lead', '');
            }
          }

          this.showEligibilityScreen = res.ProcessVariables.showEligibilityScreen;
          if (!this.showEligibilityScreen) {
            this.eligibleModal = true;
            return;
          }

          this.route.navigate([`pages/lead-section/${this.leadId}/credit-score`]);
        } else {
          this.errorMessage = res.ProcessVariables.error ? res.ProcessVariables.error.message : res.ErrorMessage;
          this.isModelShow = true;
        }
      });
    } else {
      this.isDirty = true;
      this.toasterService.showInfo('Please SAVE details before proceeding', '');
      return;
    }

  }

  navigateToSales() {
    const body = {
      leadId: this.leadId,
      userId: this.userId,
      statusType: 'accept'
    };
    this.termsService.acceptTerms(body).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code === '0') {
        this.route.navigateByUrl(`/pages/sales/${this.leadId}/lead-details`);
      }
    });
  }

  onEligibleModalClose() {
    this.eligibleModal = false;
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

  onFormSubmit() {

    let isUdfField = true;
    this.isDirty = true;

    if (this.userDefineForm) {
      isUdfField = this.userDefineForm.udfData ? this.userDefineForm.udfData.valid ? true : false : true
    }

    if (this.formValue.valid && isUdfField) {
      let data = this.formValue.value.vehicleFormArray[0];

      this.isDirty = false;

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

        if (this.productCatoryCode === 'UCV' || this.productCatoryCode === 'UC' || this.productCatoryCode === 'UTCR') {
          data.manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY');
          data.ageOfAsset = data.ageOfAsset ? data.ageOfAsset.split(' ')[0] : null;
          data.ageAfterTenure = data.ageAfterTenure ? data.ageAfterTenure.split(' ')[0] : null;
        }

        data.udfDetails = [{
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId,
          "udfData": JSON.stringify(
            this.userDefineForm && this.userDefineForm.udfData ?
              this.userDefineForm.udfData.getRawValue() : {}
          )
        }]

        this.vehicleDetailService.saveOrUpdateVehcicleDetails(data).subscribe((res: any) => {
          if (res.Error === '0' && res.ProcessVariables.error.code === '0') {
            this.toasterService.showSuccess('Record Saved/Updated Successfully', 'Vehicle Details');
            this.route.navigate(['pages/lead-section/' + this.leadId + '/vehicle-list']);
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
      console.log(this.formValue, 'formValue')
      this.toasterService.showError('Please enter all mandatory field', 'Vehicle Detail')
    }
  }

}
