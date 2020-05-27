import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { VehicleDetailService } from '../services/vehicle-detail.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from '@services/lead-store.service';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { CreateLeadService } from '../../lead-creation/service/creatLead.service';

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

  businessDivisionArray = [];
  productCategoryArray: Array<any> = [];
  sourcingCodePlaceholder: string;
  spokesCodeLocation: any;
  sourchingTypeValues: any;

  productCategoryFromLead: string;

  isBusinessDivisionEnable: boolean;


  constructor(
    private leadSectionService: VehicleDetailService,
    private leadStoreService: LeadStoreService,
    private router: Router,
    private createLeadService: CreateLeadService,
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private createLeadDataService: CreateLeadDataService) { }

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
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

  getLeadSectionData() {
    const leadSectionData = this.createLeadDataService.getLeadSectionData();
    console.log('leadSection----sour', leadSectionData);
    const data: any = { ...leadSectionData }

    const businessDivision: string = data.loanLeadDetails.bizDivision;
    this.bizDivId = businessDivision;
    const productCategory = data.loanLeadDetails.productCategory;
    this.productCategoryFromLead = productCategory;
    const priority = data.loanLeadDetails.priority;
    this.getBusinessDivision(businessDivision);
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
          this.productCategoryArray.push(val)
          this.sourcingDetailsForm.patchValue({ productCategory: this.productCategoryFromLead });
        }
      });
    });
    console.log('this.productCategoryData', this.productCategoryArray);
  }

  setPatchData(data) {
    console.log('data', data);
    console.log('bizLov', this.LOV.LOVS.businessDivision);
    console.log('this.sourcingDetailsForm', this.sourcingDetailsForm);
    this.sourcingDetailsForm.patchValue({ bizDivision: 'EBBIZDIV' });
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

  onNext() {
    this.leadSectionService.setCurrentPage(1);
  }

  // getdata() {
  //   this.id = this.leadStoreService.getLeadCreation();
  //   console.log(this.id);



  //   this.sourcingDetailsForm.controls["product"].setValue(this.id.productCategory)
  //   this.sourcingDetailsForm.controls["priority"].setValue(this.id.priority)
  //   this.sourcingDetailsForm.controls["spokeCodeLocation"].setValue(this.id.spokeCodeLocation)
  //   this.sourcingDetailsForm.controls["loanAccountBranch"].setValue(this.id.loanBranch)
  //   this.sourcingDetailsForm.controls["leadHandledBy"].setValue(this.id.leadHandeledBy)
  //   this.sourcingDetailsForm.controls["sourcingChannel"].setValue(this.id.sourcingChannel)
  //   this.sourcingDetailsForm.controls["sourcingType"].setValue(this.id.sourcingType)
  //   this.sourcingDetailsForm.controls["sourcingCode"].setValue(this.id.sourcingCode)
  // };

  // onFormSubmit() {
  //   this.isAlert = false;
  //   setTimeout(() => {
  //     this.isAlert = true;
  //   }, 1000);
  //   // this.router.navigate(['/pages/lead-section/applicant-details']);
  //   console.log('sourcing form', this.sourcingDetailsForm.value);
  //   const formValue = this.sourcingDetailsForm.value;
  //   const sourcingModel = { ...formValue };
  //   this.leadStoreService.setSourcingDetails(sourcingModel);

  // }

  sourcingChannelChange(event) { }

}
