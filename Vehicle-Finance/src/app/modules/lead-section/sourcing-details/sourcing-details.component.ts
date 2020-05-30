import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { CreateLeadService } from '../../lead-creation/service/creatLead.service';
import { LoginStoreService } from '@services/login-store.service';
import { LeadDetails } from '../services/sourcingLeadDetails.service';

@Component({
  selector: 'app-sourcing-details',
  templateUrl: './sourcing-details.component.html',
  styleUrls: ['./sourcing-details.component.css']
})
export class SourcingDetailsComponent implements OnInit {
  values: any = [];
  labels: any = {};
  sourcingDetailsForm: FormGroup;
  SourcingChange: any;
  text: any;
  id: any;
  LOV: any;
  isAlert: boolean;

  bizDivId: string;
  leadData: any;
  userId: any;
  branchId: any;
  leadId: number;

  businessDivisionArray = [];
  productCategoryArray: Array<any> = [];
  sourchingTypeData = [];
  sourcingChange: any;
  sourcingCodePlaceholder: string = 'Sourcing Code';

  spokesCodeLocation: any;
  sourchingTypeValues: any;

  productCategoryFromLead: string;

  isBusinessDivisionEnable: boolean;

  saveUpdate: {
    bizDivision: string,
    productCategory: number,
    priority: string,
    sourcingChannel: string,
    sourcingType: string,
    sourcingCode: string,
    spokeCode: number,
    loanBranch: number,
    leadHandeledBy: number,
    leadCreatedBy: number,
    requestedLoanAmount: number,
    requestedLoanTenor: number
    userId: number,
    leadId: number
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
    private leadDetail: LeadDetails) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.getSourcingChannel();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => this.labels = data,
      error => console.log('Sourcing details Label Error', error));
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe(lov => {
      this.LOV = lov;
      this.getLeadSectionData();

    });
  }

  // getUserDetailsData() {
  //   const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
  //   if (!roleAndUserDetails) {
  //     return;
  //   }
  //   this.getBusinessDivision(roleAndUserDetails);

  //   const branchId = roleAndUserDetails.userDetails.branchId;
  //   const branchName = roleAndUserDetails.userDetails.branchName;
  //   this.loanAccountBranch = `${branchId}-${branchName}`;

  //   const userId = roleAndUserDetails.userDetails.userId;
  //   const userName = roleAndUserDetails.userDetails.firstName;
  //   this.leadHandeledBy = `${userId}-${userName}`;

  //   this.isSpoke = roleAndUserDetails.userDetails.isSpokes;
  //   this.spokesCodeLocation = this.isSpoke ? roleAndUserDetails.userDetails.parentBranch : null;
  // }

  getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    console.log('leadSection----sour', leadSectionData);
    this.leadData = { ...leadSectionData };
    const data = this.leadData;

    const roleAndUserDetails = this.loginService.getRolesAndUserDetails();
    console.log('SourcingRole', roleAndUserDetails);
    const leadCreateBy = roleAndUserDetails.userDetails.firstName;
    this.userId = roleAndUserDetails.userDetails.userId;
    this.branchId = roleAndUserDetails.userDetails.branchId;

    if (!this.leadData) {
      return;
    }
    const businessDivisionFromLead: string = data.loanLeadDetails.bizDivision;
    this.bizDivId = businessDivisionFromLead;

    const productCategory = data.loanLeadDetails.productCategory;
    this.productCategoryFromLead = productCategory;

    const priorityFromLead = data.loanLeadDetails.priority;
    this.leadId = data.leadId;

    const loanBranchFromLead = data.loanLeadDetails.loanBranch;
    const leadCreatedDate = data.leadDetails.leadCreatedOn;
    const leadCreatedDateFromLead = String(leadCreatedDate).slice(0, 10);

    this.getBusinessDivision(businessDivisionFromLead);
    this.sourcingDetailsForm.patchValue({ priority: priorityFromLead });
    this.sourcingDetailsForm.patchValue({ leadNumber: this.leadId });
    this.sourcingDetailsForm.patchValue({ loanBranch: loanBranchFromLead });
    this.sourcingDetailsForm.patchValue({ leadCreatedDate: leadCreatedDateFromLead });
    this.sourcingDetailsForm.patchValue({ leadCreatedBy: leadCreateBy });
  }

  patchSourcingDetails() {
    const sourchingChannelFromLead = this.leadData.loanLeadDetails.sourcingChannel;
    const sourchingTypeFromLead = this.leadData.loanLeadDetails.sourcingType;
    const sourchingCodeFromLead = this.leadData.loanLeadDetails.sourcingCode;
    this.sourcingDetailsForm.patchValue({ sourcingChannel: sourchingChannelFromLead });
    this.sourcingDetailsForm.patchValue({ sourcingType: sourchingTypeFromLead });
    this.sourcingDetailsForm.patchValue({ sourcingCode: sourchingCodeFromLead });
  }

  getBusinessDivision(bizDivision) {
    const businessKey = bizDivision;
    const lov = this.LOV.LOVS.businessDivision;
    lov.map(data => {
      if (data.key === businessKey) {
        const val = {
          key: data.key,
          value: data.value
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
    this.bizDivId = (this.isBusinessDivisionEnable) ? event : event.target.value;
    this.createLeadService.getProductCategory(this.bizDivId).subscribe((res: any) => {
      const product = res.ProcessVariables.productCategoryDetails;
      product.map(data => {
        if (data) {
          const val = {
            key: data.assetProdcutCode,
            value: data.prodcutCatName
          };
          this.productCategoryArray.push(val);
          this.sourcingDetailsForm.patchValue({ productCategory: this.productCategoryFromLead });
        }
      });
    });
    console.log('this.productCategoryData', this.productCategoryArray);
  }

  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      console.log('sourching', response);
      this.sourchingTypeData = response;
      if (this.sourchingTypeData) {
        const sourchingChannel = this.leadData.loanLeadDetails.sourcingChannel;
        this.sourcingChannelChange(sourchingChannel, false);
        this.patchSourcingDetails();
      }
    });
  }

  sourcingChannelChange(event: any, fromLead?) {
    this.sourchingTypeValues = [];
    this.sourcingChange = (fromLead) ? event.target.value : event;
    this.sourcingCodePlaceholder = (this.sourcingChange === '4SOURCHAN') ? 'Campaign Code' : 'Employee Code';
    console.log('SourcingChange --', this.sourcingChange);

    this.sourchingTypeData.map(element => {
      if (element.sourcingChannelId === this.sourcingChange) {
        console.log('Sourching Type --', element.sourcingTypeDesc);
        const data = {
          key: element.sourcingTypeId,
          value: element.sourcingTypeDesc
        };
        this.sourchingTypeValues.push(data);
      }
    });
    console.log('this.sourchingTypeValues', this.sourchingTypeValues);
    if (this.sourchingTypeValues.length === 0) {
      this.sourchingTypeValues = [{ key: null, value: 'Not Applicable' }];
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
      spokeCodeLocation: new FormControl({ value: '', disabled: true }),
      loanBranch: new FormControl({ value: '', disabled: true }),
      requestedAmount: new FormControl(''),
      requestedTenor: new FormControl('')
    });
  }

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  saveAndUpdate(data) {
    const formValue = this.sourcingDetailsForm.getRawValue();
    const saveAndUpdate: any = { ...formValue };
    console.log('Lead Save', saveAndUpdate);

    this.saveUpdate = {
      userId: this.userId,
      leadId: Number(this.leadId),
      bizDivision: saveAndUpdate.bizDivision,
      productCategory: Number(saveAndUpdate.productCategory),
      priority: saveAndUpdate.priority,
      sourcingChannel: saveAndUpdate.sourcingChannel,
      sourcingType: saveAndUpdate.sourcingType,
      sourcingCode: saveAndUpdate.sourcingCode,
      // spokeCode: Number(saveAndUpdate.spokeCode),
      spokeCode: 1,
      loanBranch: Number(this.branchId),
      leadHandeledBy: Number(this.userId),
      leadCreatedBy: Number(this.branchId),
      requestedLoanAmount: Number(saveAndUpdate.requestedAmount),
      requestedLoanTenor: Number(saveAndUpdate.requestedTenor)
    };

    console.log('this.saveUpdate', this.saveUpdate);

    // this.leadDetail.saveAndUpdateLead(this.saveUpdate).subscribe((res: any) => {
    //   const response = res;
    // })
  }
}












 // setFormValue() {
  //   const sourcingValue = this.leadStoreService.getSourcingDetails() || {};
  //   console.log('source', sourcingValue)
  //   this.sourcingDetailsForm.patchValue({
  //     leadHandledBy: sourcingValue.leadHandledBy || '',
  //     sourcingChannel: sourcingValue.sourcingChannel || '',
  //     sourcingType: sourcingValue.sourcingType || '',
  //     sourcingCode: sourcingValue.sourcingCode || '',
  //     spokeCodeLocation: sourcingValue.spokeCodeLocation || ''
  //   });
  //   const leadData = this.leadStoreService.getLeadCreation() || {};
  //   console.log('lead data', leadData)
  //   this.sourcingDetailsForm.patchValue({
  //     loanAccountBranch: leadData.loanAccountBranch || ''
  //   });
  // }
