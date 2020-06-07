import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormControl, Form, Validators } from '@angular/forms';
import { CommomLovService } from '@services/commom-lov-service';
import { DdeStoreService } from '@services/dde-store.service';


@Component({
  selector: 'app-tele-verification-form',
  templateUrl: './tele-verification-form.component.html',
  styleUrls: ['./tele-verification-form.component.css']
})
export class TeleVerificationFormComponent implements OnInit {
  teleVerificationForm: FormGroup;
  labels: any = {};
  LOV: any = [];
  tvrLov: any = [];

  constructor(
    private fb: FormBuilder,
    private labelDetails: LabelsService,
    private commomLovService: CommomLovService,
    private ddeStoreService: DdeStoreService

    ) { }

    

    get teleVerificationFormControls() { return this.teleVerificationForm.controls; }

  ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.initForm();
    this.getLOV();
    this.setFormValue();
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((value) => {
      this.LOV = value;
      // this.tvrLov = value ? value[0].trackVehicle[0] : {};
    });

    console.log(this.LOV);
  }

  initForm() {
    this.teleVerificationForm = this.fb.group({
      leadNumber: [''],
      applicantName: [''],
      soName: [''],
      assetCost: [''],
      financeAmount: [''],
      tenureInMonths: [''],
      sourceOfProposal: [''],
      product: [''],
      emi: [''],
      vehicleLoanRelated: this.fb.group({
        needForProposedVehicle: [''],
      routeOfOperation: [''],
      contractDetails: [''],
      typeofGoodsCarried: [''],
      fundingAmountRequested: [''],
      endUseFunds: [''],
      tenureRequested: [''],
      }),
      teleVerification: this.fb.group({
        residence: [''],
      otherVehicles: [''],
      phoneNo: [''],
      address: [''],
      anyOtherLoansAsset: [''],
      teleVerificationEmi: [''],
      noOfYears: [''],
      teleVerificationCC: [''],
      status: [''],
      dob: [''],
      spokenTo: [''],
      familyMembers: [''],
      relationWithApplicant: [''],
      date: [''],
      time: [''],
      tvrDoneByName: [''],
      eCode: [''],
      office: [''],
      workExperience: [''],
      phoneNo2: [''],
      extn: [''],
      workStability: [''],
      natureOfBusiness: [''],
      transactionType: [''],
      businessStability: [''],
      coNameAndAddress: [''],
      designation: [''],
      industryType: [''],
      yearsInEmPBussiness: [''],
      ifBusiness: [''],
      employees: [''],
      spokenTo2: [''],
      relation: [''],
      monthlySalaryGross: [''],
      otherSourcesofIncome: [''],
      decision: ['']
      })

    });
  }

  setFormValue() {
    const tvrModel = this.ddeStoreService.trackvehicle() || {};
    console.log(tvrModel);
    this.teleVerificationForm.patchValue({
      leadNumber: tvrModel.leadNumber || '',
      applicantName: tvrModel.applicantName || '',
      soName: tvrModel.soName || '',
      assetCost: tvrModel.assetCost || '',
      financeAmount: tvrModel.financeAmount || '',
      tenureInMonths: tvrModel.tenureInMonths || '',
      sourceOfProposal: tvrModel.sourceOfProposal || '',
      product: tvrModel.product || '',
      emi: tvrModel.emi || '',
      needForProposedVehicle: tvrModel.needForProposedVehicle || '',
      routeOfOperation: tvrModel.routeOfOperation || '',
      contractDetails: tvrModel.contractDetails || '',
      typeofGoodsCarried: tvrModel.typeofGoodsCarried || '',
      fundingAmountRequested: tvrModel.fundingAmountRequested || '',
      endUseFunds: tvrModel.endUseFunds || '',
      tenureRequested: tvrModel.tenureRequested || '',
      residence: tvrModel.residence || '',
      otherVehicles: tvrModel.otherVehicles,
      phoneNo: tvrModel.phoneNo,
      address: tvrModel.address,
      anyOtherLoansAsset: tvrModel.anyOtherLoansAsset,
      teleVerificationEmi: tvrModel.teleVerificationEmi,
      noOfYears: tvrModel.noOfYears,
      teleVerificationCC: tvrModel.teleVerificationCC,
      status: tvrModel.status,
      dob: tvrModel.dob,
      spokenTo: tvrModel.spokenTo,
      familyMembers: tvrModel.familyMembers,
      relationWithApplicant: tvrModel.relationWithApplicant,
      date: tvrModel.date,
      time: tvrModel.time,
      tvrDoneByName: tvrModel.tvrDoneByName,
      eCode: tvrModel.eCode,
      office: tvrModel.office,
      workExperience: tvrModel.workExperience,
      phoneNo2: tvrModel.phoneNo2,
      extn: tvrModel.extn,
      workStability: tvrModel.workStability,
      natureOfBusiness: tvrModel.natureOfBusiness,
      transactionType: tvrModel.transactionType,
      businessStability: tvrModel.businessStability,
      coNameAndAddress: tvrModel.coNameAndAddress,
      designation: tvrModel.designation,
      industryType: tvrModel.industryType,
      yearsInEmPBussiness: tvrModel.yearsInEmPBussiness,
      ifBusiness: tvrModel.ifBusiness,
      employees: tvrModel.employees,
      spokenTo2: tvrModel.spokenTo2,
      relation: tvrModel.relation,
      monthlySalaryGross: tvrModel.monthlySalaryGross,
      otherSourcesofIncome: tvrModel.otherSourcesofIncome,
      decision: tvrModel.decision
    });
  }

  onSave() {
    console.log('on save', this.teleVerificationForm.value);
  }

}
