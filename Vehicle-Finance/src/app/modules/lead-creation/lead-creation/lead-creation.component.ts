import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';

import { CreateLeadService } from '../service/creatLead.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../service/createLead-data.service';
@Component({
  selector: 'app-lead-creation',
  templateUrl: './lead-creation.component.html',
  styleUrls: ['./lead-creation.component.css'],
})
export class LeadCreationComponent implements OnInit {
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
  isSpoke: number;
  businessDivision: any = [];
  isBusinessDivisionEnable: boolean;
  bizDivId: string;
  branchId: number;
  userId: number;

  LOV: any = [];

  productCategoryData = [];
  sourchingType: string;

  loanLeadDetails: {
    bizDivision: string;
    productCategory: number;
    priority: string;
    fundingProgram: string;
    sourcingChannel: string;
    sourcingType: string;
    sourcingCode: string;
    spokeCode: number;
    loanBranch: number;
    leadHandeledBy: number;
  };

  applicantDetails: {
    entity: string;
    nameOne: string;
    nameTwo: string;
    nameThree: string;
    mobileNumber: string;
    dobOrDoc: string;
  };

  selectApplicantType(event: any) {
    console.log(this.applicantType);
    this.applicantType = event.target.value;
    console.log(this.applicantType);
  }

  constructor(
    private router: Router,
    private leadStoreService: LeadStoreService,
    private labelsData: LabelsService,
    private createLeadService: CreateLeadService,
    private commomLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService
  ) {}

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
      (data) => (this.labels = data),
      (error) => console.log('Lead Creation Label Error', error)
    );
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
      spokeCodeLocation: new FormControl({
        value: '',
        disabled: !this.isSpoke,
      }),
      loanBranch: new FormControl({
        value: this.loanAccountBranch,
        disabled: true,
      }),
      leadHandeledBy: new FormControl({
        value: this.leadHandeledBy,
        disabled: true,
      }),
      entity: new FormControl(''),
      nameOne: new FormControl(''),
      nameTwo: new FormControl(''),
      nameThree: new FormControl(''),
      mobile: new FormControl(''),
      dateOfBirth: new FormControl(''),
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('Create Lead LOV data ---', this.LOV);
  }

  getUserDetailsData() {
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();
    if (!roleAndUserDetails) {
      return;
    }
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
        const product = res.ProcessVariables.productCategoryDetails;
        product.map((data) => {
          if (data) {
            const val = {
              key: data.assetProdcutCode,
              value: data.prodcutCatName,
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
    if (this.sourchingTypeValues.length === 0) {
      this.sourchingTypeValues = [{ key: null, value: 'Not Applicable' }];
    }
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

  onSubmit() {
    const formValue = this.createLeadForm.getRawValue();
    const leadModel: any = { ...formValue };
    console.log('Form value', leadModel);
    this.leadStoreService.setLeadCreation(leadModel);

    this.loanLeadDetails = {
      bizDivision: leadModel.bizDivision,
      productCategory: Number(leadModel.productCategory),
      priority: leadModel.priority,
      fundingProgram: leadModel.fundingProgram,
      sourcingChannel: leadModel.sourcingChannel,
      sourcingType: leadModel.sourcingType,
      sourcingCode: leadModel.sourcingCode,
      // spokeCode: Number(leadModel.spokeCode),
      spokeCode: 1,
      loanBranch: Number(this.branchId),
      leadHandeledBy: Number(this.userId),
    };

    this.applicantDetails = {
      entity: leadModel.entity,
      nameOne: leadModel.nameOne,
      nameTwo: leadModel.nameTwo,
      nameThree: leadModel.nameThree,
      mobileNumber: leadModel.mobile,
      dobOrDoc: leadModel.dateOfBirth,
    };

    console.log('loanLeadDetails', this.loanLeadDetails);
    console.log('applicantDetails', this.applicantDetails);
    this.createLeadDataService.setLeadData(
      this.loanLeadDetails,
      this.applicantDetails
    );
    this.createLeadService
      .createLead(this.loanLeadDetails, this.applicantDetails, false)
      .subscribe(
        (res: any) => {
          const response = res;
          const appiyoError = response.Error;
          const apiError = response.ProcessVariables.error.code;

          if (appiyoError === '0' && apiError === '0') {
            const message = response.ProcessVariables.error.message;
            const isDedupeAvailable =
              response.ProcessVariables.isDedupeAvailable;
            console.log('Success Message', message);
            const leadSectionData = response.ProcessVariables;
            const leadId = leadSectionData.leadId;

            if (isDedupeAvailable) {
              const leadDedupeData =
                response.ProcessVariables.leadDedupeResults;
              this.leadStoreService.setDedupeData(leadDedupeData);
              this.router.navigateByUrl('pages/lead-creation/lead-dedupe');
              return;
            }

            this.createLeadService.getLeadById(leadId).subscribe((res: any) => {
              const response = res;
              const appiyoError = response.Error;
              const apiError = response.ProcessVariables.error.code;
              const leadSectionData = response.ProcessVariables;

              if (appiyoError === '0' && apiError === '0') {
                console.log('leadSectionData', leadSectionData);
                this.createLeadDataService.setLeadSectionData(leadSectionData);
                this.router.navigateByUrl('pages/lead-section');
              }
            });
          }
        },
        (err) => {
          alert(err);
        }
      );
  }
}
