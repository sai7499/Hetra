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
  isDisableMobDob: boolean = true;
  isDisableMobile: boolean = true;
  isDisableDob: boolean = true;
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

  ucicId: any;
  test: any;
  toDaydate: Date = new Date();
  userDetails: any;

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

  ) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getAgeValidation();
    this.vehicleRegPattern = this.validateCustomPattern();
    const userDetails = this.loginStoreService.getRolesAndUserDetails();
    this.isSO = userDetails.roles[0].roleId;
    console.log('userDetails', userDetails);
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
    if (
      ucic || loanAccountNumber ||
      vehicleRegistrationNumber ||
      aadhaar || drivingLicense ||
      voterId || passport || pan ||
      cin || tan || gst
    ) {
      this.accordian = '#collapseOne';
      this.onSearch();
      console.log('childform1', this.childLoanForm.controls);
    } else if (name && dateOfBirth) {
      this.accordian = '#collapseOne';
      this.onSearch();
      console.log('childform2', this.childLoanForm.controls);
    } else if (name && mobile) {
      this.accordian = '#collapseOne';
      this.onSearch();
      console.log('childform3', this.childLoanForm.controls);
    } else {
      this.toasterService.error('Atleast one search parameter is required to search loan account.', 'Search Loan Account');
    }

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
    const name = this.childLoanForm.controls.value;
    const mobile = this.childLoanForm.controls.value;
    const dateOfBirth = this.childLoanForm.controls.value;
  }

  onName(event) {
    this.name = event.target.value;
    this.name = this.name.replace(/[^a-zA-Z ]/g, '');
    if (this.name !== '') {
      // this.isDisableMobDob = false;      
      this.isDisableMobile = false;
      this.isDisableDob = false;
      this.isMobileErrMsg = false;
      this.isDobErrMsg = false;
      const mobile = this.childLoanForm.controls.mobile.valid;
      const dateOfBirth = this.childLoanForm.controls.dateOfBirth.valid;
      if (mobile || dateOfBirth) {
        this.isMobileErrMsg = false;
        this.isDobErrMsg = false;
        this.accordian = '#collapseOne';
      } else {
        this.isMobileErrMsg = true;
        this.isDobErrMsg = true;
        this.accordian = '';
      }
    } else if (this.name === '') {
      // this.isDisableMobDob = true;      
      this.childLoanForm.patchValue({ mobile: null });
      this.childLoanForm.updateValueAndValidity();
      this.childLoanForm.patchValue({ dateOfBirth: null });
      this.childLoanForm.updateValueAndValidity();
      this.isDisableMobile = true;
      this.isDisableDob = true;
      this.isMobileErrMsg = false;
      this.isDobErrMsg = false;
      this.accordian = '';
    }
    // else {
    //   // this.isDisableMobDob = true;
    //   this.isDisableMobile = true;
    //   this.isDisableDob = true;
    // }
  }
  onMobileInput(event) {
    const mobileValue = event.target.value;
    if (mobileValue) {
      this.isMobileErrMsg = false;
      this.isDobErrMsg = false;
      const mobile = this.childLoanForm.controls.mobile.valid;
      this.accordian = (mobile) ? '#collapseOne' : '';
    } else {
      this.isMobileErrMsg = true;
      this.isDobErrMsg = true;
    }
  }

  onDateOfBirthInput(event) {
    console.log('ddob', event);
    if (event) {
      this.isMobileErrMsg = false;
      this.isDobErrMsg = false;
      const dateOfBirth = this.childLoanForm.controls.dateOfBirth.valid;
      this.accordian = (dateOfBirth) ? '#collapseOne' : '';
    } else {
      this.isMobileErrMsg = true;
      this.isDobErrMsg = true;
    }
  }

  onSearch() {
    const formValue = this.childLoanForm.getRawValue();
    const childLoanDatas: any = { ...formValue };

    this.childData = {
      ucic: childLoanDatas.ucic,
      loanAccountNumber: childLoanDatas.loanAccountNumber,
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
      dateOfBirth: childLoanDatas.dateOfBirth
    }
    console.log('this.childData', this.childData);
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
          if (this.customerDetailsData.length !== 0 || this.loanDetailsData.length !== 0) {
            this.accordian = '#collapseOne';
            this.test = '#customerDetails_id';
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
        entity: this.customerDetailsData[this.selectedUcicIndex].entityTypeID,
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
