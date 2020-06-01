import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import {
  Applicant,
  ApplicantDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
  IndivProspectProfileDetails
} from '@model/applicant.model';

@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual = true;
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
  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
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
      title: new FormControl(''),
      details: new FormArray([]),
    });
    this.addIndividualFormControls();
    this.getLOV();
    this.activatedRoute.params.subscribe((value) => {
      console.log('value', value);
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.getApplicantDetails();
    });
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
      console.log('applicantDetailsfromService--', this.applicant);

      this.setBasicData();
    });
  }

  setBasicData() {
    this.isIndividual = this.applicant.applicantDetails.entity === 'Individual';
    this.clearFormArray();
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      applicantRelationshipWithLead:
        this.applicant.applicantDetails.applicantTypeKey || '',
      title: this.applicant.applicantDetails.title,
    });
    console.log('"LOV?.LOVS?.entityType', this.LOV.LOVS.entityType);
    console.log(
      'this.applicant.applicantDetails.entityTypeKey',
      this.applicant.applicantDetails.entityTypeKey
    );
    if (this.isIndividual) {
      this.addIndividualFormControls();
      this.setValuesForIndividual();
    } else {
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
      const applicantDetails = this.applicant.applicantDetails;

      const formArray = this.basicForm.get('details') as FormArray;
      const details = formArray.at(0);
      details.patchValue({
        name1: applicantDetails.name1,
        name2: applicantDetails.name2,
        name3: applicantDetails.name3,
      });
    }
  }

  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails;
    console.log('aboutIndivProspectDetails--', aboutIndivProspectDetails);
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
      employeeCode: aboutIndivProspectDetails.employeeCode,
      isSeniorCitizen: aboutIndivProspectDetails.isSeniorCitizen,
      minorGuardianUcic: aboutIndivProspectDetails.minorGuardianUcic,
      designation: aboutIndivProspectDetails.designation,

      currentEmpYears: aboutIndivProspectDetails.currentEmpYears,
      department: aboutIndivProspectDetails.department,

      // employerType : aboutIndivProspectDetails.employerType,
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
      isSeniorCitizen: new FormControl(''),
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
      mobilePhone: new FormControl(null),
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
    console.log('LOV data ---', this.LOV);
  }
  clearFormArray() {
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
  }

  onDesignationChange(event) {
    const value = event.target.value;
    // const formArray = (this.basicForm.get('details') as FormArray);
    // const controls = formArray.at(0) as FormGroup;
    // controls.removeControl('department');
    // console.log('formArray', formArray);
    // if (value === '1') {

    // }
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

  onSubmit() {
    console.log('form value', this.basicForm.value);
    const value = this.basicForm.getRawValue();
    console.log('raw value', value);
    if (this.isIndividual) {
      this.storeIndividualValueInService(value);
      return;
    }
    this.storeNonIndividualValueInService(value);
    // this.applicantDataService.setCorporateProspectDetails(this.getValue());
    const applicantData = this.applicantDataService.getApplicant();
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
    };
    this.applicantService.saveApplicant(data).subscribe((response) => {
      console.log('response', response);
    });
  }

  getValue() {
    return {
      dateOfIncorporation: '20-Mar-2020',
      countryOfCorporation: 'IND',
      companyEmailId: 'appiyo@appiyo.com',
      alternateEmailId: 'inswit@appiyo.com',
      preferredLanguageCommunication: 'ENGPRFLAN',
      numberOfDirectors: 10,
      directorName: 'test',
      directorIdentificationNumber: '123456',
      contactPerson: 'test',
      contactPersonDesignation: 'Manager',
      contactPersonMobile: '9988776655',
      ratingIssuerName: 'test',
      externalRatingAssigned: 'test',
      externalRatingIssueDate: '22-Mar-2020',
      externalRatingExpiryDate: '31-Mar-2020',
      foreignCurrencyDealing: 'test',
      exposureBankingSystem: 'test',
      creditRiskScore: 'test',
      tinNumber: 'tin1234',
      corporateIdentificationNumber: '44455566',
      gstNumber: 'GST123',
      panNumber: 'BNLPA1365S',
      aadhar: '123456786666',
      passportNumber: 'ABCD1234',
      passportIssueDate: '21-Mar-2020',
      passportExpiryDate: '21-Mar-2022',
      drivingLicenseNumber: 'TN2020',
      drivingLicenseIssueDate: '21-Mar-2020',
      drivingLicenseExpiryDate: '21-Mar-2021',
      voterIdNumber: '1234567',
      voterIdIssueDate: '21-Mar-2020',
      voterIdExpiryDate: '21-Mar-2021',
      companyPhoneNumber: '9988445566',
    };
  }

  storeIndividualValueInService(value) {
    const prospectDetails: IndividualProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};
    const ProspectProfileDetails : IndivProspectProfileDetails={}
    const formValue = value.details[0];
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2;
    applicantDetails.name3 = formValue.name3;
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.entityType = value.entity;
    applicantDetails.customerCategory= value.customerCategory
    this.applicantDataService.setApplicantDetails(applicantDetails);


    const aboutIndivProspectDetails = formValue;
    prospectDetails.dob = formValue.dob;
    prospectDetails.mobilePhone = aboutIndivProspectDetails.mobilePhone;
    prospectDetails.isSeniorCitizen = aboutIndivProspectDetails.isSeniorCitizen;
    prospectDetails.minorGuardianName = aboutIndivProspectDetails.minorGuardianName;
    prospectDetails.minorGuardianUcic = aboutIndivProspectDetails.minorGuardianUcic;
    prospectDetails.spouseName = aboutIndivProspectDetails.spouseName;
    prospectDetails.fatherName = aboutIndivProspectDetails.fatherName;
    prospectDetails.motherMaidenName = aboutIndivProspectDetails.motherMaidenName;
    prospectDetails.nationality = aboutIndivProspectDetails.nationality;
    prospectDetails.occupation = aboutIndivProspectDetails.occupation;
    prospectDetails.emailId = aboutIndivProspectDetails.emailId;
    prospectDetails.alternateEmailId = aboutIndivProspectDetails.alternateEmailId;
    prospectDetails.preferredLanguage = aboutIndivProspectDetails.preferredLanguage;
    prospectDetails.designation = aboutIndivProspectDetails.designation;
    prospectDetails.currentEmpYears = aboutIndivProspectDetails.currentEmpYears;
    prospectDetails.employeeCode = aboutIndivProspectDetails.employeeCode;
    prospectDetails.department = aboutIndivProspectDetails.department;

    console.log('aboutIndivProspectDetails', aboutIndivProspectDetails)

    this.applicantDataService.setIndividualProspectDetails(prospectDetails);

    const IndivProspectProfileDetails = formValue
    ProspectProfileDetails.employerType= IndivProspectProfileDetails.employerType;

    console.log('IndivProspectProfileDetails', IndivProspectProfileDetails)
    this.applicantDataService.setindivProspectProfileDetails(ProspectProfileDetails);

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
    applicantDetails.customerCategory= value.customerCategory

    this.applicantDataService.setApplicantDetails(applicantDetails);

    const corporateProspectDetails = formValue;

    prospectDetails.companyEmailId = corporateProspectDetails.companyEmailId;

    prospectDetails.alternateEmailId =
      corporateProspectDetails.alternateEmailId;
    prospectDetails.companyPhoneNumber = '8888888888';
    // prospectDetails.companyPhoneNumber = corporateProspectDetails.mobilePhone;
    prospectDetails.contactPerson = corporateProspectDetails.contactPerson;
    prospectDetails.contactPersonMobile =
      corporateProspectDetails.contactPersonMobile;
    prospectDetails.contactPersonDesignation = 'contact';
    // corporateProspectDetails.contactPersonDesignation;
    prospectDetails.creditRiskScore = corporateProspectDetails.creditRiskScore;
    prospectDetails.dateOfIncorporation = '22-Mar-2020';
    // corporateProspectDetails.dateOfIncorporation;
    prospectDetails.directorIdentificationNumber =
      corporateProspectDetails.directorIdentificationNumber;
    prospectDetails.directorName = corporateProspectDetails.directorName;
    prospectDetails.exposureBankingSystem =
      corporateProspectDetails.exposureBankingSystem;
    prospectDetails.externalRatingAssigned =
      corporateProspectDetails.externalRatingAssigned;
    prospectDetails.externalRatingExpiryDate = '22-Mar-2020';
    // corporateProspectDetails.externalRatingExpiryDate;
    prospectDetails.externalRatingIssueDate = '22-Mar-2020';
    //  corporateProspectDetails.externalRatingIssueDate;
    prospectDetails.foreignCurrencyDealing =
      corporateProspectDetails.foreignCurrencyDealing;
    prospectDetails.numberOfDirectors = Number(
      corporateProspectDetails.numberOfDirectors
    );
    prospectDetails.preferredLanguageCommunication =
      corporateProspectDetails.preferredLanguageCommunication;
    prospectDetails.ratingIssuerName =
      corporateProspectDetails.ratingIssuerName;

    console.log('prospectDetails', prospectDetails);
    this.applicantDataService.setCorporateProspectDetails(prospectDetails);
  }
}
