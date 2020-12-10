import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
import { VehicleDetailService } from '@services/vehicle-detail.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-existing-lead-creation',
  templateUrl: './existing-lead-creation.component.html',
  styleUrls: ['./existing-lead-creation.component.css']
})

export class ExistingLeadCreationComponent implements OnInit {

  createExternalLeadForm: FormGroup;
  lovLabels: any = [];
  labels: any = {};
  leadId: number;
  LOV: any = [];

  public maxAge: Date = new Date();
  public minAge: Date = new Date();

  public minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 15))
  public maxDate: Date = new Date();
  ageCount: number = 0;

  applicantType: string;
  namePattern: string;
  nameLength: number;
  mobileLength: number;
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  loanAccountBranch: string;
  branchId: number;
  isFromChild: boolean;

  bizDivId: string;
  businessDivision: any = [];
  isBusinessDivisionEnable: boolean;

  isDirty: boolean;
  nameFirstErrorMessage: string;
  nameLastErrorMessage: string;
  firstPlaceholder: string;
  secondPlaceholder: string;
  thirdPlaceholder: string;
  dobOrDoiPlaceHolder: string;
  isFirstNameRequired: boolean;
  isLastNameRequired: boolean;
  isSourchingCode: boolean;
  sourcingCodePlaceholder = 'Sourcing Code';
  dob: any;
  sourchingTypeId: string;
  isSourceCode: boolean = true;

  productCategoryData;
  productData = [];
  sourchingType: string;
  productCategorySelectedList = [];
  productCode: string;
  productCodeFromSearch: string;
  productCategoryList = [];
  sourcingChannelData = [];
  sourcingData = [];
  socuringTypeData = [];
  sourcingChange: any;
  placeholder = [];
  sourchingTypeValues = [];
  sourcingCodeData: Array<{ key: string; value: string }> = [];

  selectedproductCatoryCode: string;
  vehicleLov: any = {};
  assetBodyType: any = [];
  assetModelType: any = [];
  assetVariant: any = [];

  isMobile: string;
  isUcvUc: boolean;
  userId: string;
  showModal: boolean;

  extSourcingChannelData = [];
  extSourcingTypeData = [];
  extSourcingCodeData = [];
  extBranchData: any = [];
  isSourcingChannel: boolean;
  isSourcingType: boolean;
  isSourcingCode: boolean;
  leadIdFromDashboard: any;
  showApprove: boolean;
  mobileApprove: any;
  dobApprove: any;

  approveApplicantDetails: {
    name1: any,
    name2: any,
    name3: any,
    mobileNumber: any,
    dob: any
  }


  public vehicleRegPattern: {
    rule?: any;
    msg?: string;
  }[];

  regexPattern = {
    amount: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Amount / Alphabets and Special Characters not allowed',
    },
  };

  loanLeadDetails: {
    bizDivision: any,
    product: any,
    sourcingChannel: any,
    sourcingType: any,
    sourcingCode: any,
    loanBranch: any,
    totalLoanAmount: any,
    isCommSuppressed: number
  }

  applicantDetails: {
    entity: any,
    nameOne: any,
    nameTwo: any,
    nameThree: any,
    mobileNumber: any,
    dobOrDoc: any
  }

  constructor(
    private labelsData: LabelsService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadService: CreateLeadService,
    private utilityService: UtilityService,
    private ageValidationService: AgeValidationService,
    private vehicleDetailService: VehicleDetailService,
    private uiLoader: NgxUiLoaderService,
    private toasterService: ToasterService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private leadStoreService: LeadStoreService
  ) { }

  ngOnInit() {
    this.onChangeLanguage('English');
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.createExternalLeadForm.patchValue({ entity: 'INDIVENTTYP' });
    this.selectApplicantType('INDIVENTTYP', true);
    this.vehicleRegPattern = this.validateCustomPattern();
    this.leadIdFromDashboard = this.activatedRoute.snapshot.params.leadId;
    if (this.leadIdFromDashboard) {
      this.getLeadIdPool();
      this.createExternalLeadForm.disable();
    }
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

  getLOV() {
    this.commonLovService
      .getLovData()
      .subscribe((lov: any) => {
        (this.LOV = lov);
        this.getUserDetailsData();
      });
  }

  validateCustomPattern() {
    const regPatternData = [
      {
        rule: (inputValue) => {
          let patttern = '^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$';
          if (inputValue.length === 10) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{2}[0-9]{4}/).test(inputValue);
          } else if (inputValue.length === 9) {
            return !RegExp(/[A-Z-a-z]{2}[0-9]{2}[A-Z-a-z]{1}[0-9]{4}/).test(inputValue)
          } else {
            return true
          }
        },
        msg: 'Invalid Vehicle Registration Number, Valid Formats are: TN02AB1234/TN02A1234',
      }
    ];
    return regPatternData;
  }

  initForm() {
    this.createExternalLeadForm = new FormGroup({
      bizDivision: new FormControl('', Validators.required),
      productCategory: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      sourcingChannel: new FormControl('', Validators.required),
      sourcingType: new FormControl('', Validators.required),
      sourcingCode: new FormControl(''),
      loanBranch: new FormControl('', Validators.required),
      entity: new FormControl('', Validators.required),
      nameOne: new FormControl('', Validators.required),
      nameTwo: new FormControl(''),
      nameThree: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),

      reqLoanAmt: new FormControl('', Validators.required),

      vehicleRegNo: new FormControl(''),
      region: new FormControl('', Validators.required),
      assetMake: new FormControl('', Validators.required),
      vehicleType: new FormControl('', Validators.required),
      assetBodyType: new FormControl('', Validators.required),
      assetModel: new FormControl('', Validators.required),
      assetVariant: new FormControl('', Validators.required),
      vehicleId: new FormControl(''),
      assetSubVarient: new FormControl(''),
      manuFacMonthYear: new FormControl(''),
      communication: new FormControl('0'),
    });
  }

  getUserDetailsData() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
    console.log(roleAndUserDetails, 'Test');
    this.getBusinessDivision(roleAndUserDetails);
    this.userId = roleAndUserDetails.userDetails.userId;
    this.getSourcingDetails(this.userId);
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
      this.createExternalLeadForm.patchValue({ bizDivision: this.bizDivId });
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
          this.createExternalLeadForm.patchValue({
            productCategory: this.productCodeFromSearch
          });
        }

      });

  }

  productCategoryChange(event) {
    console.log('productCategoryChange', (event.target != undefined) ? event.target.value : event);
    const productCategorySelected = event.target ? event.target.value : event;
    this.selectedproductCatoryCode = productCategorySelected;
    this.isUcvUc = false;
    if (!['UCV', 'UC'].includes(this.selectedproductCatoryCode)) {

      this.createExternalLeadForm.get('vehicleRegNo').clearValidators();
      this.createExternalLeadForm.updateValueAndValidity();
      this.createExternalLeadForm.get('manuFacMonthYear').clearValidators();
      this.createExternalLeadForm.updateValueAndValidity();
      this.isUcvUc = false;
    } else {

      this.createExternalLeadForm.get('vehicleRegNo').setValidators(Validators.required);
      this.createExternalLeadForm.updateValueAndValidity();
      this.createExternalLeadForm.get('manuFacMonthYear').setValidators(Validators.required);
      this.createExternalLeadForm.updateValueAndValidity();
      this.isUcvUc = true;
    }
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
    this.createExternalLeadForm.patchValue({ product: '' });
  }

  productChange(event) {
    // this.fundingProgramData = [];
    console.log('productChange', event.target.value);
    const productChange = event.target.value;
    this.productCode = event.target.value;
  }

  getSourcingDetails(userId) {
    this.createLeadService.getExternalSourcingChannel(userId).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      // const apiError = response.ProcessVariables.error.code;
      // const errorMessage = response.ProcessVariables.error.message;

      // if (appiyoError === '0' && apiError === '0') {
      console.log('extSRC', response);
      this.extSourcingChannelData = response.ProcessVariables.srcChannel;
      this.extSourcingTypeData = response.ProcessVariables.srcType;
      this.extSourcingCodeData = response.ProcessVariables.srcCode;
      this.extBranchData = response.ProcessVariables.branch;
      const srcChannel = this.extSourcingChannelData.length;
      const srcType = this.extSourcingTypeData.length;
      const srcCode = this.extSourcingCodeData.length;
      if (srcChannel === 1) {
        this.createExternalLeadForm.patchValue({
          sourcingChannel: this.extSourcingChannelData[0].key
        });
        this.isSourcingChannel = true;
      }
      if (srcType === 1) {
        this.createExternalLeadForm.patchValue({
          sourcingType: this.extSourcingTypeData[0].key
        });
        this.isSourcingType = true;
      }
      if (srcCode === 1) {
        this.createExternalLeadForm.patchValue({
          sourcingCode: this.extSourcingCodeData[0].key
        });
        this.isSourcingCode = true;
      }
    })
  }

  sourcingChannelChange(event) { }
  sourchingTypeChange(event) { }
  sourchingCodeChange(event) { }

  onBranchChange(event) {
    console.log('brach', event.target.value);
  }


  selectApplicantType(event: any, bool) {
    this.applicantType = bool ? event : event.target.value;
    console.log('applicantType', this.applicantType);
    (this.applicantType === 'INDIVENTTYP') ? this.onIndividual() : this.onNonIndividual();
    setTimeout(() => {
      const nameOne = this.createExternalLeadForm.controls['nameOne'].value;
      this.createExternalLeadForm.controls['nameOne'].setValue(nameOne || '');
      const nameThree = this.createExternalLeadForm.controls['nameThree'].value;
      this.createExternalLeadForm.controls['nameThree'].setValue(nameThree || '');
    });
    this.ageCount++;
    this.getAgeValidation();
  }

  onIndividual() {
    this.createExternalLeadForm.controls['nameThree'].setValidators(Validators.required);
    this.createExternalLeadForm.controls['nameThree'].updateValueAndValidity();
    this.namePattern = 'alpha';
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
    this.createExternalLeadForm.controls['nameThree'].setValidators([]);
    this.createExternalLeadForm.controls['nameThree'].updateValueAndValidity();
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

  onVehicleRegion(value: any, obj) {
    const region = value ? value : '';
    let assetMakeArray = [];
    const data = {
      "region": region,
      "productCategory": this.selectedproductCatoryCode
    }

    this.vehicleDetailService.getVehicleMasterFromRegion(data).subscribe((res: any) => {
      this.uiLoader.start();
      if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

        if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {

          assetMakeArray = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
            "uniqueMFRCode", "mfrCode")
          this.vehicleLov.assetMake = assetMakeArray;
          this.createExternalLeadForm.patchValue({
            assetMake: '',
            vehicleType: '',
            assetBodyType: '',
            assetModel: '',
            assetVariant: ''
          })
        } else {
          this.vehicleLov.assetMake = [];
          this.toasterService.showWarning('No Data in Vehicle Master Region', 'Vehicle Master Region')
        }
      } else {
        this.vehicleLov.assetMake = [];
        this.toasterService.showWarning(res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message, 'Vehicle Master Region')
      }
      this.uiLoader.stop();
    }, error => {
      console.log(error, 'error')
      this.uiLoader.stop();
    })
  }

  onAssetMake(value, obj) {
    let VehicleTypeArray = []

    if (value) {

      const data = {
        "region": obj.value.region,
        "productCategory": this.selectedproductCatoryCode,
        "make": value
      }

      this.vehicleDetailService.getVehicleMasterFromAssetMake(data).subscribe((res: any) => {
        this.uiLoader.start();
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

          if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {

            VehicleTypeArray = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
              "vehicleTypeUniqueCode", "vehicleTypeCode");

            this.vehicleLov.vehicleType = VehicleTypeArray;
            this.createExternalLeadForm.patchValue({
              vehicleType: '',
              assetBodyType: '',
              assetModel: '',
              assetVariant: ''
            })

          } else {
            this.vehicleLov.vehicleType = []
            this.toasterService.showWarning('No Data in Vehicle Master Asset Make', 'Vehicle Master Asset Make')
          }
        } else {
          this.vehicleLov.vehicleType = []
          this.toasterService.showWarning(
            res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message,
            'Vehicle Master Asset Make')
        }
        this.uiLoader.stop();
      }, error => {
        console.log(error, 'error')
        this.uiLoader.stop();
      });
    }
  }

  onVehicleType(value, obj) {

    let assetBodyType = []

    if (value) {

      const data =
      {
        "region": obj.value.region,
        "productCategory": this.selectedproductCatoryCode,
        "make": obj.value.assetMake,
        "vehicleType": value
      }

      this.vehicleDetailService.getVehicleMasterFromVehicleType(data).subscribe((res: any) => {
        this.uiLoader.start();
        if (res.Error === '0' && res.ProcessVariables.error.code === '0') {

          if (res.ProcessVariables.vehicleMasterDetails && res.ProcessVariables.vehicleMasterDetails.length > 0) {
            this.assetBodyType = res.ProcessVariables.vehicleMasterDetails;
            assetBodyType = this.utilityService.getValueFromJSON(res.ProcessVariables.vehicleMasterDetails,
              "uniqueSegmentCode", "segmentCode");

            this.vehicleLov.assetBodyType = assetBodyType;

            this.createExternalLeadForm.patchValue({
              assetBodyType: '',
              assetModel: '',
              assetVariant: ''
            })

          } else {
            this.vehicleLov.assetBodyType = []
            this.toasterService.showWarning(
              'No Data in Vehicle Master Vehicle Type',
              'Vehicle Master Vehicle Type')
          }
        } else {
          this.vehicleLov.assetBodyType = []
          this.toasterService.showWarning(
            res.ErrorMessage ? res.ErrorMessage : res.ProcessVariables.error.message,
            'Vehicle Master Vehicle Type')
        }
        this.uiLoader.stop();
      }, error => {
        console.log(error, 'error')
        this.uiLoader.stop();
      });
    }
  }

  onAssetBodyType(value: any, obj) {
    this.assetModelType = this.assetBodyType.filter((data) => data.uniqueSegmentCode === value)
    this.vehicleLov.assetModel = this.utilityService.getValueFromJSON(this.assetModelType,
      "vehicleModelCode", "vehicleModel")

    this.createExternalLeadForm.patchValue({
      assetModel: '',
      assetVariant: ''
    })
  }

  onAssetModel(value: any, obj) {
    this.assetVariant = this.assetModelType.filter((data) => data.vehicleModelCode === value)
    const array = this.utilityService.getCommonUniqueValue(this.assetVariant, 'vehicleVariant')
    const vehicleId = array.length > 0 ? Number(array[0].vehicleCode) : 0

    this.vehicleLov.assetVariant = this.utilityService.getValueFromJSON(this.assetVariant,
      'vehicleCode', "vehicleVariant")

    this.createExternalLeadForm.patchValue({
      assetVariant: '',
      vehicleId: vehicleId
    })

  }

  onSubmit() {
    if (!['UCV', 'UC'].includes(this.selectedproductCatoryCode)) {
      console.log('UCVUC', 'true')
      this.createExternalLeadForm.patchValue({
        vehicleRegNo: '',
        manuFacMonthYear: ''
      });
    }
    const formValue = this.createExternalLeadForm.getRawValue();
    this.isMobile = this.createExternalLeadForm.controls.mobile.value;
    this.isDirty = true;
    if (
      this.createExternalLeadForm.valid === true &&
      this.isSourceCode &&
      this.isMobile !== ''
    ) {
      const data: any = { ...formValue };
      this.loanLeadDetails = {
        bizDivision: data.bizDivision,
        product: data.product,
        sourcingChannel: data.sourcingChannel,
        sourcingType: data.sourcingType,
        sourcingCode: data.sourcingCode,
        loanBranch: Number(data.loanBranch),
        totalLoanAmount: data.reqLoanAmt,
        isCommSuppressed: Number(data.communication)
      }

      this.applicantDetails = {
        entity: data.entity,
        nameOne: data.nameOne,
        nameTwo: data.nameTwo ? data.nameTwo : null,
        nameThree: data.nameThree,
        mobileNumber: `91${data.mobile}`,
        dobOrDoc: this.utilityService.getDateFormat(data.dateOfBirth)
      }

      const vehicleId = data.vehicleId;
      const vehicleRegNo = data.vehicleRegNo;
      const manuFacMonthYear = this.utilityService.convertDateTimeTOUTC(data.manuFacMonthYear, 'DD/MM/YYYY');

      this.createLeadService.createExternalLead(
        this.loanLeadDetails,
        this.applicantDetails,
        this.userId,
        vehicleId,
        vehicleRegNo,
        manuFacMonthYear).subscribe(
          (res: any) => {
            const response = res;
            const appiyoError = response.Error;
            const apiError = response.ProcessVariables.error.code;
            const errorMessage = response.ProcessVariables.error.message;

            if (appiyoError === '0' && apiError === '0') {
              this.toasterService.showSuccess('Record Saved Successfully !', 'Create External Lead');
              this.leadId = response.ProcessVariables.leadId;
              this.showModal = true;
            } else {
              this.toasterService.showError(errorMessage, 'Create External Lead');
            }

          });
      console.log('createExternalUser', this.createExternalLeadForm.value);
    } else {
      this.toasterService.showError('Please fill all mandatory fields', 'External User');
    }
  }

  navgiateToNextPage() {
    this.router.navigateByUrl(`/pages/dashboard`);
    this.showModal = false;
  }

  getLeadIdPool() {
    this.createLeadService.leadIdByPool(this.leadIdFromDashboard).subscribe(
      (res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        const errorMessage = response.ProcessVariables.error.message;

        if (appiyoError === '0' && apiError === '0') {
          console.log('byPool', response);
          const productCategory = response.ProcessVariables.leadDetails.productCatCode;
          this.productCategoryChange(productCategory);
          const product = response.ProcessVariables.leadDetails.productId;
          const loanBranch = response.ProcessVariables.leadDetails.branchId;
          const communication = response.ProcessVariables.leadDetails.isCommSuppressed;
          const entity = response.ProcessVariables.applicantDetails[0].entityTypeKey;
          const nameOne = response.ProcessVariables.applicantDetails[0].name1;
          const nameTwo = response.ProcessVariables.applicantDetails[0].name2;
          const nameThree = response.ProcessVariables.applicantDetails[0].name3;
          this.firstName = nameOne;
          this.middleName = nameTwo;
          this.lastName = nameThree;
          const mobileNumber: string = response.ProcessVariables.applicantDetails[0].mobileNumber;
          let mobile = mobileNumber;
          if (mobileNumber && mobileNumber.length === 12) {
            mobile = mobileNumber ? mobileNumber.slice(2) : null;
          }
          const dob = response.ProcessVariables.applicantDetails[0].dob;
          const dateOfBirth = dob ? this.utilityService.getDateFromString(dob.slice()) : null;
          this.mobileApprove = mobile;
          this.dobApprove = dob;

          const sourcingChannel = response.ProcessVariables.leadDetails.sourcingChannel;
          const sourcingType = response.ProcessVariables.leadDetails.sourcingType;
          const sourcingCode = response.ProcessVariables.leadDetails.sourcingCode;

          const reqLoanAmt = response.ProcessVariables.leadDetails.reqLoanAmt;
          const vehicleRegNo = response.ProcessVariables.vehicleCollateral ?
            response.ProcessVariables.vehicleCollateral[0].regNo : null;
          const region = response.ProcessVariables.vehicleCollateral ?
            response.ProcessVariables.vehicleCollateral[0].regionCode : '';

          const vehilce: Array<any> = response.ProcessVariables.vehicleCollateral;
          if (vehilce && vehilce.length > 0) {
            this.vehicleLov.assetMake = [{ key: vehilce[0].makeCode, value: vehilce[0].make }];
            this.vehicleLov.vehicleType = [{ key: vehilce[0].vehicleTypeCode, value: vehilce[0].vehicleType }];
            this.vehicleLov.assetBodyType = [{ key: vehilce[0].segmentCode, value: vehilce[0].segment }];
            this.vehicleLov.assetModel = [{ key: vehilce[0].modelCode, value: vehilce[0].model }];
            this.vehicleLov.assetVariant = [{ key: 'variantKey', value: vehilce[0].variant }];
          }
          this.selectApplicantType(entity, true);
          let assetMake = '';
          let vehicleType = '';
          let assetBodyType = '';
          let assetModel = '';
          let assetVariant = '';
          let dobyymm = '';
          let manuFacMonthYear;
          if (response.ProcessVariables.vehicleCollateral) {
             assetMake = response.ProcessVariables.vehicleCollateral[0].makeCode;
             vehicleType = response.ProcessVariables.vehicleCollateral[0].vehicleTypeCode;
             assetBodyType = response.ProcessVariables.vehicleCollateral[0].segmentCode;
             assetModel = response.ProcessVariables.vehicleCollateral[0].modelCode;
             assetVariant = 'variantKey';
             dobyymm = response.ProcessVariables.vehicleCollateral[0].manuMonYear;
             manuFacMonthYear = this.utilityService.getDateFromString(dobyymm.slice());
          }
          
         
          this.createExternalLeadForm.patchValue({
            productCategory,
            product,
            loanBranch,
            communication,
            entity,
            nameOne,
            nameTwo,
            nameThree,
            mobile,
            dateOfBirth,
            sourcingChannel,
            sourcingType,
            sourcingCode,
            reqLoanAmt,
            vehicleRegNo,
            region,
            assetMake,
            vehicleType,
            assetBodyType,
            assetModel,
            assetVariant,
            manuFacMonthYear
          });
        }
      });
  }

  onApprove() {
    this.approveApplicantDetails = {
      name1: this.firstName,
      name2: this.middleName,
      name3: this.lastName,
      mobileNumber: this.mobileApprove,
      dob: this.dobApprove
    }
    this.createLeadService.externalApprove(this.approveApplicantDetails, this.leadIdFromDashboard).subscribe(
      (res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;
        const errorMessage = response.ProcessVariables.error.message;

        if (appiyoError === '0' && apiError === '0') {
          console.log('resext', response);
          const isDedupeAvailable = response.ProcessVariables.isDedupeAvailable;
          if (isDedupeAvailable) {
            const leadDedupeData = response.ProcessVariables;
            this.leadStoreService.setDedupeData(leadDedupeData);
            this.router.navigateByUrl('pages/lead-creation/lead-dedupe');
            return;
          }
          this.router.navigateByUrl(`pages/lead-section/${this.leadIdFromDashboard}`);
        } else {
          this.toasterService.showError(errorMessage, 'Approve Lead');
        }

      })
  }

  onApproveModel() {
    this.showApprove = true;
  }
  closeApprove() {
    this.showApprove = false;
  }

  navgiateToLead() {
    this.onApprove();
  }



}

