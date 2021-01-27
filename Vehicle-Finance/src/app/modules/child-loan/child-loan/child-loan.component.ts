import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { CommomLovService } from '@services/commom-lov-service';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AgeValidationService } from '@services/age-validation.service';
import { ChildLoanApiService } from '@services/child-loan-api.service';
import { CommonDataService } from '@services/common-data.service';
import { LoanViewService } from '@services/loan-view.service';
import { LoginStoreService } from '@services/login-store.service';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-child-loan',
  templateUrl: './child-loan.component.html',
  styleUrls: ['./child-loan.component.css']
})
export class ChildLoanComponent implements OnInit {

  isSearched: boolean;
  childLoanForm: FormGroup;
  vehicleRegPattern: any;
  labels: any;
  nameLength: number;
  mobileLength: number;
  isDirty: boolean;
  isCreateChild: boolean;
  accordian: string = '';

  name: string = '';
  isMobileErrMsg: boolean;
  isDobErrMsg: boolean;
  isNameErrMsg: boolean;
  isDisableMobDob: boolean = true;
  // isDisableMobile: boolean = true;
  // isDisableDob: boolean = true;
  selectedUcicIndex: number;
  selectedLoanAccNoIndex: number;
  accountNo: any;
  isCreateLoanBtn: boolean;
  selectedLeadId: string;
  isSO: any;

  public maxAge: Date = new Date();
  public minAge: Date = new Date();

  customerDetailsData = [];
  loanDetailsData = [];
  addressDetails: any;

  ucicId: any;
  test: any;
  toDaydate: Date = new Date();
  userDetails: any;
  nameValue: any;
  mobileValue: any;
  dobValue: any;
  nameValid: any;
  mobileValid: any;
  dobValid: any;

  childData: {
    ucic?: any,
    loanAccountNumber?: any,
    vehicleRegistrationNumber?: any,
    aadhaar?: any
    drivingLicense?: any
    voterId?: any
    passport?: any
    pan?: any
    cin?: any
    tan?: any
    gst?: any
    name?: any
    mobile?: any
    dateOfBirth?: any
  }


  constructor(
    private commonLovService: CommomLovService,
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private ageValidationService: AgeValidationService,
    private childLoanApiService: ChildLoanApiService,
    private commonDataService: CommonDataService,
    private commomLovService: CommomLovService,
    private loanViewService: LoanViewService,
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService

  ) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getAgeValidation();
    this.vehicleRegPattern = this.validateCustomPattern();
    const userDetails = this.loginStoreService.getRolesAndUserDetails();
    this.isSO = userDetails.roles[0].roleId;
    console.log('userDetails', userDetails);
    console.log('bod ', this.childLoanForm.controls.dateOfBirth);
  }

  initForm() {
    this.childLoanForm = new FormGroup({
      ucic: new FormControl('', Validators.required),
      loanAccountNumber: new FormControl('', Validators.required),
      vehicleRegistrationNumber: new FormControl('', Validators.required),
      aadhaar: new FormControl('', Validators.required),
      drivingLicense: new FormControl('', Validators.required),
      voterId: new FormControl('', Validators.required),
      passport: new FormControl('', Validators.required),
      pan: new FormControl('', Validators.required),
      cin: new FormControl('', Validators.required),
      tan: new FormControl('', Validators.required),
      gst: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required)
    });
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = data.validationData.name.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
      },
      (error) => console.log('Lead Creation Label Error', error)
    );

  }

  validateCustomPattern() {
    const vehicleRegNoPatternData = [
      {
        rule: (inputValue) => {
          const pattern = '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$';
          if (inputValue.length === 10) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{2}[0-9]{4}/).test(inputValue);
          } else if (inputValue.length === 9) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{1}[0-9]{4}/).test(inputValue);
          } else {
            return true;
          }
        },
        msg: 'Invalid Vehicle Registration Number, Valid Formats are: TN02AB1234/TN02A1234',
      }
    ];
    return vehicleRegNoPatternData;
  }

  getAgeValidation() {
    this.ageValidationService.getAgeValidationData().subscribe(
      data => {
        const minAge = data.ages.applicant.minAge;
        const maxAge = data.ages.applicant.maxAge;
        this.maxAge = new Date();
        this.minAge = new Date();
        this.minAge.setFullYear(this.minAge.getFullYear() - minAge);
        this.maxAge.setFullYear(this.maxAge.getFullYear() - maxAge);
      }
    );
  }

  onSubmit() {
    this.test = '#customerDetails_id';
    const ucic = this.childLoanForm.controls.ucic.valid;
    const loanAccountNumber = this.childLoanForm.controls.loanAccountNumber.valid;
    const vehicleRegistrationNumber = this.childLoanForm.controls.vehicleRegistrationNumber.valid;
    const aadhaar = this.childLoanForm.controls.aadhaar.valid;
    const drivingLicense = this.childLoanForm.controls.drivingLicense.valid;
    const voterId = this.childLoanForm.controls.voterId.valid;
    const passport = this.childLoanForm.controls.passport.valid;
    const pan = this.childLoanForm.controls.pan.valid;
    const cin = this.childLoanForm.controls.cin.valid;
    const tan = this.childLoanForm.controls.tan.valid;
    const gst = this.childLoanForm.controls.gst.valid;
    const name = this.childLoanForm.controls.name.valid;
    const mobile = this.childLoanForm.controls.mobile.valid;
    const dateOfBirth = this.childLoanForm.controls.dateOfBirth.valid;
    if ((
      ucic || loanAccountNumber ||
      vehicleRegistrationNumber ||
      aadhaar || drivingLicense ||
      voterId || passport || pan ||
      cin || tan || gst) || (name && mobile && dateOfBirth)) {
      this.onSearch();
    } else if ((name && dateOfBirth) || (name && mobile) || (dateOfBirth && mobile)) {
      this.onSearch();
      console.log('childform1', this.childLoanForm.controls);
    } else {
      this.toasterService.error(
        'Atleast one search parameter or mandatory fields are required to search loan account.', 'Search Loan Account'
      );
    }

    // (
    //   ucic || loanAccountNumber ||
    //   vehicleRegistrationNumber ||
    //   aadhaar || drivingLicense ||
    //   voterId || passport || pan ||
    //   cin || tan || gst
    // ) && (
    //   !name && !mobile && !dateOfBirth
    // )
    // if (
    //   (name && dateOfBirth || name && mobile) &&
    //   (dateOfBirth && name || dateOfBirth && mobile) &&
    //   (mobile && name || mobile && dateOfBirth)
    // ) {
    //   this.onSearch();
    //   console.log('childform1', this.childLoanForm.controls);
    // } else {
    //   this.toasterService.error(
    //     'Atleast two search parameters are required in NAME, MOBILE and DOB to search loan account.', 'Search Loan Account'
    //   );
    // }
    // this.toasterService.error(
    //   'Atleast one search parameter is required to search loan account.', 'Search Loan Account'
    // );
  }

  getFormControlValues() {
    const ucic = this.childLoanForm.controls.ucic.value;
    const loanAccountNumber = this.childLoanForm.controls.value;
    const vehicleRegistrationNumber = this.childLoanForm.controls.value;
    const aadhaar = this.childLoanForm.controls.value;
    const drivingLicense = this.childLoanForm.controls.value;
    const voterId = this.childLoanForm.controls.value;
    const passport = this.childLoanForm.controls.value;
    const pan = this.childLoanForm.controls.value;
    const cin = this.childLoanForm.controls.value;
    const tan = this.childLoanForm.controls.value;
    const gst = this.childLoanForm.controls.value;
    this.nameValue = this.childLoanForm.controls.name.value;
    this.mobileValue = this.childLoanForm.controls.mobile.value;
    this.dobValue = this.childLoanForm.controls.dateOfBirth.value;
    // this.dobValue = this.utilityService.getDateFormat(this.childLoanForm.controls.dateOfBirth.value);

  }

  onName(event) {
    this.getFormControlValues();
    this.name = event.target.value;
    this.name = this.name.replace(/[^a-zA-Z ]/g, '');
    this.nameValue = this.name;
    if (
      (this.nameValue === '' || this.nameValue === undefined) &&
      (this.mobileValue === '' || this.mobileValue === undefined) &&
      (this.dobValue === null || this.dobValue === '' || this.dobValue === undefined)
    ) {
      this.isMobileErrMsg = false;
      this.isDobErrMsg = false;
      this.isNameErrMsg = false;
      return;
    }
    if (this.nameValue) {
      if (this.mobileValue !== '' || (this.dobValue !== '' && this.dobValue !== null)) {
        this.isMobileErrMsg = false;
        this.isDobErrMsg = false;
      } else {
        this.isMobileErrMsg = true;
        this.isDobErrMsg = true;
      }
      this.isNameErrMsg = false;
    } else {
      if (this.mobileValue !== '' || this.dobValue !== '') {
        this.isMobileErrMsg = this.mobileValue ? false : true;
        this.isDobErrMsg = this.dobValue ? false : true;
        if (this.mobileValue === '' && this.dobValue === '') {
          this.isNameErrMsg = false;
        } else {
          this.isMobileErrMsg = this.mobileValue ? false : true;
          this.isDobErrMsg = this.dobValue ? false : true;
          if (!this.isMobileErrMsg && !this.isDobErrMsg) {
            this.isNameErrMsg = false;
          } else if (!this.isMobileErrMsg || !this.isDobErrMsg) {
            this.isNameErrMsg = true;
          }
        }
      }
    }
  }
  onMobileInput(event) {
    this.getFormControlValues();
    const mobileValue = event.target.value;
    if (
      (this.nameValue === '' || this.nameValue === undefined) &&
      (this.mobileValue === '' || this.mobileValue === undefined) &&
      (this.dobValue === null || this.dobValue === '' || this.dobValue !== undefined)
    ) {
      this.isMobileErrMsg = false;
      this.isDobErrMsg = false;
      this.isNameErrMsg = false;
      return;
    }
    if (this.mobileValue) {
      if (this.nameValue !== '' || (this.dobValue !== '' && this.dobValue !== null)) {
        this.isNameErrMsg = false;
        this.isDobErrMsg = false;
      } else {
        this.isNameErrMsg = true;
        this.isDobErrMsg = true;
      }
      this.isMobileErrMsg = false;
    } else {
      if (this.nameValue !== '' || this.dobValue !== '') {
        this.isNameErrMsg = this.nameValue ? false : true;
        this.isDobErrMsg = this.dobValue ? false : true;
        if (this.nameValue === '' && this.dobValue === '') {
          this.isMobileErrMsg = false;
        } else {
          this.isNameErrMsg = this.nameValue ? false : true;
          this.isDobErrMsg = this.dobValue ? false : true;
          if (!this.isNameErrMsg && !this.isDobErrMsg) {
            this.isMobileErrMsg = false;
          } else if (!this.isNameErrMsg || !this.isDobErrMsg) {
            this.isMobileErrMsg = true;
          }
        }
      }
    }
  }

  onDateOfBirthInput(event) {
    this.getFormControlValues();
    console.log('ddob', event, this.childLoanForm.controls.dateOfBirth);
    if (
      (this.nameValue === '' || this.nameValue === undefined) &&
      (this.mobileValue === '' || this.mobileValue === undefined) &&
      (this.dobValue === null || this.dobValue === '' || this.dobValue === undefined)
    ) {
      this.isMobileErrMsg = false;
      this.isDobErrMsg = false;
      this.isNameErrMsg = false;
      return;
    }
    if (this.dobValue) {
      if (this.nameValue !== '' || this.mobileValue !== '') {
        this.isNameErrMsg = false;
        this.isMobileErrMsg = false;
      } else {
        this.isNameErrMsg = true;
        this.isMobileErrMsg = true;
      }
      this.isDobErrMsg = false;
    } else {
      if (this.nameValue !== '' || this.mobileValue !== '') {
        this.isNameErrMsg = this.nameValue ? false : true;
        this.isMobileErrMsg = this.mobileValue ? false : true;
        if (this.nameValue === '' && this.mobileValue === '') {
          this.isDobErrMsg = false;
        } else {
          this.isNameErrMsg = this.nameValue ? false : true;
          this.isMobileErrMsg = this.mobileValue ? false : true;
          if (!this.isNameErrMsg && !this.isMobileErrMsg) {
            this.isDobErrMsg = false;
          } else if (!this.isNameErrMsg || !this.isMobileErrMsg) {
            this.isDobErrMsg = true;
          }
        }
      }
    }
  }

  onSearch(loanAccNo?, isCreateChild?) {
    const formValue = this.childLoanForm.getRawValue();
    const childLoanDatas: any = { ...formValue };

    this.childData = {
      ucic: childLoanDatas.ucic,
      loanAccountNumber: loanAccNo ? loanAccNo : childLoanDatas.loanAccountNumber,
      vehicleRegistrationNumber: childLoanDatas.vehicleRegistrationNumber,
      aadhaar: childLoanDatas.aadhaar,
      drivingLicense: childLoanDatas.drivingLicense,
      voterId: childLoanDatas.voterId,
      passport: childLoanDatas.passport,
      pan: childLoanDatas.pan,
      cin: childLoanDatas.cin,
      tan: childLoanDatas.tan,
      gst: childLoanDatas.gst,
      name: childLoanDatas.name,
      mobile: childLoanDatas.mobile,
      dateOfBirth: this.utilityService.getDateFormat(childLoanDatas.dateOfBirth)
    }
    if (isCreateChild) {
      this.childData['toCreateChildLoan'] = isCreateChild;
    }

    this.accordian = '';

    this.childLoanApiService.searchChildLoanApi(this.childData).subscribe(
      (res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        const errorMessage = response.ProcessVariables.error.message;

        if (appiyoError === '0' && apiError === '0') {
          this.customerDetailsData = response.ProcessVariables.customerDetails;
          this.loanDetailsData = response.ProcessVariables.loanDetails;
          this.addressDetails = response.ProcessVariables.addressDetails;
          this.loanViewService.setLoanAccountAddress(this.addressDetails);
          if (!this.customerDetailsData) {
            return;
          }
          if (this.customerDetailsData.length !== 0 || this.loanDetailsData.length !== 0) {
            this.accordian = '#collapseOne';
            this.test = '#customerDetails_id';
            if (isCreateChild) {
              this.onCreateChildLoan();
            }
          } else {
            this.accordian = '';
            this.test = '';
          }
          console.log('cchild', response);
        } else {
          this.accordian = '';
          this.toasterService.error(`${errorMessage}`, 'Search Loan');
        }
      })

  }

  onUcicIdSelect(event, index) {
    const selectedUcicId = event.target.checked;
    if (selectedUcicId) {
      this.ucicId = this.customerDetailsData[index].ucic;
      this.selectedUcicIndex = index;
      console.log('this.ucicId', this.ucicId);
      const data = {
        ucic: this.ucicId
      }
      this.childLoanApiService.searchChildLoanApi(data).subscribe(
        (res: any) => {
          const response = res;
          const appiyoError = response.Error;
          const apiError = response.ProcessVariables.error.code;
          const errorMessage = response.ProcessVariables.error.message;

          if (appiyoError === '0' && apiError === '0') {
            this.loanDetailsData = response.ProcessVariables.loanDetails;
          } else {
            this.toasterService.error(`${errorMessage}`, 'Search Loan');
          }
        });
    }
  }

  onLoanAccNoSelect(event, index, loanDetail) {
    const selectedLoanAcc = event.target.checked;
    if (selectedLoanAcc) {
      this.isCreateLoanBtn = true;
      this.accountNo = this.loanDetailsData[index].accountNumber;
      this.selectedLoanAccNoIndex = index;
      this.selectedLeadId = this.loanDetailsData[index].parentLead;
      this.loanViewService.setLoanAccountDetails(loanDetail);
    }
  }

  viewLoan360() {
    this.loanViewService.isLoan360(true);
    // this.loanViewService.getLoanDetails(this.leadId)
    //     .subscribe((value) => {
    // console.log('loan 360', value);
    this.router.navigateByUrl(`/pages/dde/${this.selectedLeadId}/loan-details`);
    // });
  }

  onCreate() {
    this.onSearch(this.accountNo, true);
  }

  onCreateChildLoan() {

    const customerData = this.customerDetailsData.length;
    const loanData = this.loanDetailsData.length;

    let childDataObj: {
      firstName?: any,
      middleName?: any,
      lastName?: any,
      entity?: any,
      mobile?: any,
      dobOrDoi?: any
      loanAccountNumber?: any
      fromChild?: boolean
    };

    if (customerData > 1) {
      childDataObj = {
        firstName: this.customerDetailsData[this.selectedUcicIndex].firstName,
        middleName: this.customerDetailsData[this.selectedUcicIndex].middleName,
        lastName: this.customerDetailsData[this.selectedUcicIndex].lastName,
        entity: this.customerDetailsData[this.selectedUcicIndex].entityTypeID ?
          this.customerDetailsData[this.selectedUcicIndex].entityTypeID : 'INDIVENTTYP',
        mobile: this.customerDetailsData[this.selectedUcicIndex].mobileNumber,
        dobOrDoi: this.customerDetailsData[this.selectedUcicIndex].dobORdoi,
      };
    } else if (customerData === 1) {
      childDataObj = {
        firstName: this.customerDetailsData[0].firstName,
        middleName: this.customerDetailsData[0].middleName,
        lastName: this.customerDetailsData[0].lastName,
        entity: this.customerDetailsData[0].entityTypeID,
        mobile: this.customerDetailsData[0].mobileNumber,
        dobOrDoi: this.customerDetailsData[0].dobORdoi,
      };
    }
    if (loanData > 1) {
      const childData = {
        ...childDataObj,
        loanAccountNumber: this.loanDetailsData[this.selectedLoanAccNoIndex].accountNumber,
        fromChild: true,
        productCode: this.loanDetailsData[this.selectedLoanAccNoIndex].productCode,
      };
      console.log('onCreateChild', childData);
      this.commomLovService.setSearchLoan(childData);
    } else if (loanData === 1) {
      const childData = {
        ...childDataObj,
        loanAccountNumber: this.loanDetailsData[0].accountNumber,
        fromChild: true,
        productCode: this.loanDetailsData[0].productCode,
      };
      console.log('onCreateChild', childData);
      this.commomLovService.setSearchLoan(childData);

    }
    this.router.navigateByUrl('pages/lead-creation');
  }

}
