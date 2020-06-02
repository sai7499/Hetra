import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LOVS, Item, LovList } from '@model/lov.model';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import {
  Applicant,
  ApplicantDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
} from '@model/applicant.model';

@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual: boolean;
  isSelfEmployed = true;
  labels: any = {};
  applicantLov: LOVS;
  applicantId: number | string= '';
  applicant: Applicant;
  designation = [
    {
      key: 1,
      value: 'Salaried',
    },
    {
      key: 2,
      value: 'Self Employed',
    },
  ];
  constructor(
    private labelsData: LabelsService,
    private lovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService
  ) {}

  ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        // console.log(this.labels)
      },
      (error) => {
        console.log(error);
      }
    );

    this.basicForm = new FormGroup({
      entity: new FormControl(''),
      applicantRelationshipWithLead: new FormControl(''),
      details: new FormArray([]),
    });
    this.addNonIndividualFormControls();
    this.getLovData();
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.applicantDataService.setApplicantId(this.applicantId);
      this.getApplicantDetails();
    });
    // setTimeout(() => {
    // this.clearFormArray();
    // });
  }

  getApplicantDetails() {
    const data = {
      applicantId: this.applicantId,
    };
    this.applicantService.getApplicantDetail(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const applicant: Applicant = {
        ...processVariables,
      };
      this.applicantDataService.setApplicant(applicant);
      this.applicant = this.applicantDataService.getApplicant();

      this.setBasicData();
    });
  }

  setBasicData() {
    this.isIndividual = this.applicant.applicantDetails.entity === 'Individual';
    // this.clearFormArray();
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      applicantRelationshipWithLead: this.applicant.applicantDetails
        .applicantTypeKey,
    });
    if (this.isIndividual) {
      this.clearFormArray();
      this.addIndividualFormControls();
      this.setValuesForIndividual();
      
    } else {
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
    }
    const applicantDetails = this.applicant.applicantDetails;
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,
    });
  }

  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      emailId: aboutIndivProspectDetails.emailId,
      alternateEmailId: aboutIndivProspectDetails.alternateEmailId,
      mobilePhone: aboutIndivProspectDetails.mobilePhone,
      dob: aboutIndivProspectDetails.dob,
      minorGuardianName: aboutIndivProspectDetails.minorGuardianName,
      fatherName: aboutIndivProspectDetails.fatherName,
      spouseName: aboutIndivProspectDetails.spouseName,
      motherMaidenName: aboutIndivProspectDetails.motherMaidenName,
      preferredLanguage: aboutIndivProspectDetails.preferredLanguage,
      occupation: aboutIndivProspectDetails.occupation,
      nationality: aboutIndivProspectDetails.nationality,
    });
  }

  setValuesForNonIndividual() {
    const applicantDetails = this.applicant.applicantDetails;
    const corporateProspectDetails = this.applicant.corporateProspectDetails;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      companyEmailId: corporateProspectDetails.companyEmailId,
      alternateEmailId: corporateProspectDetails.alternateEmailId,
      numberOfDirectors: corporateProspectDetails.numberOfDirectors,
      dateOfIncorporation: corporateProspectDetails.dateOfIncorporation,
      // occupation: '',
      // nationality: '',
      preferredLanguageCommunication:
        corporateProspectDetails.preferredLanguageCommunication,
    });
  }

  clearFormArray() {
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
  }

  getLovData() {
    this.lovService.getLovData().subscribe((value: LovList) => {
      this.applicantLov = value.LOVS;
    });
  }

  addIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl({ value: '', disabled: true }),
      name2: new FormControl({ value: '', disabled: true }),
      name3: new FormControl({ value: '', disabled: true }),
      mobilePhone: new FormControl(null),
      dob: new FormControl(null),
      applicantType: new FormControl(null),
      minorGuardianName: new FormControl(null),
      fatherName: new FormControl(null),
      spouseName: new FormControl(null),
      motherMaidenName: new FormControl(null),
      occupation: new FormControl(''),
      nationality: new FormControl(''),
      customerCategory: new FormControl(''),
      emailId: new FormControl(''),
      alternateEmailId: new FormControl(''),
      preferredLanguage: new FormControl(''),
    });
    formArray.push(controls);
  }

  addNonIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null),
      name2: new FormControl(null),
      name3: new FormControl(null),
      occupation: new FormControl(''),
      customerCategory: new FormControl(null),
      companyEmailId: new FormControl(null),
      alternateEmailId: new FormControl(null),
      preferredLanguageCommunication: new FormControl(''),
      dateOfIncorporation: new FormControl(null),
      numberOfDirectors: new FormControl(null),
    });
    formArray.push(controls);
  }

  onIndividualChange(event) {
    if (!event) {
      return;
    }
    const value = event.value;
    this.isIndividual = value === 'Individual';
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
    this.isIndividual
      ? this.addIndividualFormControls()
      : this.addNonIndividualFormControls();
  }

  onSave() {
    const rawValue = this.basicForm.getRawValue();
    if (this.isIndividual) {
      this.storeIndividualValueInService(rawValue);
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
      this.storeNonIndividualValueInService(rawValue);
      this.applicantDataService.setIndividualProspectDetails(null);
    }
    const applicantData = this.applicantDataService.getApplicant();
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
    };
    this.applicantService.saveApplicant(data).subscribe((res) => {
      console.log('res', res);
    });
  }

  storeIndividualValueInService(value) {
    const prospectDetails: IndividualProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};
    const formValue = value.details[0];
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2;
    applicantDetails.name3 = formValue.name3;
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.entityType = value.entity;
    applicantDetails.customerCategory = formValue.customerCategory;
    this.applicantDataService.setApplicantDetails(applicantDetails);
    prospectDetails.emailId = formValue.emailId;
    prospectDetails.alternateEmailId = formValue.alternateEmailId;
    prospectDetails.mobilePhone = formValue.mobilePhone;
    prospectDetails.dob = formValue.dob;
    prospectDetails.minorGuardianName = formValue.minorGuardianName;
    prospectDetails.fatherName = formValue.fatherName;
    prospectDetails.spouseName = formValue.spouseName;
    prospectDetails.motherMaidenName = formValue.motherMaidenName;
    prospectDetails.occupation = formValue.occupation;
    prospectDetails.nationality = formValue.nationality;
    prospectDetails.preferredLanguage = formValue.preferredLanguage;
    this.applicantDataService.setIndividualProspectDetails(prospectDetails);
  }

  storeNonIndividualValueInService(value) {
    const prospectDetails: CorporateProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};

    const formValue = value.details[0];

    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2;
    applicantDetails.name3 = formValue.name3;
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.entityType = value.entity;

    applicantDetails.customerCategory = formValue.customerCategory;

    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.companyEmailId = formValue.companyEmailId;

    prospectDetails.alternateEmailId = formValue.alternateEmailId;
    // prospectDetails.occupation = formValue.occupation;
    prospectDetails.dateOfIncorporation = formValue.dateOfIncorporation;
    prospectDetails.numberOfDirectors = Number(formValue.numberOfDirectors);
    prospectDetails.preferredLanguageCommunication =
      formValue.preferredLanguageCommunication;
    this.applicantDataService.setCorporateProspectDetails(prospectDetails);
  }
}
