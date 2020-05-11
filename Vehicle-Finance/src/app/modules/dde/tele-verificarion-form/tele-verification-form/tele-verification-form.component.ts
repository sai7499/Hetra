import { Component, OnInit } from '@angular/core';
import { LabelsService } from '@services/labels.service';
import { FormGroup, FormBuilder, FormControl, Form, Validators } from '@angular/forms';

@Component({
  selector: 'app-tele-verification-form',
  templateUrl: './tele-verification-form.component.html',
  styleUrls: ['./tele-verification-form.component.css']
})
export class TeleVerificationFormComponent implements OnInit {
  teleVerificationForm: FormGroup;
  labels: any = {};

  constructor(
    private fb: FormBuilder,
    private labelDetails: LabelsService
    ) { }

    initForm() {
      this.teleVerificationForm = this.fb.group({
        leadNumber: [''],
        applicantName: [''],
        soName: [''],
        assetCost: [],
        financeAmount: [],
        tenureInMonths: [],
        sourceOfProposal: [],
        product: [],
        emi: [],
        contractDetails: [],
        residence: [],
        otherVehicles: [],
        phoneNo: [],
        address: [],
        anyOtherLoansAsset: [],
        teleVerificationEmi: [],
        noOfYears: [],
        teleVerificationCC: [],
        status: [],
        spokenTo: [],
        familyMembers: [],
        relationWithApplicant: [],
        date: [],
        time: [],
        tvrDoneByName: [],
        eCode: [],
        sign: [],
        office: [],
        workExperience: [],
        phoneNo2: [],
        extn: [],
        workStability: [],
        natureOfBusiness: [],
        businessStability: [],
        coNameAndAddress: [],
        designation: [],
        industryType: [],
        yearsInEmP: [],
        employees: [],
        spokenTo2: [],
        relation: [],
        monthlySalaryGross: [],
        otherSourcesofIncome: [],
        decision: [],

      });
    }

    get teleVerificationFormControls() { return this.teleVerificationForm.controls; }

  ngOnInit() {
    this.labelDetails.getLabelsData().subscribe(
      data => {
        this.labels = data;
      }
    );
    this.initForm();
  }

}
