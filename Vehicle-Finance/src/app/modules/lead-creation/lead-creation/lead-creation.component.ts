import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


// import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';

import { CreateLeadService } from '../service/creatLead.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css']
})
export class LeadCreationComponent implements OnInit, OnChanges {

  createLeadForm: FormGroup;
  test: any;
  values = [];
  lovLabels: any = [];
  labels: any = {};

  applicantType = 'INDIVENTTYP';
  sourcingChange: any;
  sourcingCodePlaceholder = 'Sourcing Code';
  // ProfessionList = [];
  sourchingTypeData = [];
  sourchingTypeValues = [];
  text: string;
  loanAccountBranch: string;
  leadHandeledBy: string;
  spokesCodeLocation: any = [];
  isSpoke: boolean;
  businessDivision: any = [];
  isBusinessDivisionEnable: boolean;
  bizDivId: string;

  LOV: any = [];

  productCategoryData = [];
  sourchingType: string;

  loanLeadDetails: {
    bizDivision: string,
    productCategory: string,
    priority: string,
    fundingProgram: string,
    sourcingChannel: string,
    sourcingType: string,
    sourcingCode: string,
    spokeCode: string,
    loanBranch: string,
    leadHandeledBy: string
  };

  applicantDetails: {
    entity: string
    nameOne: string,
    nameTwo: string,
    nameThree: string,
    mobileNumber: string,
    dobOrDoc: string
  };

  selectApplicantType(event: any) {
    console.log(this.applicantType);
    this.applicantType = event.target.value;
  }

  constructor(
    private router: Router,
    private leadStoreService: LeadStoreService,
    private labelsData: LabelsService,
    private createLeadService: CreateLeadService,
    private commomLovService: CommomLovService,
    private loginStoreService: LoginStoreService
  ) {}

  ngOnChanges() {
    console.log(this.test);
  }

  ngOnInit() {
    this.onChangeLanguage('English');
    this.getLabels();
    this.getLOV();
    this.getUserDetailsData();
    this.getSourcingChannel();
    this.initForm();
    this.createLeadForm.patchValue({ bizDivision: 'EBBIZDIV' });
    this.createLeadForm.patchValue({ entity: 'INDIVENTTYP' });
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      });
  }

  initForm() {
    this.createLeadForm = new FormGroup({
      bizDivision: new FormControl(''),
      productCategory: new FormControl(''),
      fundingProgram: new FormControl(''),
      priority: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl({ value: '', disabled: !this.isSpoke }),
      loanBranch: new FormControl({ value: this.loanAccountBranch, disabled: true }),
      leadHandeledBy: new FormControl({ value: this.leadHandeledBy, disabled: true }),
      entity: new FormControl(''),
      nameOne: new FormControl(''),
      nameTwo: new FormControl(''),
      nameThree: new FormControl(''),
      mobile: new FormControl(''),
      dateOfBirth: new FormControl('')
    });
  }

  getLOV() {
    this.LOV = this.commomLovService.getLovData()
    console.log('Create Lead LOV data ---', this.LOV);
  }

  getUserDetailsData() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
    this.getBusinessDivision(roleAndUserDetails);

    const branchId = roleAndUserDetails.userDetails.branchId;
    const branchName = roleAndUserDetails.userDetails.branchName;
    this.loanAccountBranch = `${branchId}-${branchName}`;

    const userId = roleAndUserDetails.userDetails.userId;
    const userName = roleAndUserDetails.userDetails.firstName;
    this.leadHandeledBy = `${userId}-${userName}`;

    this.isSpoke = roleAndUserDetails.userDetails.isSpokes;
    this.spokesCodeLocation = this.isSpoke ? roleAndUserDetails.userDetails.parentBranch : null;
  }

  getBusinessDivision(roleAndUserDetails) {
    const businessDivision = roleAndUserDetails.businessDivisionList;
    this.bizDivId = businessDivision[0].bizDivId;
    const lov = this.LOV.LOVS.businessDivision;
    lov.map(data => {
      businessDivision.map(ele => {
        if (ele.bizDivId === data.key) {
          const val = {
            key: ele.bizDivId,
            value: data.value
          };
          this.businessDivision.push(val);
        }
      });
    });

    if (this.businessDivision.length === 1) {
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
          this.productCategoryData.push(val);
        }
      });
    });
    console.log('this.productCategoryData', this.productCategoryData);
  }


  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      console.log('sourching', response);
      this.sourchingTypeData = response;
    });
  }

  sourcingChannelChange(event: any) {
    this.sourchingTypeValues = [];
    this.sourcingChange = event.target.value;
    this.sourcingCodePlaceholder = (this.sourcingChange === '4SOURCHAN') ? 'Campaign Code' : 'Employee Code';
    console.log('SourcingChange --', this.sourcingChange);

    this.sourchingTypeData.map(element => {
      if (element.sourcingChannelId === this.sourcingChange) {
        console.log('Sourching Type --', element.sourcingTypeDesc);
        const data = {
          key: element.sourcingChannelId,
          value: element.sourcingTypeDesc
        };
        this.sourchingTypeValues.push(data);
      }
    });
    if (this.sourchingTypeValues.length === 0) {
      this.sourchingTypeValues = [{ key: null, value: 'Not Applicable' }];
    }
  }


  onChangeLanguage(labels: string) {
    if (labels === 'Hindi') {
      this.labelsData.getLanguageLabelData().subscribe(
        data => {
          this.labels = data[0];
        });
    } else {
      this.labelsData.getLabelsData().subscribe(
        data => {
          this.labels = data;
        });
    }
  }


  onSubmit() {
    const formValue = this.createLeadForm.getRawValue();
    const leadModel: any = { ...formValue };
    console.log('Form value', leadModel);
    this.leadStoreService.setLeadCreation(leadModel);

    // const applicantModel = {
    //   first_name: leadModel.nameOne,
    //   middle_name: leadModel.nameTwo,
    //   last_name: leadModel.nameThree,
    //   mobile: leadModel.mobile,
    //   dateOfBirth: leadModel.dateOfBirth
    // };

    this.loanLeadDetails = {
      bizDivision: leadModel.bizDivision,
      productCategory: leadModel.productCategory,
      priority: leadModel.priority,
      fundingProgram: leadModel.fundingProgram,
      sourcingChannel: leadModel.sourcingChannel,
      sourcingType: leadModel.sourcingType,
      sourcingCode: leadModel.sourcingCode,
      spokeCode: leadModel.spokeCode,
      loanBranch: leadModel.loanBranch,
      leadHandeledBy: leadModel.leadHandeledBy

    };

    this.applicantDetails = {
      entity: leadModel.entity,
      nameOne: leadModel.nameOne,
      nameTwo: leadModel.nameTwo,
      nameThree: leadModel.nameThree,
      mobileNumber: leadModel.mobile,
      dobOrDoc: leadModel.dateOfBirth
    };

    console.log('loanLeadDetails', this.loanLeadDetails);
    console.log('applicantDetails', this.applicantDetails);

    this.createLeadService.createLead(this.loanLeadDetails, this.applicantDetails).subscribe((res: any) => {
      const response = res;
      if (response.Error === '0') {
        const message = response.ProcessVariables.error.message;
        const isDedupeAvailable = response.ProcessVariables.isDedupeAvailable;
        console.log('Success Message', message);

        if (isDedupeAvailable) {
          const leadDedupeData = response.ProcessVariables.leadDedupeResults;
          this.leadStoreService.setDedupeData(leadDedupeData);
          this.router.navigateByUrl('pages/lead-creation/lead-dedupe');
          return;
        }
        this.router.navigateByUrl('pages/lead-section');
      }
    });
    // this.leadStoreService.setCoApplicantDetails(applicantModel);
  }

}
