import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { VehicleDetailService } from '../../../services/vehicle-detail.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { CreateLeadService } from '../../lead-creation/service/creatLead.service';
import { LoginStoreService } from '@services/login-store.service';
import { LeadDetails } from '../services/sourcingLeadDetails.service';
import { SharedService } from '@shared/shared-service/shared-service';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from '@services/utility.service';

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css'],
})
export class SourcingDetailsComponent implements OnInit, OnDestroy {
  // values: any = [];
  labels: any = {};
  sourcingDetailsForm: FormGroup;
  // text: any;
  // id: any;
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

  spokesCodeLocation: any;
  sourchingTypeValues: any;
  loanAccountBranch: any;
  leadHandeledBy: any;

  productCategoryFromLead: string;
  leadCreatedDateFromLead: string;
  isBusinessDivisionEnable: boolean;
  productCategoryList = [];
  productCategoryData: any;
  alertTimeOut: any;
  isProductCategory: boolean;
  leadData$: BehaviorSubject<any> = new BehaviorSubject([]);

  saveUpdate: {
    bizDivision: string;
    productCategory: number;
    priority: number;
    sourcingChannel: string;
    sourcingType: string;
    sourcingCode: string;
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
    private leadStoreService: LeadStoreService,
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
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getSourcingChannel();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => (this.labels = data),
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
    this.sourcingDetailsForm.patchValue({ leadCreatedBy: this.leadHandeledBy });
    this.sourcingDetailsForm.patchValue({ leadHandeledBy: userName });
  }

  async getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    console.log('leadSection----sour', leadSectionData);
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

    const priorityFromLead = data.loanLeadDetails.priority;
    this.leadId = data.leadId;

    // const loanBranchFromLead = data.loanLeadDetails.loanBranch;
    const leadCreatedDate = data.leadDetails.leadCreatedOn;
    this.leadCreatedDateFromLead = String(leadCreatedDate).slice(0, 10);

    const requiredLoanAmount = data.leadDetails.reqLoanAmt;
    const requiredLoanTenor = data.leadDetails.reqTenure;
    this.sourcingDetailsForm.patchValue({ requestedAmount: requiredLoanAmount, });
    this.sourcingDetailsForm.patchValue({ requestedTenor: requiredLoanTenor });

    this.getBusinessDivision(businessDivisionFromLead);
    this.sourcingDetailsForm.patchValue({ priority: priorityFromLead });
    this.sourcingDetailsForm.patchValue({ leadNumber: this.leadId });
    this.sourcingDetailsForm.patchValue({ leadCreatedDate: this.leadCreatedDateFromLead });
  }

  patchSourcingDetails() {
    const sourchingChannelFromLead = this.leadData.loanLeadDetails
      .sourcingChannel;
    const sourchingTypeFromLead = this.leadData.loanLeadDetails.sourcingType;
    const sourchingCodeFromLead = this.leadData.loanLeadDetails.sourcingCode;
    this.sourcingDetailsForm.patchValue({
      sourcingChannel: sourchingChannelFromLead,
    });
    this.sourcingDetailsForm.patchValue({
      sourcingType: sourchingTypeFromLead,
    });
    this.sourcingDetailsForm.patchValue({
      sourcingCode: sourchingCodeFromLead,
    });
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
  }

  productCategory(event, isBool) {
    const productCat = isBool ? event.target.value : event;
    if (productCat) {
      this.productCategoryData.map(data => {
        if (data.key === productCat) {
          this.sharedService.leadDataToHeader(data.value);
        }
      })
    }
  }


  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      console.log('sourching', response);
      this.sourchingTypeData = response;
      if (this.sourchingTypeData) {
        if (this.leadData.loanLeadDetails) {
          const sourchingChannel = this.leadData.loanLeadDetails
            .sourcingChannel;
          this.sourcingChannelChange(sourchingChannel, false);
          this.patchSourcingDetails();
        }
      }
    });
  }

  sourcingChannelChange(event: any, fromLead?) {
    this.sourchingTypeValues = [];
    this.sourcingChange = fromLead ? event.target.value : event;
    this.sourcingCodePlaceholder =
      this.sourcingChange === '4SOURCHAN' ? 'Campaign Code' : 'Employee Code';
    console.log('SourcingChange --', this.sourcingChange);

    this.sourchingTypeData.map((element) => {
      if (element.sourcingChannelId === this.sourcingChange) {
        console.log('Sourching Type --', element.sourcingTypeDesc);
        const data = {
          key: element.sourcingTypeId,
          value: element.sourcingTypeDesc,
        };
        this.sourchingTypeValues.push(data);
      }
    });
    this.sourcingDetailsForm.patchValue({ sourcingType: '' });
    if (this.sourchingTypeValues.length === 1) {
      const sourcingTypeData = this.sourchingTypeValues[0].key;
      this.sourcingDetailsForm.patchValue({ sourcingType: sourcingTypeData });
      return;
    }
    if (this.sourchingTypeValues.length === 0) {
      this.sourchingTypeValues.push({ key: 'notApplicable', value: 'Not Applicable' });
      const sourcingTypeData = this.sourchingTypeValues[0].key;
      this.sourcingDetailsForm.patchValue({ sourcingType: sourcingTypeData });
    }
  }

  setPatchData(data) {
    console.log('data', data);
    console.log('bizLov', this.LOV.LOVS.businessDivision);
    console.log('this.sourcingDetailsForm', this.sourcingDetailsForm);
    this.sourcingDetailsForm.patchValue({ bizDivision: 'EBBIZDIV' });
  }

  initForm() {
    this.sourcingDetailsForm = new FormGroup({
      leadNumber: new FormControl({ value: '', disabled: true }),
      leadCreatedDate: new FormControl({ value: '', disabled: true }),
      leadCreatedBy: new FormControl({ value: '', disabled: true }),
      leadHandeledBy: new FormControl(''),
      priority: new FormControl(''),
      productCategory: new FormControl(''),
      bizDivision: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      dealerCode: new FormControl(''),
      spokeCodeLocation: new FormControl({ value: '', disabled: true }),
      loanBranch: new FormControl({ value: '', disabled: true }),
      requestedAmount: new FormControl(''),
      requestedTenor: new FormControl(''),
    });
  }

  saveAndUpdate() {
    const formValue = this.sourcingDetailsForm.getRawValue();
    const saveAndUpdate: any = { ...formValue };
    console.log('Lead Save', saveAndUpdate);

    this.saveUpdate = {
      userId: Number(this.userId),
      leadId: Number(this.leadId),
      bizDivision: saveAndUpdate.bizDivision,
      productCategory: Number(saveAndUpdate.productCategory),
      priority: Number(saveAndUpdate.priority),
      sourcingChannel: saveAndUpdate.sourcingChannel,
      sourcingType: saveAndUpdate.sourcingType,
      sourcingCode: saveAndUpdate.sourcingCode,
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
      console.log('saveUpdate', response);
      const appiyoError = response.Error;
      const apiError = response.ProcessVariables.error.code;

      if (appiyoError === '0' && apiError === '0') {
        this.isAlert = true;
        this.alertTimeOut = setTimeout(() => { this.isAlert = false; }, 4000);
      }
    });
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  nextToApplicant() {
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

  ngOnDestroy() {
    clearTimeout(this.alertTimeOut);
  }
}
