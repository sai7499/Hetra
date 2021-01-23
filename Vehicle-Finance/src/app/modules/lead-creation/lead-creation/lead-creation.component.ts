import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';

import { CreateLeadService } from '../service/creatLead.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
import { ToastrService } from 'ngx-toastr';
import { AgeValidationService } from '@services/age-validation.service';
import { CommonDataService } from '@services/common-data.service';
import { ChildLoanApiService } from '@services/child-loan-api.service';
import { param } from 'jquery';
// import Qde from '@model/lead.model';
@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css'],
})
export class LeadCreationComponent implements OnInit {
  // qde: Qde;
  createLeadForm: FormGroup;
  lovLabels: any = [];
  labels: any = {};
  leadId: number;

  applicantType: string;
  sourcingChange: any;
  sourcingCodePlaceholder = 'Sourcing Code';
  sourchingTypeData = [];
  sourchingTypeValues = [];
  text: string;
  loanAccountBranch: string;
  leadHandeledBy: string;
  spokesCodeLocation: any = [];
  isSpoke: number;
  businessDivision: any = [];
  isBusinessDivisionEnable: boolean;
  bizDivId: string;
  branchId: number;
  userId: number;

  LOV: any = [];
  udfScreenId: string = 'LDS001';

  productCategoryData;
  productData = [];
  sourchingType: string;
  productCategorySelectedList = [];
  productCategoryList = [];
  sourcingChannelData = [];
  sourcingData = [];
  socuringTypeData = [];
  placeholder = [];
  sourcingCodeData: Array<{ key: string; value: string }> = [];
  dealerCodeData: Array<any> = [];
  fundingProgramData = [];
  isSourcingType: boolean;
  showModal: boolean;
  modalMessage: string;
  isNgAutoCompleteSourcing: any;
  isNgAutoCompleteDealer: boolean;
  isMobile: any;
  isSourchingCode: boolean;
  isDirty: boolean;
  nameFirstErrorMessage: string;
  nameLastErrorMessage: string;
  firstPlaceholder: string;
  secondPlaceholder: string;
  thirdPlaceholder: string;
  dobOrDoiPlaceHolder: string;
  isFirstNameRequired: boolean;
  isLastNameRequired: boolean;
  dob: any;
  isSourceCode: boolean = true;
  isDealerCode: boolean;
  sourchingTypeId: string;
  productCode: string;
  isLoanAccountNo: boolean;
  isFromChild: boolean;
  productCodeFromSearch: string;
  isLoanModal: any;
  sourcingCodeKeyForDealer: string;
  dealorCodeKey: string;


  obj = {};
  test = [];
  childLoanData: any;

  public maxAge: Date = new Date();
  public minAge: Date = new Date();
  ageCount: number = 0;

  namePattern: string;
  nameLength: number;
  mobileLength: number;
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  isremoveDealerRC: boolean;

  loanLeadDetails: {
    bizDivision: string;
    product: string;
    priority: string;
    fundingProgram: string;
    sourcingChannel: string;
    sourcingType: string;
    sourcingCode: string;
    dealorCode: string;
    spokeCode: number;
    loanBranch: number;
    leadHandeledBy: number;
    sourcingCodeDescription: string;
    parentLoanAccNum?: number;
    isCommSuppressed: number
  };

  applicantDetails: {
    entity: string;
    nameOne: string;
    nameTwo: string;
    nameThree: string;
    mobileNumber: string;
    dobOrDoc: string;
  };

  childLoanDatas: {
    firstName?: any,
    middleName?: any,
    lastName?: any,
    entity?: any,
    mobile?: any,
    dobOrDoi?: any,
    loanAccountNumber?: any,
    fromChild?: boolean,
    fromCreateLead?: boolean
  }


  constructor(
    private router: Router,
    private leadStoreService: LeadStoreService,
    private labelsData: LabelsService,
    private createLeadService: CreateLeadService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private utilityService: UtilityService,
    private toasterService: ToastrService,
    private ageValidationService: AgeValidationService,
    private commonDataService: CommonDataService,
    private childLoanApiService: ChildLoanApiService,
  ) {
    this.isremoveDealerRC = true;
    console.log('this.isremoveDealerRC', this.isremoveDealerRC)
  }

  ngOnInit() {
    this.onChangeLanguage('English');
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getSourcingChannel();
    this.createLeadForm.patchValue({ entity: 'INDIVENTTYP' });
    this.selectApplicantType('INDIVENTTYP', true);
    const dataFromSearchLoan = this.commonLovService.getSearchLoan();
    this.childLoanData = dataFromSearchLoan;
    console.log('456', this.childLoanData)
    if (this.childLoanData) {
      this.updateChildLoan(this.childLoanData);
    }
    // if (this.childLoanData && this.childLoanData.fromChild) {
    //   this.isLoanAccountNo = true;
    //   this.isFromChild = this.childLoanData.fromChild;
    //   this.createLeadForm.addControl('loanAccountNumber', new FormControl('', Validators.required));
    //   this.createLeadForm.updateValueAndValidity();
    //   this.getChildLoanEntity();
    //   if (this.childLoanData.fromChild) {
    //     this.isFromChild = true;
    //     this.removeDealerRClimit();
    //     this.productCodeFromSearch = this.childLoanData.productCode;
    //   } else {
    //     this.isFromChild = false;
    //   }
    // } else {
    //   this.createLeadForm.removeControl('loanAccountNumber');
    // }

    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.QDE.leadCreateQDE;

    })

  }

  updateChildLoan(data) {
    console.log('this.childLoanDatas', data)
    this.childLoanData = data;
    if (this.childLoanData && this.childLoanData.fromChild) {
      this.isLoanAccountNo = true;
      this.isFromChild = this.childLoanData.fromChild;
      // if (!data.fromCreateLead) {
      this.createLeadForm.addControl('loanAccountNumber', new FormControl('', Validators.required));
      this.createLeadForm.updateValueAndValidity();
      // }

      this.getChildLoanEntity();
      if (this.childLoanData.fromChild) {
        this.isFromChild = true;
        this.removeDealerRClimit();
        this.productCodeFromSearch = this.childLoanData.productCode;
        if (data.fromCreateLead == true) {
          this.filterProduct(this.productCodeFromSearch);
          this.createLeadForm.patchValue({
            productCategory: this.productCodeFromSearch
          });
        }

      } else {
        this.isFromChild = false;
      }
    } else {
      this.createLeadForm.removeControl('loanAccountNumber');
    }
  }

  removeDealerRClimit() {
    this.createLeadForm.removeControl('dealerCode');
    this.createLeadForm.removeControl('rcLimit');
    this.createLeadForm.removeControl('rcUtilizedLimit');
    this.createLeadForm.removeControl('rcUnutilizedLimit');
    this.isremoveDealerRC = false;
  }
  addDealerRClimit() {
    this.createLeadForm.addControl('dealerCode', new FormControl(''));
    this.createLeadForm.addControl('rcLimit', new FormControl({ value: '', disabled: true }));
    this.createLeadForm.addControl('rcUtilizedLimit', new FormControl({ value: '', disabled: true }));
    this.createLeadForm.addControl('rcUnutilizedLimit', new FormControl({ value: '', disabled: true }));
    this.createLeadForm.updateValueAndValidity();

  }

  getChildLoanEntity() {
    const entity = this.childLoanData.entity;
    this.selectApplicantType(`${entity}`, true);
  }

  getChildLoanData() {
    this.createLeadForm.patchValue({
      nameOne: this.childLoanData.firstName,
      nameTwo: this.childLoanData.middleName,
      nameThree: this.childLoanData.lastName,
      mobile: this.childLoanData.mobile,
      dateOfBirth: this.utilityService.getDateFromString(this.childLoanData.dobOrDoi),
      loanAccountNumber: this.childLoanData.loanAccountNumber
    });
    this.firstName = this.childLoanData.firstName ? this.childLoanData.firstName : '';
    this.middleName = this.childLoanData.middleName ? this.childLoanData.middleName : '';
    this.lastName = this.childLoanData.lastName ? this.childLoanData.lastName : '';
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = this.labels.validationData.name.maxLength;
        this.mobileLength = this.labels.validationData.mobileNumber.maxLength;
      },
      (error) => console.log('Lead Creation Label Error', error)
    );
  }

  getAgeValidation() {
    this.ageValidationService.getAgeValidationData().subscribe(
      data => {
        const minAge = data.ages.applicant.minAge;
        const maxAge = data.ages.applicant.maxAge;
        if (this.applicantType === 'INDIVENTTYP') {
          this.maxAge = new Date();
          this.minAge = new Date();
          this.minAge.setFullYear(this.minAge.getFullYear() - minAge);
          this.maxAge.setFullYear(this.maxAge.getFullYear() - maxAge);
        } else {
          this.minAge = null;
          this.maxAge = new Date();
        }
      }
    );
  }

  initForm() {
    this.createLeadForm = new FormGroup({
      bizDivision: new FormControl('', Validators.required),
      productCategory: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      fundingProgram: new FormControl('', Validators.required),
      priority: new FormControl(''),
      sourcingChannel: new FormControl('', Validators.required),
      sourcingType: new FormControl('', Validators.required),
      sourcingCode: new FormControl(''),
      dealerCode: new FormControl(''),
      rcLimit: new FormControl({ value: '', disabled: true }),
      rcUtilizedLimit: new FormControl({ value: '', disabled: true }),
      rcUnutilizedLimit: new FormControl({ value: '', disabled: true }),
      spokeCodeLocation: new FormControl({
        value: '',
        disabled: !this.isSpoke,
      }),
      loanBranch: new FormControl(
        { value: this.loanAccountBranch, disabled: true },
        Validators.required
      ),
      leadHandeledBy: new FormControl({
        value: this.leadHandeledBy,
        disabled: true,
      }),
      entity: new FormControl('', Validators.required),
      nameOne: new FormControl('', Validators.required),
      nameTwo: new FormControl(''),
      nameThree: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      communication: new FormControl('0'),
      // loanAccountNumber: new FormControl('', Validators.required)
    });
  }

  getLOV() {
    this.commonLovService
      .getLovData()
      .subscribe((lov: any) => {
        (this.LOV = lov);
        this.getUserDetailsData();
      });
  }

  getUserDetailsData() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
    console.log(roleAndUserDetails, 'Test')
    this.getBusinessDivision(roleAndUserDetails);

    this.branchId = roleAndUserDetails.userDetails.branchId;
    const branchName = roleAndUserDetails.userDetails.branchName;
    this.loanAccountBranch = `${this.branchId}-${branchName}`;

    this.userId = roleAndUserDetails.userDetails.userId;
    const userName = roleAndUserDetails.userDetails.firstName;
    this.leadHandeledBy = `${this.userId}-${userName}`;

    this.isSpoke = roleAndUserDetails.userDetails.isSpokes;
    this.spokesCodeLocation = this.isSpoke
      ? roleAndUserDetails.userDetails.parentBranch
      : null;
    this.createLeadForm.patchValue({
      loanBranch: this.loanAccountBranch,
      leadHandeledBy: this.leadHandeledBy,
      // spokeCodeLocation:  this.spokesCodeLocation   
    });
  }

  getBusinessDivision(roleAndUserDetails) {
    const businessDivision = roleAndUserDetails.businessDivisionList;
    this.bizDivId = businessDivision[0].bizDivId;
    const lov = this.LOV.LOVS.businessDivision;
    lov.map((data) => {
      businessDivision.map((ele) => {
        if (ele.bizDivId === data.key) {
          const val = {
            key: ele.bizDivId,
            value: data.value,
          };
          this.businessDivision.push(val);
        }
      });
    });

    if (this.businessDivision.length === 1) {
      this.createLeadForm.patchValue({ bizDivision: this.bizDivId });
      this.isBusinessDivisionEnable = true;
      this.getProductCategory(this.bizDivId);
    } else {
      this.isBusinessDivisionEnable = false;
    }
  }

  getProductCategory(event) {
    this.bizDivId = this.isBusinessDivisionEnable ? event : event.target.value;
    this.createLeadService
      .getProductCategory(this.bizDivId)
      .subscribe((res: any) => {
        this.productCategoryList = res.ProcessVariables.productCategoryDetails;
        this.productCategoryData = this.utilityService.getValueFromJSON(
          this.productCategoryList,
          'productCatCode',
          'prodcutCatName'
        );
        if (this.isFromChild) {
          this.filterProduct(this.productCodeFromSearch);
          this.createLeadForm.patchValue({
            productCategory: this.productCodeFromSearch
          });
        }

      });

  }

  productCategoryChange(event) {
    console.log('productCategoryChange', (event.target != undefined) ? event.target.value : event);
    const productCategorySelected = event.target ? event.target.value : event;
    this.filterProduct(productCategorySelected)
  }

  filterProduct(productCategorySelected) {
    this.productCategorySelectedList = [];
    let filterList = [];
    if (!this.isFromChild) {
      filterList = this.productCategoryList.filter(
        // (data) => data.productCatCode === productCategorySelected 
        (data) => data.productCatCode === productCategorySelected && data.isChildLoan == 0
      )
    } else {
      filterList = this.productCategoryList.filter(
        (data) => data.productCatCode === productCategorySelected && data.isChildLoan == 1
      )
    }
    this.productCategorySelectedList = this.utilityService.getValueFromJSON(
      filterList,
      'assetProdcutCode',
      'assetProdutName'
    );
    this.createLeadForm.patchValue({ product: '' });
  }

  productChange(event) {
    this.fundingProgramData = [];
    console.log('productChange', event.target.value);
    const productChange = event.target.value;
    this.productCode = event.target.value;

    // const isChild = this.productCategoryList.find((value: any) => {
    //   return value.assetProdcutCode === productChange;
    // });
    // console.log('isChildd', isChild.isChildLoan);
    // this.isLoanAccountNo = (isChild.isChildLoan == 0) ? false : true;
    // if (isChild.isChildLoan == 0) {
    //   this.isLoanAccountNo = false;
    //   this.isremoveDealerRC = true;
    //   this.addDealerRClimit();
    //   this.createLeadForm.removeControl('loanAccountNumber');
    // } else {
    //   this.isLoanAccountNo = true;
    //   this.isremoveDealerRC = false;
    //   this.removeDealerRClimit();
    //   this.createLeadForm.addControl('loanAccountNumber', new FormControl('', Validators.required));
    //   this.createLeadForm.updateValueAndValidity();
    // }

    this.createLeadService
      .fundingPrograming(productChange)
      .subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;

        if (appiyoError === '0' && apiError === '0') {
          const data = response.ProcessVariables.fpList;
          if (data) {
            data.map((ele) => {
              const datas = {
                key: ele.fpId,
                value: ele.fpDescription,
              };
              this.fundingProgramData.push(datas);
            });
          }
        }
      });
    this.createLeadForm.patchValue({ fundingProgram: '' });
  }

  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      this.sourcingData = response;
      this.sourcingChannelData = this.utilityService.getValueFromJSON(
        this.sourcingData,
        'sourcingChannelId',
        'sourcingChannelDesc'
      );
    });
  }

  sourcingChannelChange(event: any) {
    this.sourchingTypeValues = [];
    this.sourcingChange = event.target.value;

    this.sourchingTypeValues = this.utilityService.getValueFromJSON(
      this.sourcingData.filter(
        (data) => data.sourcingChannelId === this.sourcingChange
      ),
      'sourcingTypeId',
      'sourcingTypeDesc'
    );
    // this.createLeadForm.patchValue({ sourcingType: '' });
    if (this.sourchingTypeValues.length === 1) {
      const sourcingTypeData = this.sourchingTypeValues[0].key;
      this.createLeadForm.patchValue({ sourcingType: sourcingTypeData });
      if (sourcingTypeData === '11SOURTYP') {
        this.isSourchingCode = true;
        this.sourcingCodePlaceholder = 'Not Applicable';
      } else {
        this.isSourchingCode = false;
        this.sourcingCodePlaceholder = 'Sourcing Code';
      }
      this.sourchingTypeChange(sourcingTypeData);
    } else {
      this.sourcingCodePlaceholder = 'Sourcing Code';
      this.createLeadForm.patchValue({ sourcingType: '' });
    }
  }

  sourchingTypeChange(event) {
    this.sourchingTypeId = event.target ? event.target.value : event;
    if (this.isremoveDealerRC) {
      if (this.sourchingTypeId === '2SOURTYP') {
        this.createLeadForm.controls['dealerCode'].setValidators(Validators.required);
        this.createLeadForm.controls['dealerCode'].updateValueAndValidity();
        this.createLeadForm.controls['rcLimit'].setValidators(Validators.required);
        this.createLeadForm.controls['rcLimit'].updateValueAndValidity();
        this.createLeadForm.controls['rcUtilizedLimit'].setValidators(Validators.required);
        this.createLeadForm.controls['rcUtilizedLimit'].updateValueAndValidity();
        this.createLeadForm.controls['rcUnutilizedLimit'].setValidators(Validators.required);
        this.createLeadForm.controls['rcUnutilizedLimit'].updateValueAndValidity();
        this.isDealerCode = true;
      } else {
        this.createLeadForm.controls['dealerCode'].setValidators([]);
        this.createLeadForm.controls['dealerCode'].updateValueAndValidity();
        this.createLeadForm.controls['rcLimit'].setValidators([]);
        this.createLeadForm.controls['rcLimit'].updateValueAndValidity();
        this.createLeadForm.controls['rcUtilizedLimit'].setValidators([]);
        this.createLeadForm.controls['rcUtilizedLimit'].updateValueAndValidity();
        this.createLeadForm.controls['rcUnutilizedLimit'].setValidators([]);
        this.createLeadForm.controls['rcUnutilizedLimit'].updateValueAndValidity();
        this.isDealerCode = false;
      }
    }
    this.socuringTypeData = this.sourcingData.filter(
      (data) => data.sourcingTypeId === this.sourchingTypeId
    );
    this.placeholder = this.utilityService.getValueFromJSON(
      this.socuringTypeData,
      'sourcingCodeType',
      'sourcingCode'
    );
    console.log('placeholder', this.placeholder);
    this.createLeadForm.controls.sourcingCode.reset();
    this.sourcingCodePlaceholder = this.placeholder[0].value;
    if (this.sourcingCodePlaceholder === 'Not Applicable') {
      this.isSourchingCode = true;
      this.isSourceCode = true;
    } else {
      this.isSourchingCode = false;
      this.isSourceCode = false;
    }
  }

  onSourcingCodeSearch(event) {
    let inputString = event;
    let sourcingCode = [];
    console.log('inputStringSorc', event);
    sourcingCode = this.socuringTypeData.filter(
      (data) => data.sourcingCodeType === this.placeholder[0].key
    );
    console.log('sourcingCode', sourcingCode);
    if (sourcingCode.length === 0) {
      return;
    }
    let sourcingCodeType: string = sourcingCode[0].sourcingCodeType;
    let sourcingSubCodeType: string = sourcingCode[0].sourcingSubCodeType;
    this.createLeadService
      .sourcingCode(sourcingCodeType, sourcingSubCodeType, inputString, this.productCode)
      .subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        if (appiyoError === '0' && apiError === '0') {
          this.sourcingCodeData = response.ProcessVariables.codeList;
        }
      });
  }

  onSourcingCodeCleared(event) {
    this.isSourceCode = false;
  }

  selectSourcingEvent(event) {
    const sourcingEvent = event;
    this.isSourceCode = sourcingEvent.key ? true : false;
    if (this.sourchingTypeId === '2SOURTYP') {
      this.onDealerCodeSearch(sourcingEvent.key);
      this.createLeadForm.patchValue({ dealerCode: sourcingEvent.value });
      this.dealorCodeKey = sourcingEvent.key;
      this.isDealerCode = false;
    }
  }

  onDealerCodeSearch(event) {
    let inputString = event;
    console.log('inputStringDelr', event);
    this.createLeadService.dealerCode(inputString, this.productCode).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.dealerCodeData = response.ProcessVariables.dealorDetails;
        if (this.sourchingTypeId === '2SOURTYP') {
          if (this.dealerCodeData != null){
          this.selectDealerEvent(this.dealerCodeData[0]);
          }
        }
        console.log('this.dealerCodeData', this.dealerCodeData);
      }
    });
  }

  onDealerCodeCleared(event) {
    if (this.sourchingTypeId === '2SOURTYP') {
      this.isDealerCode = true;
    } else {
      this.isDealerCode = false;
    }

  }

  selectDealerEvent(event) {
    if (this.isDealerCode) {
      this.isNgAutoCompleteDealer = event.dealorCode ? false : true;
      this.isDealerCode = this.isNgAutoCompleteDealer ? true : false;
    }
    const rcData = event;
    this.createLeadForm.patchValue({ rcLimit: rcData.rcLimit });
    this.createLeadForm.patchValue({ rcUtilizedLimit: rcData.rcUtilized });
    this.createLeadForm.patchValue({ rcUnutilizedLimit: rcData.rcUnutilized });
  }

  selectApplicantType(event: any, bool) {
    this.applicantType = bool ? event : event.target.value;
    console.log('applicantType', this.applicantType);
    (this.applicantType === 'INDIVENTTYP') ? this.onIndividual() : this.onNonIndividual();
    setTimeout(() => {
      const nameOne = this.createLeadForm.controls['nameOne'].value;
      this.createLeadForm.controls['nameOne'].setValue(nameOne || '');
      const nameThree = this.createLeadForm.controls['nameThree'].value;
      this.createLeadForm.controls['nameThree'].setValue(nameThree || '');
      if (this.childLoanData) {
        this.getChildLoanData();
      }
    });
    this.ageCount++;
    this.getAgeValidation();
  }

  onIndividual() {
    this.createLeadForm.controls['nameThree'].setValidators(Validators.required);
    this.createLeadForm.controls['nameThree'].updateValueAndValidity();
    this.namePattern = 'alpha-nospace';
    this.nameFirstErrorMessage = 'First Name is mandatory';
    this.nameLastErrorMessage = 'Last Name is mandatory';
    this.firstPlaceholder = 'First Name';
    this.secondPlaceholder = 'Middle Name';
    this.thirdPlaceholder = 'Last Name';
    this.dobOrDoiPlaceHolder = 'Date of birth';
    this.isFirstNameRequired = true;
    this.isLastNameRequired = true;
  }

  onNonIndividual() {
    this.createLeadForm.controls['nameThree'].setValidators([]);
    this.createLeadForm.controls['nameThree'].updateValueAndValidity();
    this.namePattern = 'text';
    this.nameFirstErrorMessage = 'Company Name 1 is mandatory';
    this.nameLastErrorMessage = '';
    this.firstPlaceholder = 'Company Name 1';
    this.secondPlaceholder = 'Company Name 2';
    this.thirdPlaceholder = 'Company Name 3';
    this.dobOrDoiPlaceHolder = 'Date of Incorporation';
    this.isFirstNameRequired = false;
    this.isLastNameRequired = false;
  }

  onChangeLanguage(labels: string) {
    if (labels === 'Hindi') {
      this.labelsData.getLanguageLabelData().subscribe((data) => {
        this.labels = data[0];
      });
    } else {
      this.labelsData.getLabelsData().subscribe((data) => {
        this.labels = data;
      });
    }
  }

  onFirstName(event) {
    this.firstName = event.target.value;
    this.firstName = this.firstName.replace(/[^a-zA-Z ]/g, '');
  }

  onMiddleName(event) {
    this.middleName = event.target.value;
    this.middleName = this.middleName.replace(/[^a-zA-Z ]/g, '');
  }

  onLastName(event) {
    this.lastName = event.target.value;
    this.lastName = this.lastName.replace(/[^a-zA-Z ]/g, '');
  }

  onSubmit() {
    const formValue = this.createLeadForm.getRawValue();
    console.log('this.createLeadForm.valid', this.createLeadForm.valid);
    // console.log('isNgAutoCompleteDealer', this.createLeadForm.controls.dealerCode.value);
    console.log('isNgAutoCompleteSourcing', this.createLeadForm.controls.sourcingCode.value);
    this.isMobile = this.createLeadForm.controls.mobile.value;
    this.isDirty = true;


    if (
      this.createLeadForm.valid === true &&
      !this.isNgAutoCompleteDealer &&
      // this.isNgAutoCompleteSourcing !== '' &&
      !this.isDealerCode &&
      this.isSourceCode &&
      this.isMobile !== ''
    ) {
      const leadModel: any = { ...formValue };
      this.leadStoreService.setLeadCreation(leadModel);
      if (this.sourchingTypeId === '2SOURTYP') {
        this.dealorCodeKey = this.dealorCodeKey;
      } else {
        this.dealorCodeKey = leadModel.dealerCode ? leadModel.dealerCode.dealorCode : '';
      }

      this.loanLeadDetails = {
        bizDivision: leadModel.bizDivision,
        product: leadModel.product,
        priority: leadModel.priority,
        fundingProgram: leadModel.fundingProgram,
        sourcingChannel: leadModel.sourcingChannel,
        sourcingType: leadModel.sourcingType,
        sourcingCode: leadModel.sourcingCode
          ? leadModel.sourcingCode.key
          : '',
        dealorCode: this.dealorCodeKey,
        // spokeCode: Number(leadModel.spokeCode),
        spokeCode: 1,
        loanBranch: Number(this.branchId),
        leadHandeledBy: Number(this.userId),
        sourcingCodeDescription: leadModel.sourcingCode ? leadModel.sourcingCode.value : '',
        parentLoanAccNum: leadModel.loanAccountNumber,
        isCommSuppressed: Number(leadModel.communication)
      };

      this.applicantDetails = {
        entity: leadModel.entity,
        nameOne: leadModel.nameOne,
        nameTwo: leadModel.nameTwo ? leadModel.nameTwo : null,
        nameThree: leadModel.nameThree,
        mobileNumber: `91${leadModel.mobile}`,
        dobOrDoc: this.utilityService.getDateFormat(leadModel.dateOfBirth),
      };

      this.createLeadService
        .createLead(this.loanLeadDetails, this.applicantDetails, false)
        .subscribe(
          (res: any) => {
            const response = res;
            const appiyoError = response.Error;
            const apiError = response.ProcessVariables.error.code;

            if (appiyoError === '0' && apiError === '0') {
              this.createLeadDataService.setLeadData(
                this.loanLeadDetails,
                this.applicantDetails
              );

              const message = response.ProcessVariables.error.message;
              const isDedupeAvailable =
                response.ProcessVariables.isDedupeAvailable;
              const leadSectionData = response.ProcessVariables;
              this.leadId = leadSectionData.leadId;

              if (isDedupeAvailable) {
                const leadDedupeData =
                  response.ProcessVariables;
                this.leadStoreService.setDedupeData(leadDedupeData);
                this.router.navigateByUrl('pages/lead-creation/lead-dedupe');
                return;
              }

              this.createLeadService
                .getLeadById(this.leadId)
                .subscribe((res: any) => {
                  const response = res;
                  const appiyoError = response.Error;
                  const apiError = response.ProcessVariables.error.code;
                  const leadSectionData = response.ProcessVariables;

                  if (appiyoError === '0' && apiError === '0') {
                    this.leadId = leadSectionData.leadId;
                    this.createLeadDataService.setLeadSectionData(
                      leadSectionData
                    );
                    this.showModal = true;
                  } else {
                    const message = response.ProcessVariables.error.message;
                    this.toasterService.error(message, 'Lead Creation');
                  }
                });
            } else {
              const message = response.ProcessVariables.error.message;
              this.toasterService.error(message, 'Lead Creation');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.toasterService.error(
        'Please fill all mandatory fields.',
        'Lead Creation'
      );
    }
  }

  onLoanAccNoSearch() {
    const data = {
      loanAccountNumber: this.createLeadForm.controls.loanAccountNumber.value
    }
    this.childLoanApiService.searchChildLoanApi(data).subscribe(
      (res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        const errorMessage = response.ProcessVariables.error.message;

        if (appiyoError === '0' && apiError === '0') {
          const customerDetailsData = response.ProcessVariables.customerDetails;
          const loanDetailsData = response.ProcessVariables.loanDetails;
          console.log(customerDetailsData, '123', loanDetailsData);
          this.childLoanDatas = {
            firstName: customerDetailsData[0].firstName,
            middleName: customerDetailsData[0].middleName,
            lastName: customerDetailsData[0].lastName,
            entity: customerDetailsData[0].entityTypeID,
            mobile: customerDetailsData[0].mobileNumber,
            dobOrDoi: customerDetailsData[0].dobORdoi,
            loanAccountNumber: loanDetailsData[0].accountNumber,
            fromChild: true,
            fromCreateLead: true
          }

          this.updateChildLoan(this.childLoanDatas);

        } else {
          this.isLoanModal = true;
        }

      })
  }

  navgiateToSearchLoan() {
    this.router.navigateByUrl(`/pages/child-loan`);
  }

  childLoanModalClose() {
    this.isLoanModal = false;
  }

  navgiateToNextPage() {
    this.router.navigateByUrl(`pages/lead-section/${this.leadId}`, { state: { udfScreenId: 'LDS001' }});    
    // , skipLocationChange: true
    // this.router.navigate([`pages/lead-section/${this.leadId}`], { queryParams: { udfScreenId: this.udfScreenId } });
  }
}
