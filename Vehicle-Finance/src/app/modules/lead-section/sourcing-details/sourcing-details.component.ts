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

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css'],
})
export class SourcingDetailsComponent implements OnInit {
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
  sourcingCodeData: Array<{ key: string, value: string }> = [];
  dealerCodeData: Array<any> = [];
  leadData$: BehaviorSubject<any> = new BehaviorSubject([]);

  sourcingCodeKey: string;
  sourcingCodeValue: string;
  dealorCodeKey: string;
  dealorCodeValue: string;

  isSourchingCode: boolean;
  isDirty: boolean;
  isSaved: boolean;
  amountTenureData: any;
  isLoanAmountTenure: boolean;


  sourcingCodeObject: {
    key: string;
    value: string;
  }

  dealorCodeObject: {
    key: string;
    value: string;
  }

  regexPattern = {
    amount: {
      rule: "^[1-9][0-9]*$",
      msg: 'Invalid Amount / Alphabets and Special Characters not allowed'
    }
  }

  amountLength: number;
  tenureMonthLength: number;

  saveUpdate: {
    bizDivision: string;
    productCategory?: string;
    product: number;
    priority: number;
    sourcingChannel: string;
    sourcingType: string;
    sourcingCode: string;
    dealorCode: string;
    spokeCode: number;
    loanBranch: number;
    leadHandeledBy: number;
    leadCreatedBy: number;
    leadCreatedOn: string;
    requestedLoanAmount: number;
    requestedLoanTenor: number;
    userId: number;
    leadId: number;
  };

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
    private toasterService: ToasterService
  ) {
    this.sourcingCodeObject = {
      key: '',
      value: ''
    }

    this.dealorCodeObject = {
      key: '',
      value: ''
    }
  }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getSourcingChannel();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.amountLength = this.labels.validationData.amountValue.maxLength;
        this.tenureMonthLength = this.labels.validationData.tenurePaid.maxLength;
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
    this.sourcingDetailsForm.patchValue({ leadHandeledBy: this.leadHandeledBy });
  }

  async getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    console.log('leadSectionData Lead details', leadSectionData);
    this.leadData = { ...leadSectionData };
    const data = this.leadData;

    const currentUrl = this.location.path();
    if (currentUrl.includes('sales')) {
      this.leadId = (await this.getLeadId()) as number;
    }

    if (!data.loanLeadDetails) {
      return;
    }
    const businessDivisionFromLead: string = data.loanLeadDetails.bizDivision;
    this.bizDivId = businessDivisionFromLead;

    const productCategory = data.leadDetails.productCatCode;
    this.productCategoryFromLead = productCategory;

    const product = data.leadDetails.productId;
    this.productFromLead = product;

    this.dealorCodeKey = data.leadDetails.dealorCode;
    this.dealorCodeValue = data.leadDetails.dealorCodeDesc;

    const priorityFromLead = data.loanLeadDetails.priority;
    this.leadId = data.leadId;

    const sourchingType = this.leadData.loanLeadDetails.sourcingType;
    this.sourchingTypeFromLead = sourchingType;

    const sourchingChannel = this.leadData.loanLeadDetails.sourcingChannel;
    this.sourchingChannelFromLead = sourchingChannel;
    // const loanBranchFromLead = data.loanLeadDetails.loanBranch;
    const leadCreatedDate = data.leadDetails.leadCreatedOn;
    this.leadCreatedDateFromLead = String(leadCreatedDate).slice(0, 10);

    if (!this.isLoanAmountTenure) {
      const requiredLoanAmount = data.leadDetails.reqLoanAmt;
      const requiredLoanTenor = data.leadDetails.reqTenure;
      this.sourcingDetailsForm.patchValue({ requestedAmount: requiredLoanAmount });
      this.sourcingDetailsForm.patchValue({ requestedTenor: requiredLoanTenor });
      this.isLoanAmountTenure = false;
    } else {
      const amountAndTenureData = this.createLeadDataService.getLoanAmountAndTenure();
      this.amountTenureData = { ...amountAndTenureData };
      console.log('this.amountTenureData', amountAndTenureData);
      this.sourcingDetailsForm.patchValue({ requestedAmount: this.amountTenureData.loanAmount });
      this.sourcingDetailsForm.patchValue({ requestedTenor: this.amountTenureData.loanTenure });
    }

    this.sourcingDetailsForm.patchValue({ dealerCode: this.dealorCodeValue });

    const leadCreatedby = data.leadDetails.leadCreatedBy;
    this.sourcingDetailsForm.patchValue({ leadCreatedBy: leadCreatedby });

    this.getBusinessDivision(businessDivisionFromLead);
    this.sourcingDetailsForm.patchValue({ priority: priorityFromLead });
    this.sourcingDetailsForm.patchValue({ leadNumber: this.leadId });
    this.sourcingDetailsForm.patchValue({ leadCreatedDate: this.leadCreatedDateFromLead });
  }

  patchSourcingDetails() {
    this.sourcingDetailsForm.patchValue({ sourcingChannel: this.sourchingChannelFromLead });

    this.sourchingTypeChange(this.sourchingTypeFromLead);
    this.sourcingDetailsForm.patchValue({ sourcingType: this.sourchingTypeFromLead });

    this.sourcingCodeKey = this.leadData.leadDetails.sourcingCode;
    this.sourcingCodeValue = this.leadData.leadDetails.sourcingCodeDesc;
    this.sourcingDetailsForm.patchValue({ sourcingCode: this.sourcingCodeValue });
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
    this.sourcingDetailsForm.patchValue({ productCategory: this.productCategoryFromLead });
    this.sourcingDetailsForm.patchValue({ product: this.productFromLead });
  }

  productCategory(event, isBool) {
    this.productCategorySelectedList = [];
    const productCategorySelected = isBool ? event.target.value : event;
    this.productCategorySelectedList = this.utilityService.getValueFromJSON(
      this.productCategoryList.filter(data => data.productCatCode === productCategorySelected),
      'assetProdcutCode',
      'assetProdutName');
    if (isBool === true) {
      this.sourcingDetailsForm.patchValue({ product: '' });
    }

    if (productCategorySelected) {
      this.productCategoryData.map(data => {
        if (data.key === productCategorySelected) {
          this.productCategoryChanged = data.value;
        }
      });
    }
  }

  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      console.log('sourching', response);
      this.sourcingData = response;
      this.sourcingChannelData = this.utilityService.getValueFromJSON(
        this.sourcingData,
        'sourcingChannelId',
        'sourcingChannelDesc');
      this.sourcingChannelChange(this.sourchingChannelFromLead, false);
      this.patchSourcingDetails();
    });
  }

  sourcingChannelChange(event: any, fromLead?) {
    this.sourchingTypeValues = [];
    this.sourcingChange = fromLead ? event.target.value : event;
    this.sourchingTypeValues = this.utilityService.getValueFromJSON(
      this.sourcingData.filter(data => data.sourcingChannelId === this.sourcingChange), 'sourcingTypeId', 'sourcingTypeDesc');

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
    const sourchingTypeId = event.target ? event.target.value : event;
    this.socuringTypeData = this.sourcingData.filter(data => data.sourcingTypeId === sourchingTypeId);
    this.placeholder = this.utilityService.getValueFromJSON(this.socuringTypeData, 'sourcingCodeType', 'sourcingCode');
    console.log('placeholder', this.placeholder);
    this.sourcingDetailsForm.controls.sourcingCode.reset();
    this.sourcingCodePlaceholder = this.placeholder[0].value;
    if (this.sourcingCodePlaceholder === 'Not Applicable') {
      this.isSourchingCode = true;
    } else {
      this.isSourchingCode = false;
    }
  }

  onSourcingCodeSearch(event) {
    let inputString = event;
    let sourcingCode = [];
    console.log('inputString', event);
    sourcingCode = this.socuringTypeData.filter(data => data.sourcingCodeType === this.placeholder[0].key)
    console.log('sourcingCode', sourcingCode);
    let sourcingCodeType: string = sourcingCode[0].sourcingCodeType;
    let sourcingSubCodeType: string = sourcingCode[0].sourcingSubCodeType;
    this.createLeadService.sourcingCode(sourcingCodeType, sourcingSubCodeType, inputString).subscribe((res: any) => {
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
    this.sourcingCodeKey = sourcingEvent.key;
    this.sourcingCodeValue = sourcingEvent.value;
  }

  onSourcingCodeClear(event) {
    this.sourcingCodeKey = '';
  }

  onDealerCodeSearch(event) {
    let inputString = event;
    let dealerCode = [];
    console.log('code', event);
    this.createLeadService.dealerCode(inputString).subscribe((res: any) => {
      const response = res;
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;
      if (appiyoError === '0' && apiError === '0') {
        this.dealerCodeData = response.ProcessVariables.dealorDetails;
        this.keyword = 'dealorName';
        console.log('this.dealerCodeData', this.dealerCodeData);
      }
    });
  }

  selectDealorEvent(event) {
    const dealorEvent = event;
    console.log('dealorEvent', dealorEvent);
    this.dealorCodeKey = dealorEvent.dealorCode;
    this.dealorCodeValue = dealorEvent.dealorName;
  }

  onDealerCodeClear(event) {
    this.dealorCodeKey = '';
  }

  initForm() {
    this.sourcingDetailsForm = new FormGroup({
      leadNumber: new FormControl({ value: '', disabled: true }),
      leadCreatedDate: new FormControl({ value: '', disabled: true }),
      leadCreatedBy: new FormControl({ value: '', disabled: true }),
      leadHandeledBy: new FormControl('', Validators.required),
      productCategory: new FormControl('', Validators.required),
      priority: new FormControl(''),
      product: new FormControl('', Validators.required),
      bizDivision: new FormControl('', Validators.required),
      sourcingChannel: new FormControl('', Validators.required),
      sourcingType: new FormControl('', Validators.required),
      sourcingCode: new FormControl('', Validators.required),
      dealerCode: new FormControl('', Validators.required),
      spokeCodeLocation: new FormControl({ value: '', disabled: true }),
      loanBranch: new FormControl({ value: '', disabled: true }),
      requestedAmount: new FormControl('', Validators.required),
      requestedTenor: new FormControl('', Validators.required),
    });
  }

  saveAndUpdate() {
    const formValue = this.sourcingDetailsForm.getRawValue();
    console.log('this.sourcingDetailsForm.value', this.sourcingDetailsForm.valid);
    this.isDirty = true;
    if (this.sourcingDetailsForm.valid === true) {
      const saveAndUpdate: any = { ...formValue };

      console.log(formValue, 'FormValue')

      this.saveUpdate = {
        userId: Number(this.userId),
        leadId: Number(this.leadId),
        bizDivision: saveAndUpdate.bizDivision,
        product: Number(saveAndUpdate.product),
        priority: Number(saveAndUpdate.priority),
        sourcingChannel: saveAndUpdate.sourcingChannel,
        sourcingType: saveAndUpdate.sourcingType,
        sourcingCode: this.sourcingCodeKey,
        dealorCode: this.dealorCodeKey,
        // spokeCode: Number(saveAndUpdate.spokeCode),
        spokeCode: 1,
        loanBranch: Number(this.branchId),
        leadHandeledBy: Number(this.userId),
        leadCreatedBy: Number(this.branchId),
        leadCreatedOn: this.leadCreatedDateFromLead,
        requestedLoanAmount: Number(saveAndUpdate.requestedAmount),
        requestedLoanTenor: Number(saveAndUpdate.requestedTenor),
      };
      console.log('this.saveUpdate', this.saveUpdate);
      this.leadDetail.saveAndUpdateLead(this.saveUpdate).subscribe((res: any) => {
        const response = res;
        console.log('saveUpdate Response', response);
        const appiyoError = response.Error;
        const apiError = response.ProcessVariables.error.code;

        if (appiyoError === '0' && apiError === '0') {
          this.toasterService.showSuccess('Record Saved Successfully !', 'Lead Details');
          this.sharedService.changeLoanAmount(Number(saveAndUpdate.requestedAmount));
          this.sharedService.leadDataToHeader(this.productCategoryChanged);
          const data = {
            loanAmount: Number(saveAndUpdate.requestedAmount),
            loanTenure: Number(saveAndUpdate.requestedTenor)
          };
          this.createLeadDataService.setLoanAmountAndTenure(data);
          this.isSaved = true;
        }
      });
    } else {
      this.toasterService.showError('Please fill all mandatory fields.', 'Lead Details');
    }
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);

  }

  nextToApplicant() {
    if (this.sourcingDetailsForm.valid === true) {
      if (!this.isSaved) {
        this.saveAndUpdate();
      }
      const currentUrl = this.location.path();
      if (currentUrl.includes('sales')) {
        this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
        return;
      }
      if (currentUrl.includes('dde')) {
        this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
        return;
      }
      this.router.navigateByUrl(
        `/pages/lead-section/${this.leadId}/applicant-details`
      );
    } else {
      this.toasterService.showError('Please fill all mandatory fields.', 'Lead Details');
    }
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
}
