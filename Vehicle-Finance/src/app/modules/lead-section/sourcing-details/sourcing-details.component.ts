import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { LabelsService } from 'src/app/services/labels.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { CreateLeadService } from '../../lead-creation/service/creatLead.service';
import { LoginStoreService } from '@services/login-store.service';
import { LeadDetails } from '../services/sourcingLeadDetails.service';
import { SharedService } from '@shared/shared-service/shared-service';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { VehicleDataStoreService } from '@services/vehicle-data-store.service';
import { debounce } from 'rxjs/operators';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { LoanViewService } from '@services/loan-view.service';


@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css'],
})
export class SourcingDetailsComponent implements OnInit {
  isLoan360: boolean;
  isDisabledDealerCode: boolean;
  labels: any = {};
  sourcingDetailsForm: FormGroup;
  LOV: any;
  isAlert: boolean;

  bizDivId: string;
  leadData: any;
  userId: any;
  branchId: any;
  leadId: number;
  isSpoke: boolean;
  // leadCreatedBy: string;
  Item: { key: string; value: string };
  businessDivisionArray = [];
  productCategoryArray: Array<any> = [];
  sourchingTypeData = [];
  sourcingChange: any;
  sourcingCodePlaceholder: string = 'Sourcing Code';
  productCategorySelectedList = [];

  spokesCodeLocation: any;
  sourchingTypeValues: any;
  loanAccountBranch: any;
  leadHandeledBy: any;

  productCategoryFromLead: string;
  fundingProgramFromLead: any;
  sourchingTypeFromLead: any;
  sourchingChannelFromLead: any;
  productFromLead: number;
  leadCreatedDateFromLead: string;
  isBusinessDivisionEnable: boolean;
  productCategoryList = [];
  productCategoryData: any;
  productCategoryChanged: string;
  alertTimeOut: any;
  isProductCategory: boolean;
  isSourcingType: boolean;
  keyword: string;
  placeholder = [];
  sourcingData = [];

  fundingProgramData = [];
  sourcingChannelData = [];
  socuringTypeData = [];
  sourcingCodeData: Array<{ key: string; value: string }> = [];
  dealerCodeData: Array<any> = [];
  leadData$: BehaviorSubject<any> = new BehaviorSubject([]);

  sourcingCodeKey: string;
  sourcingCodeValue: string;
  dealorCodeKey: string;
  dealorCodeValue: string;
  isSourceCode: boolean;
  isProductChange: boolean;

  isSourchingCode: boolean;
  isDealorCode: boolean;
  isDirty: boolean;
  isSaved: boolean;
  amountTenureData: any;
  leadSectionData: any;
  loanTypeValues: any = [];
  selectedLoanType: string;

  tenureMonthlyValidation: {
    rule?: any;
    msg?: string;
  }[];

  tenureAmountValidation: {
    rule?: any,
    msg?: string
  }[];

  reqLoanAmount: number;

  sourcingCodeObject: {
    key: string;
    value: string;
  };

  dealorCodeObject: {
    key: string;
    value: string;
  };

  regexPattern = {
    amount: {
      rule: '^[1-9][0-9]*$',
      msg: 'Invalid Amount / Alphabets and Special Characters not allowed',
    },
  };

  isChildLoan: string;

  amountLength: number;
  tenureMonthLength: number;
  totalLoanAmountLength: number;
  principalAmountLength: number;
  emiLength: number;
  dpdLength: number;
  seasoningLength: number;
  productCategoryLoanAmount: any;
  applicationNoLength: any;
  isDealerCode: boolean;
  sourchingTypeId: string;

  saveUpdate: {
    bizDivision: string;
    productCatCode?: string;
    productId: any;
    priority: number;
    applicationNo: number;
    fundingProgram: string;
    sourcingChannel: string;
    sourcingType: string;
    sourcingCode: string;
    sourcingCodeDesc?: string;
    dealorCode: string;
    dealorCodeDesc?: string;
    spokeCode: number;
    loanBranch: number;
    leadHandeledBy: number;
    leadCreatedBy: number;
    leadCreatedOn: string;
    typeOfLoan: string;
    reqLoanAmt: number;
    reqTenure: number;
    userId: number;
    leadId: number;
    totalLoanAmount?: string,
    parentLoanAccNum?: any;
    principalPaid?: string,
    principalOutstanding?: string,
    dpd?: string,
    emi?: string,
    rateOfInterest?: string,
    tenor?: string,
    remainingTenor?: string,
    seasoning?: string,
    isCommSuppressed: number,
    udfDetails?: any
  };
  operationType: boolean;
  apiValue: any;
  finalValue: any;
  productCode: any;
  isRemoveDealer: boolean;

  // User defined Fields
  udfScreenId: string = 'LDS001';
  udfGroupId: string = 'LDG001';
  udfDetails: any = [];
  userDefineForm: any;

  constructor(
    private leadSectionService: VehicleDetailService,
    private vehicleDataStore: VehicleDataStoreService,
    private router: Router,
    private createLeadService: CreateLeadService,
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private createLeadDataService: CreateLeadDataService,
    private loginService: LoginStoreService,
    private leadDetail: LeadDetails,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private toggleDdeService: ToggleDdeService,
    private objectComparisonService: ObjectComparisonService,
    private applicantDataStoreService: ApplicantDataStoreService,
    private loanViewService: LoanViewService
  ) {
    this.sourcingCodeObject = {
      key: '',
      value: '',
    };

    this.dealorCodeObject = {
      key: '',
      value: '',
    };
  }

  ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    console.log('this.isLoan360', this.isLoan360)
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getSourcingChannel();
    this.tenureMonthlyValidation = this.loanTenureMonth();
    this.operationType = this.toggleDdeService.getOperationType();
    const currentUrl = this.location.path();
    this.udfScreenId = currentUrl.includes('sales') ? 'LDS002': currentUrl.includes('dde') ? 'LDS003' : 'LDS001';
  }

  navigateToPrevious() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/loan-details`);
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.amountLength = this.labels.validationData.amountValue.maxLength;
        this.tenureMonthLength = this.labels.validationData.tenurePaid.maxLength;
        this.applicationNoLength = this.labels.validationData.applicationNo.maxLength;
        this.totalLoanAmountLength = this.labels.validationData.totalLoanAmount.maxLength;
        this.principalAmountLength = this.labels.validationData.principalAmount.maxLength;
        this.emiLength = this.labels.validationData.emi.maxLength;
        this.dpdLength = this.labels.validationData.dpd.maxLength;
        this.seasoningLength = this.labels.validationData.seasoning.maxLength;
      },
      (error) => console.log('Sourcing details Label Error', error)
    );
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      this.getLeadSectionData();
      this.getUserDetailsData();
    });
  }

  getUserDetailsData() {
    const roleAndUserDetails = this.loginService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
    this.getBusinessDivision(roleAndUserDetails);

    this.branchId = roleAndUserDetails.userDetails.branchId;
    const branchName = roleAndUserDetails.userDetails.branchName;
    this.loanAccountBranch = `${this.branchId}-${branchName}`;

    const userId = roleAndUserDetails.userDetails.userId;
    const userName = roleAndUserDetails.userDetails.firstName;
    this.leadHandeledBy = `${userId}-${userName}`;
    this.userId = userId;
    this.isSpoke = roleAndUserDetails.userDetails.isSpokes;
    this.spokesCodeLocation = this.isSpoke
      ? roleAndUserDetails.userDetails.parentBranch
      : null;
    this.sourcingDetailsForm.patchValue({ loanBranch: this.loanAccountBranch });
    this.sourcingDetailsForm.patchValue({
      leadHandeledBy: this.leadHandeledBy,
    });
  }

  async getLeadSectionData() {

    this.leadSectionData = this.createLeadDataService.getLeadSectionData();
    console.log('leadSectionData Lead details', this.leadSectionData);
    const applicantList = this.leadSectionData.applicantDetails;
    this.applicantDataStoreService.setApplicantList(applicantList);
    this.leadData = { ...this.leadSectionData };
    const data = this.leadData;

    this.udfDetails = this.leadSectionData.udfDetails ? this.leadSectionData.udfDetails : [];

    this.isChildLoan = data.leadDetails.isChildLoan;
    if (this.isChildLoan === '0') {
      this.removeChildLoan();
    } else {
      let loanLeadDetails = this.leadData.loanLeadDetails;
      console.log(this.leadData.loanLeadDetails, 'Loan')
      // this.isRemoveDealer = 

      // const childLoanData = this.leadData.loanLeadDetails;
      this.sourcingDetailsForm.patchValue({
        totalLoanAmount: loanLeadDetails.totalLoanAmount,
        principalPaid: loanLeadDetails.principalPaid,
        principalOutstanding: loanLeadDetails.principalOutstanding,
        dpd: loanLeadDetails.dpd,
        emi: loanLeadDetails.emi,
        rateOfInterest: loanLeadDetails.rateOfInterest,
        tenor: loanLeadDetails.tenor,
        remainingTenor: loanLeadDetails.remainingTenor,
        seasoning: loanLeadDetails.seasoning,
        loanAccountNumber: loanLeadDetails.parentLoanAccNum
      });
    }

    const currentUrl = this.location.path();
    if (currentUrl.includes('sales')) {
      this.leadId = (await this.getLeadId()) as number;
    }

    const businessDivisionFromLead: string = data.leadDetails.bizDivision;
    this.bizDivId = businessDivisionFromLead;

    const productCategory = data.leadDetails.productCatCode;
    this.productCategoryFromLead = productCategory;

    const product = data.leadDetails.productId;
    this.productFromLead = product;

    const fundingProgram = data.leadDetails.fundingProgram;
    this.fundingProgramFromLead = fundingProgram;

    this.dealorCodeKey = data.leadDetails.dealorCode;
    this.dealorCodeValue = data.leadDetails.dealorCodeDesc;

    const priorityFromLead = data.leadDetails.priority || '';
    const CommunicationFromLead = data.loanLeadDetails.isCommSuppressed;
    this.leadId = data.leadId ? data.leadId : data.leadDetails.leadId;

    const sourchingType = this.leadData.leadDetails.sourcingType;
    this.sourchingTypeFromLead = sourchingType;

    const sourchingChannel = this.leadData.leadDetails.sourcingChannel;
    this.sourchingChannelFromLead = sourchingChannel;

    const leadCreatedDate = data.leadDetails.leadCreatedOn;
    this.leadCreatedDateFromLead = String(leadCreatedDate).slice(0, 10);

    const requiredLoanAmount = data.leadDetails.reqLoanAmt;
    const requiredLoanTenor = data.leadDetails.reqTenure;
    this.reqLoanAmount = requiredLoanAmount;
    this.sourcingDetailsForm.patchValue({ reqLoanAmt: requiredLoanAmount });
    this.sourcingDetailsForm.patchValue({ requestedTenor: requiredLoanTenor });

    this.sourcingDetailsForm.patchValue({ dealerCode: this.dealorCodeValue });
    this.isDealorCode = this.dealorCodeKey ? true : false;

    const leadCreatedby = data.leadDetails.leadCreatedBy;
    this.sourcingDetailsForm.patchValue({ leadCreatedBy: leadCreatedby });

    const applicationNO = data.leadDetails.applicationNo;
    this.sourcingDetailsForm.patchValue({ applicationNo: applicationNO });

    const loanTypeFromLead = (data.leadDetails.typeOfLoan) ? data.leadDetails.typeOfLoan : '';
    this.sourcingDetailsForm.patchValue({ loanType: loanTypeFromLead });

    this.getBusinessDivision(businessDivisionFromLead);
    this.sourcingDetailsForm.patchValue({ priority: priorityFromLead });
    this.sourcingDetailsForm.patchValue({ communication: CommunicationFromLead });
    this.sourcingDetailsForm.patchValue({ leadNumber: this.leadId });
    this.sourcingDetailsForm.patchValue({
      leadCreatedDate: this.leadCreatedDateFromLead,
    });
    this.apiValue = this.sourcingDetailsForm.getRawValue();
    if (this.isLoan360) {
      this.sourcingDetailsForm.disable();
    }
  }

  patchSourcingDetails(data) {
    this.sourcingDetailsForm.patchValue({
      sourcingChannel: this.sourchingChannelFromLead,
    });

    this.sourchingTypeChange(this.sourchingTypeFromLead);
    this.sourcingDetailsForm.patchValue({
      sourcingType: this.sourchingTypeFromLead,
    });

    this.sourcingCodeKey = data.leadDetails.sourcingCode;
    this.sourcingCodeValue = data.leadDetails.sourcingCodeDesc;
    const sourceCodeKey = (this.sourcingCodeKey == null) ? 'Not Applicable' : this.sourcingCodeValue;
    this.sourcingDetailsForm.patchValue({ sourcingCode: sourceCodeKey });
    this.isSourceCode = true;
    this.apiValue = this.sourcingDetailsForm.getRawValue();
  }

  getBusinessDivision(bizDivision) {
    const businessKey = bizDivision;
    const lov = this.LOV.LOVS.businessDivision;
    lov.map((data) => {
      if (data.key === businessKey) {
        const val = {
          key: data.key,
          value: data.value,
        };
        this.businessDivisionArray.push(val);
        this.sourcingDetailsForm.patchValue({ bizDivision: data.key });
      }
    });
    if (this.businessDivisionArray.length === 1) {
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
        this.productCategory(this.productCategoryFromLead, false);
      });
    this.sourcingDetailsForm.patchValue({
      productCategory: this.productCategoryFromLead,
    });
    this.sourcingDetailsForm.patchValue({ product: this.productFromLead });
  }

  productCategory(event, isBool) {
    if (!isBool) {
      this.sourcingDetailsForm.patchValue({ reqLoanAmt: this.reqLoanAmount });
    } else {
      this.sourcingDetailsForm.patchValue({ reqLoanAmt: 0 });
    }
    this.productCategorySelectedList = [];
    const productCategorySelected = isBool ? event.target.value : event;
    let filterList = [];
    if (this.isChildLoan === '0') {
      filterList = this.productCategoryList.filter(
        (data) => data.productCatCode === productCategorySelected && data.isChildLoan === '0'
      );
    } else if (this.isChildLoan === '1') {
      filterList = this.productCategoryList.filter(
        (data) => data.productCatCode === productCategorySelected && data.isChildLoan === '1'
      );
    }

    this.productCategorySelectedList = this.utilityService.getValueFromJSON(
      filterList,
      'assetProdcutCode',
      'assetProdutName'
    );

    if (isBool === true) {
      this.sourcingDetailsForm.patchValue({ product: '' });
    }

    if (productCategorySelected) {
      this.productCategoryData.map((data) => {
        if (data.key === productCategorySelected) {
          this.productCategoryChanged = data.value;
          this.productCategoryLoanAmount = productCategorySelected;
        }
      });
      if (!this.isProductChange) {
        this.productChange(this.productFromLead);
        this.isProductChange = true;
      }
      this.tenureAmountValidation = this.loanTenureAmount(this.productCategoryLoanAmount);
    }
  }

  productChange(event) {
    this.fundingProgramData = [];
    const productChange = event.target ? event.target.value : event;
    this.productCode = event.target ? event.target.value : event;
    console.log('productChange', productChange);

    this.createLeadService
      .fundingPrograming(productChange)
      .subscribe((res: any) => {
        const response = res;
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;

        if (appiyoError === '0' && apiError === '0') {
          const data = response.ProcessVariables.fpList;
          this.fundingProgramData = [];
          if (data) {
            data.map((ele) => {
              const datas = {
                key: ele.fpId,
                value: ele.fpDescription,
              };
              this.fundingProgramData.push(datas);
            });
          }

          console.log('fundingProgramData', this.fundingProgramData);
          console.log('fundingProgramFromLead', this.fundingProgramFromLead);
          if (!event.target) {
            this.sourcingDetailsForm.patchValue({
              fundingProgram: this.fundingProgramFromLead,
            });
            this.apiValue = this.sourcingDetailsForm.getRawValue();
          }
        }
      });
    this.sourcingDetailsForm.patchValue({ fundingProgram: '' });
  }

  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      console.log('sourching', response);
      this.sourcingData = response;
      this.sourcingChannelData = this.utilityService.getValueFromJSON(
        this.sourcingData,
        'sourcingChannelId',
        'sourcingChannelDesc'
      );
      this.sourcingChannelChange(this.sourchingChannelFromLead, false);
      this.patchSourcingDetails(this.leadData);
    });
  }

  sourcingChannelChange(event: any, fromLead?) {
    this.sourchingTypeValues = [];
    this.sourcingChange = fromLead ? event.target.value : event;
    this.sourchingTypeValues = this.utilityService.getValueFromJSON(
      this.sourcingData.filter(
        (data) => data.sourcingChannelId === this.sourcingChange
      ),
      'sourcingTypeId',
      'sourcingTypeDesc'
    );
    if (fromLead) {
      this.sourcingDetailsForm.patchValue({ sourcingType: '' });
    }

    if (this.sourchingTypeValues.length === 1) {
      const sourcingTypeData = this.sourchingTypeValues[0].key;
      this.sourcingDetailsForm.patchValue({ sourcingType: sourcingTypeData });
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
    }
  }

  sourchingTypeChange(event) {
    this.sourchingTypeId = event.target ? event.target.value : event;
    if (this.sourchingTypeId === '2SOURTYP') {
      this.sourcingDetailsForm.controls['dealerCode'].setValidators(Validators.required);
      this.sourcingDetailsForm.controls['dealerCode'].updateValueAndValidity();
      // this.isDealerCode = true;
      this.isDealerCode = this.dealorCodeKey ? false : true;
    } else {
      this.sourcingDetailsForm.controls['dealerCode'].setValidators([]);
      this.sourcingDetailsForm.controls['dealerCode'].updateValueAndValidity();
      this.isDealerCode = false;
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
    this.sourcingDetailsForm.controls.sourcingCode.reset();
    this.sourcingCodePlaceholder = this.placeholder.length > 0 ? this.placeholder[0].value : '';
    if (this.sourcingCodePlaceholder === 'Not Applicable') {
      this.isSourchingCode = true;
      this.sourcingCodeKey = null;
      this.isSourceCode = true;
    } else {
      this.isSourchingCode = false;
      this.isSourceCode = false;
    }
    this.onFormDisable();
  }

  onSourcingCodeSearch(event) {
    let inputString = event;
    let sourcingCode = [];
    console.log('inputString', event);
    sourcingCode = this.socuringTypeData.filter(
      (data) => data.sourcingCodeType === this.placeholder[0].key
    );
    console.log('sourcingCode', sourcingCode);
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
          this.keyword = 'value';
        }
      });
  }

  selectSourcingEvent(event) {
    const sourcingEvent = event;
    console.log('sourcingEvent', sourcingEvent);
    this.isSourceCode = sourcingEvent.key ? true : false;
    this.sourcingCodeKey = sourcingEvent.key;
    this.sourcingCodeValue = sourcingEvent.value;
    if (this.sourchingTypeId === '2SOURTYP') {
      this.onDealerCodeSearch(sourcingEvent.key);
      this.sourcingDetailsForm.patchValue({ dealerCode: sourcingEvent.value });
      this.dealorCodeKey = sourcingEvent.key;
    }
  }

  onSourcingCodeClear(event) {
    this.sourcingCodeKey = '';
    this.isSourceCode = false;
  }

  onDealerCodeSearch(event) {
    let inputString = event;
    let dealerCode = [];
    console.log('code', event);
    this.createLeadService.dealerCode(inputString, this.productCode).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.dealerCodeData = response.ProcessVariables.dealorDetails;
        if (this.sourchingTypeId === '2SOURTYP') {
          if (this.dealerCodeData != null){
          this.selectDealorEvent(this.dealerCodeData[0]);
          }
        }
        this.keyword = 'dealorName';
        console.log('this.dealerCodeData', this.dealerCodeData);
      }
    });
  }

  selectDealorEvent(event) {
    const dealorEvent = event;
    console.log('dealorEvent', dealorEvent);
    this.isDealorCode = dealorEvent.dealorCode ? true : false;
    this.dealorCodeKey = dealorEvent.dealorCode;
    this.dealorCodeValue = dealorEvent.dealorName;
    if (this.isDealerCode) {
      this.isDealerCode = this.isDealorCode ? false : true;
    }
  }

  onDealerCodeClear(event) {
    this.dealorCodeKey = '';
    if (this.sourchingTypeId === '2SOURTYP') {
      this.isDealerCode = true;
    } else {
      this.isDealerCode = false;
    }
  }

  onLoanTypeTypeChange(event) {
    this.selectedLoanType = event.target.value;
  }

  initForm() {
    this.sourcingDetailsForm = new FormGroup({
      leadNumber: new FormControl('', Validators.required),
      leadCreatedDate: new FormControl('', Validators.required),
      leadCreatedBy: new FormControl('', Validators.required),
      leadHandeledBy: new FormControl('', Validators.required),
      productCategory: new FormControl('', Validators.required),
      priority: new FormControl(''),
      applicationNo: new FormControl(''),
      product: new FormControl('', Validators.required),
      fundingProgram: new FormControl('', Validators.required),
      bizDivision: new FormControl('', Validators.required),
      sourcingChannel: new FormControl('', Validators.required),
      sourcingType: new FormControl('', Validators.required),
      sourcingCode: new FormControl(''),
      dealerCode: new FormControl('', Validators.required),
      spokeCodeLocation: new FormControl({ value: '', disabled: true }),
      loanBranch: new FormControl({ value: '', disabled: true }),
      loanType: new FormControl('', Validators.required),
      reqLoanAmt: new FormControl('', Validators.required),
      requestedTenor: new FormControl('', Validators.required),
      /* child loan fom controls */
      totalLoanAmount: new FormControl(''),
      principalPaid: new FormControl(''),
      principalOutstanding: new FormControl(''),
      dpd: new FormControl(''),
      emi: new FormControl(''),
      rateOfInterest: new FormControl(''),
      tenor: new FormControl(''),
      remainingTenor: new FormControl(''),
      seasoning: new FormControl(''),
      loanAccountNumber: new FormControl(''),
      communication: new FormControl('0'),
    });
  }

  removeChildLoan() {
    this.sourcingDetailsForm.removeControl('totalLoanAmount');
    this.sourcingDetailsForm.removeControl('principalPaid');
    this.sourcingDetailsForm.removeControl('principalOutstanding');
    this.sourcingDetailsForm.removeControl('dpd');
    this.sourcingDetailsForm.removeControl('emi');
    this.sourcingDetailsForm.removeControl('rateOfInterest');
    this.sourcingDetailsForm.removeControl('tenor');
    this.sourcingDetailsForm.removeControl('remainingTenor');
    this.sourcingDetailsForm.removeControl('seasoning');
    this.sourcingDetailsForm.removeControl('loanAccountNumber');
    this.sourcingDetailsForm.updateValueAndValidity();
  }

  loanTenureMonth() {
    const loanTenure = [
      {
        rule: (month) => {
          return month < 12;
        },
        msg: 'Month should be greater than or equal to 12',
      },
      {
        rule: (month) => {
          return month > 72;
        },
        msg: 'Month should be lesser than or equal to 72',
      },
    ];
    return loanTenure;
  }

  loanTenureAmount(productCategoryChanged?: string) {
    const loanAmount = [
      {
        rule: amount => {
          if (productCategoryChanged === 'UC') {
            return amount <= 100000;
          } else {
            return null;
          }
        },
        msg: 'Minimum loan amount should be 100000'
      }
    ];
    return loanAmount;
  }

  onFormDisable() {
    if (this.operationType) {
      this.sourcingDetailsForm.disable();
      this.isSourchingCode = true;
      this.isDisabledDealerCode = true;
    }
  }

  saveAndUpdate() {
    let dealer: boolean;
    const formValue = this.sourcingDetailsForm.getRawValue();
    console.log('this.sourcingDetailsForm.value', this.sourcingDetailsForm.valid);
    if (this.sourchingTypeId === '2SOURTYP') {
      dealer = (this.dealorCodeKey) ? true : false;
    } else {
      dealer = true;
    }
    this.isDirty = true;
    let check = ''
    if (this.sourcingDetailsForm.valid === true && this.isSourceCode && dealer && this.userDefineForm.udfData.valid) {
      const saveAndUpdate: any = { ...formValue };
      console.log(formValue, 'FormValue');
      this.saveUpdate = {
        userId: this.userId,
        leadId: Number(this.leadId),
        bizDivision: saveAndUpdate.bizDivision,
        productCatCode: saveAndUpdate.productCategory,
        productId: Number(saveAndUpdate.product),
        fundingProgram: saveAndUpdate.fundingProgram,
        priority: Number(saveAndUpdate.priority),
        applicationNo: saveAndUpdate.applicationNo,
        sourcingChannel: saveAndUpdate.sourcingChannel,
        sourcingType: saveAndUpdate.sourcingType,
        sourcingCode: this.sourcingCodeKey,
        dealorCode: this.dealorCodeKey ? this.dealorCodeKey : '',
        // spokeCode: Number(saveAndUpdate.spokeCode),
        spokeCode: 1,
        loanBranch: Number(this.branchId),
        leadHandeledBy: Number(this.userId),
        leadCreatedBy: Number(this.branchId),
        leadCreatedOn: this.leadCreatedDateFromLead,
        typeOfLoan: saveAndUpdate.loanType,
        reqLoanAmt: saveAndUpdate.reqLoanAmt,
        reqTenure: Number(saveAndUpdate.requestedTenor),
        totalLoanAmount: saveAndUpdate.totalLoanAmount,
        isCommSuppressed: Number(saveAndUpdate.communication),

        parentLoanAccNum: saveAndUpdate.loanAccountNumber,
        principalPaid: saveAndUpdate.principalPaid,
        principalOutstanding: saveAndUpdate.principalOutstanding,
        dpd: saveAndUpdate.dpd,
        emi: saveAndUpdate.emi,
        rateOfInterest: saveAndUpdate.rateOfInterest,
        tenor: saveAndUpdate.tenor,
        remainingTenor: saveAndUpdate.remainingTenor,
        seasoning: saveAndUpdate.seasoning,
        udfDetails: [{
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId,
          "udfData": JSON.stringify(this.userDefineForm.udfData.getRawValue())
        }]
      };
      console.log('this.saveUpdate', this.saveUpdate);

      // this.leadDetail.saveAndUpdateLead(this.saveUpdate).subscribe((res: any) => {
      //   const response = res;
      //   console.log('saveUpdate Response', response);
      //   const appiyoError = response.Error;
      //   const apiError = response.ProcessVariables.error.code;

      //   if (appiyoError === '0' && apiError === '0') {
      //     this.toasterService.showSuccess('Record Saved Successfully !', 'Lead Details');
      //     this.sharedService.changeLoanAmount(Number(saveAndUpdate.reqLoanAmt));
      //     this.sharedService.leadDataToHeader(this.productCategoryChanged);
      //     const dataa = {
      //       ...this.saveUpdate,
      //       sourcingCodeDesc: this.sourcingCodeValue,
      //       dealorCodeDesc: this.dealorCodeValue
      //     };
      //     const data = {
      //       leadDetails: dataa
      //     };
      //     this.createLeadDataService.setLeadDetailsData(data);
      //     this.isSaved = true;
      //   } else {
      //     this.toasterService.showError(response.ProcessVariables.error.message, 'Lead Details');
      //   }
      // });
      this.leadDetail
        .saveAndUpdateLead(this.saveUpdate)
        .subscribe((res: any) => {
          const response = res;
          console.log('saveUpdate Response', response);
          const appiyoError = response.Error;
          const apiError = response.ProcessVariables.error.code;

          if (appiyoError === '0' && apiError === '0') {
            this.toasterService.showSuccess(
              'Record Saved Successfully !',
              'Lead Details'
            );
            this.sharedService.changeLoanAmount(
              Number(saveAndUpdate.reqLoanAmt)
            );
            this.sharedService.leadDataToHeader(this.productCategoryChanged);
            const dataa = {
              ...this.saveUpdate,
              sourcingCodeDesc: this.sourcingCodeValue,
              dealorCodeDesc: this.dealorCodeValue,
            };
            const data = {
              leadDetails: dataa,
            };
            this.createLeadDataService.setLeadDetailsData(data);
            this.udfDetails = response.ProcessVariables.udfDetails ? response.ProcessVariables.udfDetails : [];
            this.isSaved = true;
            this.apiValue = this.sourcingDetailsForm.getRawValue();
          } else {
            this.toasterService.showError(
              response.ProcessVariables.error.message,
              'Lead Details'
            );
          }
        });
    } else {
      this.toasterService.showError(
        'Please fill all mandatory fields.',
        'Lead Details'
      );
    }
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  nextToApplicant() {
    if (this.isLoan360) {
      return this.onNavigate();
    }
    this.isDirty = true;
    console.log('testform', this.sourcingDetailsForm);
    this.finalValue = this.sourcingDetailsForm.getRawValue();
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue);
    console.log(this.apiValue, ' vvalue', this.finalValue);

    if (this.operationType) {
      this.onNavigate();
      return;
    }
    if (this.sourcingDetailsForm.valid === true) {
      // if (!this.isSaved) {
      //   this.saveAndUpdate();
      // }
      if (!isValueCheck) {
        this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
        return;
      }
      this.onNavigate();
    } else {
      this.toasterService.showError(
        'Please fill all mandatory fields.',
        'Lead Details'
      );
    }
  }

  onNavigate() {
    const currentUrl = this.location.path();
    if (currentUrl.includes('sales')) {
      // this.udfScreenId = 'LDS002';
      this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
      return;
    }
    if (currentUrl.includes('dde')) {
      // this.udfScreenId = 'LDS003';
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
      return;
    }

    this.router.navigateByUrl(
      `/pages/lead-section/${this.leadId}/applicant-details`
    );
    console.log(this.udfScreenId, 'Screen Id')
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

  onSaveuserDefinedFields(event) {
    this.userDefineForm = event;
  }

}
