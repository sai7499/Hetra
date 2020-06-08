import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { Location } from '@angular/common'
import {
  Applicant,
  ApplicantDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
  IndivProspectProfileDetails,
} from '@model/applicant.model';

@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual = false;
  isSelfEmployed = true;
  labels: any = {};
  LOV: any = [];
  applicantId: number;
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

  leadId;
  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private location: Location
  ) {}
  async ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );

    this.basicForm = new FormGroup({
      entity: new FormControl(''),
      applicantRelationshipWithLead: new FormControl(''),
      title: new FormControl(''),
      details: new FormArray([]),
    });
    this.addNonIndividualFormControls();
    this.getLOV();
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.applicantDataService.setApplicantId(this.applicantId);
      this.getApplicantDetails();
    });
    this.leadId = (await this.getLeadId()) as number;
  }

  getApplicantDetails() {
    const data = {
      applicantId: this.applicantId,
    };
    this.applicantService.getApplicantDetail(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const error = processVariables.error;
      if (error && error.code !== '0') {
        alert(error.message);
        return;
      }
      const applicant: Applicant = {
        ...processVariables,
      };
      this.applicantDataService.setApplicant(applicant);
      this.applicant = this.applicantDataService.getApplicant();
      console.log('DDE COMING APPLICANT DATAS ', this.applicant);
      this.setBasicData();
    });
  }

  setBasicData() {
    this.isIndividual = this.applicant.applicantDetails.entity === 'Individual';
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      applicantRelationshipWithLead:
        this.applicant.applicantDetails.applicantTypeKey || '',
      title: this.applicant.applicantDetails.title,
    });
    if (this.isIndividual) {
      this.clearFormArray();
      this.addIndividualFormControls();
      this.setValuesForIndividual();
    } else {
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
    }
  }

  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
      ? this.applicant.aboutIndivProspectDetails
      : {};
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const applicantDetails = this.applicant.applicantDetails;
    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,
      title: applicantDetails.title,
      customerCategory: applicantDetails.customerCategory,
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
      employeeCode: aboutIndivProspectDetails.employeeCode,
      employerType: aboutIndivProspectDetails.employerType,
      isSeniorCitizen: aboutIndivProspectDetails.isSeniorCitizen,
      minorGuardianUcic: aboutIndivProspectDetails.minorGuardianUcic,
      designation: aboutIndivProspectDetails.designation,

      currentEmpYears: aboutIndivProspectDetails.currentEmpYears,
      department: aboutIndivProspectDetails.department,

      //employerType : aboutIndivProspectDetails.employerType,
    });
  }

  setValuesForNonIndividual() {
    const applicantDetails = this.applicant.applicantDetails;
    const corporateProspectDetails = this.applicant.corporateProspectDetails;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,
      title: applicantDetails.title,
      companyPhoneNumber: corporateProspectDetails.companyPhoneNumber,
      companyEmailId: corporateProspectDetails.companyEmailId,
      alternateEmailId: corporateProspectDetails.alternateEmailId,
      numberOfDirectors: corporateProspectDetails.numberOfDirectors,
      dateOfIncorporation: corporateProspectDetails.dateOfIncorporation,
      preferredLanguageCommunication:
        corporateProspectDetails.preferredLanguageCommunication,
      customerCategory: applicantDetails.customerCategory,
      directorName: corporateProspectDetails.directorName,
      directorIdentificationNumber:
        corporateProspectDetails.directorIdentificationNumber,
      contactPerson: corporateProspectDetails.contactPerson,
      contactPersonDesignation:
        corporateProspectDetails.contactPersonDesignation,
      contactPersonMobile: corporateProspectDetails.contactPersonMobile,
      ratingIssuerName: corporateProspectDetails.ratingIssuerName,
      externalRatingAssigned: corporateProspectDetails.externalRatingAssigned,
      externalRatingIssueDate: corporateProspectDetails.externalRatingIssueDate,
      externalRatingExpiryDate:
        corporateProspectDetails.externalRatingExpiryDate,
      foreignCurrencyDealing: corporateProspectDetails.foreignCurrencyDealing,
      exposureBankingSystem: corporateProspectDetails.exposureBankingSystem,
      creditRiskScore: corporateProspectDetails.creditRiskScore,
    });
  }

  addIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null),
      name2: new FormControl(null),
      name3: new FormControl(null),
      mobilePhone: new FormControl(null),
      dob: new FormControl(null),

      applicantType: new FormControl(null),
      isSeniorCitizen: new FormControl(null),
      minorGuardianName: new FormControl(null),
      minorGuardianUcic: new FormControl(null),
      fatherName: new FormControl(null),
      spouseName: new FormControl(null),
      motherMaidenName: new FormControl(null),
      occupation: new FormControl(''),
      nationality: new FormControl(''),
      customerCategory: new FormControl(''),
      emailId: new FormControl(''),
      alternateEmailId: new FormControl(''),
      preferredLanguage: new FormControl(''),
      // accountNumber: new FormControl(null),
      // accountBank: new FormControl(''),
      // branchAddress: new FormControl(null),
      // spokeAddress: new FormControl(null),
      designation: new FormControl(''),
      officeName: new FormControl(null),
      currentEmpYears: new FormControl(null),
      employeeCode: new FormControl(null),
      employerType: new FormControl(''),
      department: new FormControl(''),
      businessType: new FormControl(''),
      businessName: new FormControl(null),
      businessStartDate: new FormControl(null),
      currentBusinessYear: new FormControl(null),
      turnOver: new FormControl(null),
    });
    formArray.push(controls);
    // setTimeout(() => {
    //     this.addOrRemoveSelfEmployedFormControls(false);
    // });
  }

  addNonIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null),
      name2: new FormControl(null),
      name3: new FormControl(null),
      companyPhoneNumber: new FormControl(null),
      dateOfIncorporation: new FormControl(null),
      // occupation: new FormControl(''),
      customerCategory: new FormControl(null),
      companyEmailId: new FormControl(null),
      alternateEmailId: new FormControl(null),
      preferredLanguageCommunication: new FormControl(''),
      numberOfDirectors: new FormControl(null),
      // accountNumber: new FormControl(null),
      // accountBank: new FormControl(''),
      // branchAddress: new FormControl(null),
      // spokeAddress: new FormControl(null),
      directorName: new FormControl(null),
      directorIdentificationNumber: new FormControl(null),
      contactPerson: new FormControl(null),
      contactPersonDesignation: new FormControl(''),
      contactPersonMobile: new FormControl(null),
      ratingIssuerName: new FormControl(null),
      externalRatingAssigned: new FormControl(null),
      externalRatingIssueDate: new FormControl(null),
      externalRatingExpiryDate: new FormControl(null),
      foreignCurrencyDealing: new FormControl(null),
      exposureBankingSystem: new FormControl(null),
      creditRiskScore: new FormControl(null),
    });
    formArray.push(controls);
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOvs', this.LOV);
  }
  clearFormArray() {
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
  }

  onDesignationChange(event) {
    const value = event.target.value;

    this.addOrRemoveSelfEmployedFormControls(value === '2');
  }

  addOrRemoveSelfEmployedFormControls(isAdd: boolean) {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = formArray.at(0) as FormGroup;

    if (isAdd) {
      this.isSelfEmployed = true;
      controls.addControl('businessType', new FormControl(''));
      controls.addControl('businessName', new FormControl(null));
      controls.addControl('businessStartDate', new FormControl(null));
      controls.addControl('currentBusinessYear', new FormControl(null));
      controls.addControl('turnOver', new FormControl(null));
    } else {
      this.isSelfEmployed = false;
      controls.removeControl('businessType');
      controls.removeControl('businessName');
      controls.removeControl('businessStartDate');
      controls.removeControl('currentBusinessYear');
      controls.removeControl('turnOver');
    }
  }

  onIndividualChange(event) {
    const value = event.target.value;
    this.isIndividual = value === 'INDIVENTTYP';
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
    this.isIndividual
      ? this.addIndividualFormControls()
      : this.addNonIndividualFormControls();
  }

  async onSubmit() {
    const value = this.basicForm.getRawValue();
    console.log('GETRAWVALUE', value);
    if (this.isIndividual) {
      this.storeIndividualValueInService(value);
    } else {
      this.storeNonIndividualValueInService(value);
    }

    const applicantData = this.applicantDataService.getApplicant();
    
    console.log('LEADID', this.leadId);
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
      leadId: this.leadId,
    };

    this.applicantService.saveApplicant(data).subscribe((response: any) => {
      if (response.Error === '0') {
        console.log('RESPONSE', response);
        this.router.navigate([
          `/pages/applicant-details/${this.leadId}/identity-details`,
          this.applicantId,
        ]);
      }
    });
  }

  getLeadId() {
    return new Promise((resolve, reject) => {
      this.activatedRoute.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  storeIndividualValueInService(value) {
    const prospectDetails: IndividualProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};
    const indivProspectProfileDetails: IndivProspectProfileDetails = {};
    const formValue = value.details[0];
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2;
    applicantDetails.name3 = formValue.name3;
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.entityType = value.entity;
    applicantDetails.title = value.title;
    applicantDetails.customerCategory = formValue.customerCategory;
    this.applicantDataService.setApplicantDetails(applicantDetails);

    const aboutIndivProspectDetails = formValue;
    prospectDetails.dob = formValue.dob;
    prospectDetails.mobilePhone = aboutIndivProspectDetails.mobilePhone;
    prospectDetails.isSeniorCitizen = '1';
    prospectDetails.minorGuardianName =
      aboutIndivProspectDetails.minorGuardianName;
    prospectDetails.minorGuardianUcic = Number(
      aboutIndivProspectDetails.minorGuardianUcic
    );
    prospectDetails.spouseName = aboutIndivProspectDetails.spouseName;
    prospectDetails.fatherName = aboutIndivProspectDetails.fatherName;
    prospectDetails.motherMaidenName =
      aboutIndivProspectDetails.motherMaidenName;
    prospectDetails.nationality = aboutIndivProspectDetails.nationality;
    prospectDetails.occupation = aboutIndivProspectDetails.occupation;
    prospectDetails.emailId = aboutIndivProspectDetails.emailId;
    prospectDetails.alternateEmailId =
      aboutIndivProspectDetails.alternateEmailId;
    prospectDetails.preferredLanguage =
      aboutIndivProspectDetails.preferredLanguage;
    prospectDetails.designation = aboutIndivProspectDetails.designation;
    prospectDetails.currentEmpYears = aboutIndivProspectDetails.currentEmpYears;
    prospectDetails.employeeCode = aboutIndivProspectDetails.employeeCode;
    prospectDetails.department = 'department';

    this.applicantDataService.setIndividualProspectDetails(prospectDetails);

    // this.applicantDataService.setIndividualProspectDetails(
    //   ProspectProfileDetails
    // );

    indivProspectProfileDetails.employerType = formValue.employerType;
    this.applicantDataService.setindivProspectProfileDetails(
      indivProspectProfileDetails
    );
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
    applicantDetails.title = value.title;
    applicantDetails.customerCategory = value.customerCategory;

    this.applicantDataService.setApplicantDetails(applicantDetails);

    const corporateProspectDetails = formValue;

    prospectDetails.companyEmailId = corporateProspectDetails.companyEmailId;

    prospectDetails.alternateEmailId =
      corporateProspectDetails.alternateEmailId;
    // prospectDetails.companyPhoneNumber = '8888888888';
    prospectDetails.companyPhoneNumber = corporateProspectDetails.mobilePhone;
    prospectDetails.contactPerson = corporateProspectDetails.contactPerson;
    prospectDetails.contactPersonMobile =
      corporateProspectDetails.contactPersonMobile;
    prospectDetails.contactPersonDesignation =
      corporateProspectDetails.contactPersonDesignation;
    prospectDetails.creditRiskScore = corporateProspectDetails.creditRiskScore;
    prospectDetails.dateOfIncorporation =
      corporateProspectDetails.dateOfIncorporation;
    prospectDetails.directorIdentificationNumber =
      corporateProspectDetails.directorIdentificationNumber;
    prospectDetails.directorName = corporateProspectDetails.directorName;
    prospectDetails.exposureBankingSystem =
      corporateProspectDetails.exposureBankingSystem;
    prospectDetails.externalRatingAssigned =
      corporateProspectDetails.externalRatingAssigned;
    // prospectDetails.externalRatingExpiryDate = '22-Mar-2020';
    prospectDetails.externalRatingExpiryDate =
      corporateProspectDetails.externalRatingExpiryDate;
    // prospectDetails.externalRatingIssueDate = '22-Mar-2020';
    prospectDetails.externalRatingIssueDate =
      corporateProspectDetails.externalRatingIssueDate;
    prospectDetails.foreignCurrencyDealing =
      corporateProspectDetails.foreignCurrencyDealing;
    prospectDetails.numberOfDirectors = Number(
      corporateProspectDetails.numberOfDirectors
    );
    prospectDetails.preferredLanguageCommunication =
      corporateProspectDetails.preferredLanguageCommunication;
    prospectDetails.ratingIssuerName =
      corporateProspectDetails.ratingIssuerName;

    this.applicantDataService.setCorporateProspectDetails(prospectDetails);
  }
  onBack(){
    this.location.back()
  }
onBackToApplicant(){
  this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`)
}

}
