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
  ageCount: number = 0;

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
  placeholder = [];
  sourcingCodeData: Array<{ key: string; value: string }> = [];

  constructor(
    private labelsData: LabelsService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadService: CreateLeadService,
    private utilityService: UtilityService,
  ) { }

  ngOnInit() {
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

  initForm() {
    this.createExternalLeadForm = new FormGroup({
      bizDivision: new FormControl('', Validators.required),
      productCategory: new FormControl('', Validators.required),
      product: new FormControl('', Validators.required),
      sourcingChannel: new FormControl('', Validators.required),
      sourcingType: new FormControl('', Validators.required),
      sourcingCode: new FormControl(''),
      loanBranch: new FormControl(
        { value: this.loanAccountBranch, disabled: true },
        Validators.required
      ),
      entity: new FormControl('', Validators.required),
      nameOne: new FormControl('', Validators.required),
      nameTwo: new FormControl(''),
      nameThree: new FormControl('', Validators.required),
      mobile: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      // loanAccountNumber: new FormControl('', Validators.required)
    });
  }

  getUserDetailsData() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
    console.log(roleAndUserDetails, 'Test');
    this.getBusinessDivision(roleAndUserDetails);
    this.branchId = roleAndUserDetails.userDetails.branchId;
    const branchName = roleAndUserDetails.userDetails.branchName;
    this.loanAccountBranch = `${this.branchId}-${branchName}`;
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

    // this.createLeadService
    //   .fundingPrograming(productChange)
    //   .subscribe((res: any) => {
    //     const response = res;
    //     const appiyoError = response.Error;
    //     const apiError = response.ProcessVariables.error.code;

    //     if (appiyoError === '0' && apiError === '0') {
    //       const data = response.ProcessVariables.fpList;
    //       if (data) {
    //         data.map((ele) => {
    //           const datas = {
    //             key: ele.fpId,
    //             value: ele.fpDescription,
    //           };
    //           this.fundingProgramData.push(datas);
    //         });
    //       }
    //     }
    //   });
    // this.createExternalLeadForm.patchValue({ fundingProgram: '' });
  }
 


}
