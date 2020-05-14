import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


import { LovDataService } from 'src/app/services/lov-data.service';
import { LabelsService } from 'src/app/services/labels.service';
import { LeadStoreService } from 'src/app/services/lead-store.service';

import { CreateLeadService } from '../service/creatLead.service';
import { CommomLovService } from '../../../services/commom-lov-service';

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

  applicantType: string = 'I';
  SourcingChange: any;
  sourcingCode: string = 'Sourcing Code'
  ProfessionList = [];
  text: string;
  isDisabled: boolean = true;

  LOV: any = [];

  loanLeadDetails: {
    bizDivision: number,
    productCategory: number,
    priority: number,
    fundingProgram: number,
    sourcingChannel: number,
    sourcingType: number,
    sourcingCode: string,
    spokeCode: number,
    loanBranch: number,
    leadHandeledBy: number
  }

  applicantDetails: {
    entity: string
    nameOne: string,
    nameTwo: string,
    nameThree: string,
    mobileNumber: string,
    dobOrDoc: string
  }

  selectApplicantType(event: any) {
    console.log(this.applicantType)
    this.applicantType = event.target.value;
  }

  constructor(
    private lovData: LovDataService,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private labelsData: LabelsService,
    private createLeadService: CreateLeadService,
    private commomLovService: CommomLovService
  ) {
    this.lovData.getLovData().subscribe((res: any) => {
      this.lovLabels = res[0].leadCreation[0];
      console.log(this.lovLabels);
    });
  }

  ngOnChanges() {
    console.log(this.test);
  }

  ngOnInit() {
    this.onChangeLanguage('English');
    this.getLabels();
    this.initForm();

    this.LOV = this.commomLovService.getLovData()
    console.log('Create Lead LOV data ---', this.LOV);

    this.createLeadForm.patchValue({ bizDivision: 'VFBIZDIV' })
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      data => {
        this.labels = data;
      });
  }

  initForm() {
    this.createLeadForm = new FormGroup({
      bizDivision: new FormControl({value: '', disabled: true}),
      productCategory: new FormControl(''),
      fundingProgram: new FormControl(''),
      priority: new FormControl(''),
      sourcingChannel: new FormControl(''),
      sourcingType: new FormControl(''),
      sourcingCode: new FormControl(''),
      spokeCodeLocation: new FormControl(''),
      loanBranch: new FormControl(),
      leadHandeledBy: new FormControl(''),
      entity: new FormControl(''),
      nameOne: new FormControl(''),
      nameTwo: new FormControl(''),
      nameThree: new FormControl(''),
      mobile: new FormControl(''),
      dateOfBirth: new FormControl('')
    });
  }


  sourcingChannelChange(event: any) {
    this.SourcingChange = event.target.value;
    console.log('SourcingChange', this.SourcingChange);

    switch (this.SourcingChange) {
      case '1SOURCHAN': this.ProfessionList = [{ key: 1, value: 'DSA' }, { key: 2, value: 'Dealers' }, { key: 3, value: 'Connectors' }, { key: 4, value: 'Direct/Employee/DSE' }, { key: 5, value: 'Manufacturers' }];
        break;
      case '2SOURCHAN': this.ProfessionList = [{ key: 1, value: 'Liability Branch Code' }];
        break;
      case '3SOURCHAN': this.ProfessionList = [{ key: 1, value: 'Corporate Website' }, { key: 2, value: 'Internet Banking' }, { key: 3, value: 'Mobile Banking' }];
        break;
      default: this.ProfessionList = [{ key: 1, value: 'Not Applicable' }];
        break;
    }

    if (this.SourcingChange == 64) {
      this.sourcingCode = "Campaign Code";
    }
    else {
      this.sourcingCode = "Employee Code";

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
    const formValue = this.createLeadForm.value;
    const leadModel: any = { ...formValue, professionList: this.ProfessionList };
    console.log('Form value', leadModel);
    this.leadStoreService.setLeadCreation(leadModel);

    const applicantModel = {
      first_name: leadModel.nameOne,
      middle_name: leadModel.nameTwo,
      last_name: leadModel.nameThree,
      mobile: leadModel.mobile,
      dateOfBirth: leadModel.dateOfBirth
    };

    // this.loanLeadDetails = {
    //   bizDivision: leadModel.bizDivision,
    //   productCategory: leadModel.productCategory,
    //   priority: leadModel.priority,
    //   fundingProgram: leadModel.fundingProgram,
    //   sourcingChannel: leadModel.sourcingChannel,
    //   sourcingType: leadModel.sourcingType,
    //   sourcingCode: leadModel.sourcingCode,
    //   spokeCode: leadModel.spokeCode,
    //   loanBranch: leadModel.loanBranch,
    //   leadHandeledBy: leadModel.leadHandeledBy
    // }

    // this.applicantDetails = {
    //   entity: leadModel.entity,
    //   nameOne: leadModel.nameOne,
    //   nameTwo: leadModel.nameTwo,
    //   nameThree: leadModel.nameThree,
    //   mobileNumber: leadModel.mobile,
    //   dobOrDoc: leadModel.dateOfBirth
    // }

    this.loanLeadDetails = {
      bizDivision: 1,
      productCategory: 2,
      priority: 1,
      fundingProgram: 1,
      sourcingChannel: 1,
      sourcingType: 1,
      sourcingCode: "sourcingCode",
      spokeCode: 1,
      loanBranch: 1,
      leadHandeledBy: 1
    }
    this.applicantDetails = {
      entity: "I",
      nameOne: "firstOrCompany",
      nameTwo: "firstOrCompany",
      nameThree: "firstOrCompany",
      mobileNumber: "0123654897",
      dobOrDoc: "1993-07-07"
    }

    console.log("loanLeadDetails", this.loanLeadDetails)
    console.log("applicantDetails", this.applicantDetails)

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
    })
    this.leadStoreService.setCoApplicantDetails(applicantModel);
  }

}
