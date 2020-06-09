import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';

import { CreateLeadService } from '../service/creatLead.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LoginStoreService } from '@services/login-store.service';
import { CreateLeadDataService } from '../service/createLead-data.service';
import { UtilityService } from '@services/utility.service';
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

  applicantType = 'INDIVENTTYP';
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

  productCategoryData;
  productData = [];
  sourchingType: string;
  productCategorySelectedList = [];
  productCategoryList = [];

  obj = {};

  test = [];

  loanLeadDetails: {
    bizDivision: string;
    product: string;
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

  constructor(
    private router: Router,
    private leadStoreService: LeadStoreService,
    private labelsData: LabelsService,
    private createLeadService: CreateLeadService,
    private commonLovService: CommomLovService,
    private loginStoreService: LoginStoreService,
    private createLeadDataService: CreateLeadDataService,
    private utilityService: UtilityService
  ) { }

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
      product: new FormControl(''),
      fundingProgram: new FormControl(''),
      priority: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      dealerCode: new FormControl(''),
      rcLimit: new FormControl(''),
      rcUtilizedLimit: new FormControl(''),
      rcUnutilizedLimit: new FormControl(''),
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
    this.commonLovService
      .getLovData()
      .subscribe((lov: any) => (this.LOV = lov));
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
        this.productCategoryList = res.ProcessVariables.productCategoryDetails;
        this.productCategoryData = this.utilityService.getValueFromJSON(
          this.productCategoryList,
          'productCatCode',
          'prodcutCatName'
        );
      });
  }

  productCategoryChange(event) {
    const productCategorySelected = event.target.value;
    this.productCategorySelectedList = this.utilityService.getValueFromJSON(
      this.productCategoryList.filter(data => data.productCatCode === productCategorySelected),
      'assetProdcutCode', 'assetProdutName');
  }

  getSourcingChannel() {
    this.createLeadService.getSourcingChannel().subscribe((res: any) => {
      const response = res.ProcessVariables.sourcingChannelObj;
      this.sourchingTypeData = response;
    });
  }

  sourcingChannelChange(event: any) {
    this.sourchingTypeValues = [];
    this.sourcingChange = event.target.value;
    this.sourcingCodePlaceholder =
      this.sourcingChange === '4SOURCHAN' ? 'Campaign Code' : 'Employee Code';

    this.sourchingTypeData.map((element) => {
      if (element.sourcingChannelId === this.sourcingChange) {
        const data = {
          key: element.sourcingTypeId,
          value: element.sourcingTypeDesc,
        };
        this.sourchingTypeValues.push(data);
      }
    });
    this.createLeadForm.patchValue({ sourcingType: '' });
    if (this.sourchingTypeValues.length === 1) {
      const sourcingTypeData = this.sourchingTypeValues[0].key;
      this.createLeadForm.patchValue({ sourcingType: sourcingTypeData });
      return;
    }
    if (this.sourchingTypeValues.length === 0) {
      this.sourchingTypeValues.push({ key: 'notApplicable', value: 'Not Applicable' });
      const sourcingTypeData = this.sourchingTypeValues[0].key;
      this.createLeadForm.patchValue({ sourcingType: sourcingTypeData });
    }
  }

  selectApplicantType(event: any) {
    this.applicantType = event.target.value;
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
    this.leadStoreService.setLeadCreation(leadModel);

    this.loanLeadDetails = {
      bizDivision: leadModel.bizDivision,
      product: leadModel.product,
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
                const leadId = leadSectionData.leadId;

                if (isDedupeAvailable) {
                  const leadDedupeData =
                    response.ProcessVariables.leadDedupeResults;
                  this.leadStoreService.setDedupeData(leadDedupeData);
                  this.router.navigateByUrl('pages/lead-creation/lead-dedupe');
                  return;
                }

                this.createLeadService
                  .getLeadById(leadId)
                  .subscribe((res: any) => {
                    const response = res;
                    const appiyoError = response.Error;
                    const apiError = response.ProcessVariables.error.code;
                    const leadSectionData = response.ProcessVariables;

                    if (appiyoError === '0' && apiError === '0') {
                      console.log('leadSectionData', leadSectionData);
                      const leadId = leadSectionData.leadId;
                      this.createLeadDataService.setLeadSectionData(
                        leadSectionData
                      );
                      this.router.navigateByUrl(`pages/lead-section/${leadId}`);
                    }
                  });
              } else {
                const message = response.ProcessVariables.error.message;
                alert(message);
              }
            });
          } else {
            const message = response.ProcessVariables.error.message;
            alert(message);
          }
        },
        (err) => {
          alert(err);
        }
      );
  }
}
