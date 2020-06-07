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

    });
  }

  onSave() {
    console.log('on save', this.teleVerificationForm.value);
  }

}
