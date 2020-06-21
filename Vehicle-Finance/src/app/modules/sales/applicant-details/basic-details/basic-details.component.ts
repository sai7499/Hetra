import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LOVS, Item, LovList } from '@model/lov.model';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { UtilityService } from '@services/utility.service'
import {
  Applicant,
  ApplicantDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
} from '@model/applicant.model';
import { LeadStoreService } from '../../services/lead.store.service';
import { dateFieldName } from '@progress/kendo-angular-intl';
import { ToasterService } from '@services/toaster.service'


@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual: boolean;
  isSelfEmployed = true;
  labels: any = {};
  applicantLov: any = [];
  applicantId: number | string = '';
  applicant: Applicant;
  initialAge: number;
  showAge: number

  isSeniorCitizen: any = "0"
  isMinor: any = "0"
  gaurdianNamemandatory: any = {};
  checkingMinor: boolean;
  checkingSenior: boolean;

  isDirty: boolean;
  mobilePhone: any

  //imMinor : boolean= true
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
  numberPattern = {
    rule: '^[0-9]',
    msg: 'Invalid'
  }
  nameLength30 = {
    rule: 30,
  }
  mobileLenght10 = {
    rule: 10,
  }
  namePattern = {
    rule: '^[A-Z]*[a-z]*$',
    msg: 'Invalid Name',
  };
  nameSpacePattern = {
    rule: '^[A-Z ]*[a-z ]*$',
    msg: 'Invalid Name',
  };

  //   companyPattern ={
  //    rule : '^[A-Z]*[a-z]*$',
  //    msg: 'Invalid Name',
  //  };

  mobilePattern = {
    rule: '^[1-9][0-9]*$',
    msg: 'Invalid Mobile Number',
  }
  emailPattern = {
    rule: '^\\w+([\.-]?\\w+)@\\w+([\.-]?\\w+)(\\.\\w{2,10})+$',
    msg: 'Invalid email'
  }
  landlinePattern = {
    rule: '^[0-9]{6,15}',
    msg: "Invalid Number"
  }
  landlineLength15 = {
    rule: 15,
  }
  public toDayDate: Date = new Date();

  constructor(
    private labelsData: LabelsService,
    private lovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private utilityService: UtilityService,
    private toasterService : ToasterService
  ) { }

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
      title: new FormControl(''),
      entity: new FormControl({ value: '', disabled: true }),
      applicantRelationshipWithLead: new FormControl(''),

      details: new FormArray([]),


    });

   this.addNonIndividualFormControls();



    this.getLovData();
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    details.patchValue({ preferredLanguage: 'ENGPRFLAN' })


    // setTimeout(() => { 
    // this.clearFormArray();
    // });
    //this.setGaurdianFieldMandatory()
  }

  get validation() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)

    return details;
    console.log('details', details)
  }



  getApplicantDetails() {
    // const data = {
    //   applicantId: this.applicantId,
    // };
    // this.applicantService.getApplicantDetail(data).subscribe((res: any) => {
    //   const processVariables = res.ProcessVariables;
    //   const applicant: Applicant = {
    //     ...processVariables,
    //   };
    //   this.applicantDataService.setApplicant(applicant);
    this.applicant = this.applicantDataService.getApplicant();
    console.log('applicant', this.applicant);
    
   

    this.setBasicData();



  }
  initiallayAgecal(dob) {
    const convertDate = new Date(this.utilityService.getDateFromString(dob))
    const convertAge = new Date(convertDate);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.initialAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    console.log('initially age', this.initialAge)
    
    const formArray = this.basicForm.get('details') as FormArray
    const details = formArray.at(0)
    this.checkingMinor = this.initialAge < 18
    details.get('isMinor').setValue(this.checkingMinor) 
    
    this.checkingSenior = this.initialAge > 70 
    details.get('isSeniorCitizen').setValue(this.checkingSenior)


    this.isMinor = this.checkingMinor == true ? '1' : '0'
    //console.log('isminor',details.get('isMinor').value)
    this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0'
    //console.log('issenior', this.isSeniorCitizen)
    this.setGaurdianFieldMandatory()
  }

  ageCalculation(event) {
    console.log('event', event)
    const value = event;

    const convertDate = new Date(this.utilityService.getNewDateFormat(value))
    const convertAge = new Date(convertDate);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    console.log('showAge', this.showAge);


    this.basicForm.get('details')['controls'][0].get('isMinor').value = this.checkingMinor = this.showAge < 18 ? true : false
    this.basicForm.get('details')['controls'][0].get('isSeniorCitizen').value = this.checkingSenior = this.showAge > 70 ? true : false

    // console.log(this.basicForm.get('details')['controls'][0].get('isMinor').value)
    // console.log(this.basicForm.get('details')['controls'][0].get('isSeniorCitizen').value)

    //this.checkMinorOrSenior(this.showAge) 

    this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0'
    this.isMinor = this.checkingMinor == true ? '1' : '0'

    this.setGaurdianFieldMandatory()
  }





  checkSenior(event) {
    if (event.target.checked && (this.showAge < 70 || this.initialAge < 70)) {
      event.target.checked = false;
    }
    else { event.target.checked = true; }
    if (event.target.checked == true) {

    }

  }

  checkMinor(event) {
    if (event.target.checked && (this.showAge > 18 || this.initialAge > 18)) {
      event.target.checked = false;
    }
    else {
      event.target.checked = true;
    }
    console.log()
  }

  setBasicData() {
    this.isIndividual = this.applicant.applicantDetails.entity === 'Individual';
    // this.clearFormArray();
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      applicantRelationshipWithLead: this.applicant.applicantDetails
        .applicantTypeKey || '',
      title: this.applicant.applicantDetails.title || '',
    });
    if (this.isIndividual) {
      this.clearFormArray();
      this.addIndividualFormControls();
      this.setValuesForIndividual();
    } else {
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
    }
    const dob = this.applicant.aboutIndivProspectDetails.dob;
    console.log('dob', dob)
    if (dob !== null) {
      this.initiallayAgecal(dob)

    }
    const applicantDetails = this.applicant.applicantDetails;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,


      customerCategory: applicantDetails.customerCategory || '',
      custSegment: applicantDetails.custSegment || '',
    });
  }




  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
      ? this.applicant.aboutIndivProspectDetails
      : {};
    this.showAge = aboutIndivProspectDetails.age;
    const mobile = aboutIndivProspectDetails.mobilePhone;
    if (mobile && mobile.length == 12) {
      this.mobilePhone = mobile.slice(2, 12);
    }
    else if (mobile && mobile.length == 10) {
      this.mobilePhone = mobile
    }
    // this.toDayDate = new Date(aboutIndivProspectDetails.dob)
    //console.log('dob changes',new Date(this.utilityService.getDateFromString(aboutIndivProspectDetails.dob)));
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      emailId: aboutIndivProspectDetails.emailId || '',
      alternateEmailId: aboutIndivProspectDetails.alternateEmailId || '',
      mobilePhone: this.mobilePhone,
      dob: this.utilityService.getDateFromString(aboutIndivProspectDetails.dob) || new Date(),
      minorGuardianName: aboutIndivProspectDetails.minorGuardianName || '',
      fatherName: aboutIndivProspectDetails.fatherName || '',
      spouseName: aboutIndivProspectDetails.spouseName || '',
      motherMaidenName: aboutIndivProspectDetails.motherMaidenName || '',
      preferredLanguage: aboutIndivProspectDetails.preferredLanguage,
      occupation: aboutIndivProspectDetails.occupation || '',
      nationality: aboutIndivProspectDetails.nationality || '',
      age: this.showAge,
      gender: aboutIndivProspectDetails.gender || '',
      politicallyExposedPerson: aboutIndivProspectDetails.politicallyExposedPerson || '',
      alternateMobileNumber: aboutIndivProspectDetails.alternateMobileNumber || '',
      minorGuardianRelation: aboutIndivProspectDetails.minorGuardianRelation || '',

    });
    console.log('dob', aboutIndivProspectDetails.dob)
    // let dateSam = 

    //(aboutIndivProspectDetails.dob))
  }

  setValuesForNonIndividual() {
    const applicantDetails = this.applicant.applicantDetails;
    const corporateProspectDetails = this.applicant.corporateProspectDetails
      ? this.applicant.corporateProspectDetails
      : {};
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      companyEmailId: corporateProspectDetails.companyEmailId || '',
      alternateEmailId: corporateProspectDetails.alternateEmailId || '',
      numberOfDirectors: corporateProspectDetails.numberOfDirectors || '',
      dateOfIncorporation: this.utilityService.getDateFromString(corporateProspectDetails.dateOfIncorporation) || '',
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
      console.log('applicantlov', this.applicantLov)
      // this.applicantLov.salutation = 
      this.activatedRoute.params.subscribe((value) => {
        if (!value && !value.applicantId) {
          return;
        }
        this.applicantId = Number(value.applicantId);
        this.applicantDataService.setApplicantId(this.applicantId);
        this.getApplicantDetails();
      });
    });
  }

  addIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl('', Validators.required),
      name2: new FormControl(''),
      name3: new FormControl(''),
      mobilePhone: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      age: new FormControl(''),
      gender: new FormControl('', Validators.required),
      isSeniorCitizen: new FormControl(''),
      isMinor: new FormControl(''),


      minorGuardianName: new FormControl('', Validators.required),
      minorGuardianRelation: new FormControl('', Validators.required),


      alternateMobileNumber: new FormControl(''),
      applicantType: new FormControl(''),
      fatherName: new FormControl('', Validators.required),
      spouseName: new FormControl(''),
      motherMaidenName: new FormControl(''),
      occupation: new FormControl({ value: '' }, Validators.required),
      nationality: new FormControl('', Validators.required),

      emailId: new FormControl(''),
      alternateEmailId: new FormControl(''),
      preferredLanguage: new FormControl('', Validators.required),
      politicallyExposedPerson: new FormControl(null),
      customerCategory: new FormControl('', Validators.required),
      custSegment: new FormControl('', Validators.required),
    });

    formArray.push(controls);

  }
  setGaurdianFieldMandatory() {

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0) as FormGroup;
    if(details.get('isMinor').value){
      console.log('isminorgaur', details.get('isMinor').value)
      details.addControl('minorGuardianName', new FormControl())
      details.addControl ('minorGuardianRelation', new FormControl())  
    }else{
      details.removeControl('minorGuardianName')
      details.removeControl('minorGuardianRelation')
    }

  
  }

  addNonIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null),
      name2: new FormControl(null),
      name3: new FormControl(null),
      // occupation: new FormControl(''),
      // customerCategory: new FormControl(null),
      // companyEmailId: new FormControl(null),
      // alternateEmailId: new FormControl(null),
      // preferredLanguageCommunication: new FormControl(''),
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

  async onSave() {
    this.isDirty = true
    if (this.basicForm.invalid) {
      console.log('if')
      return
    }
    console.log('basicForm')
    const rawValue = this.basicForm.getRawValue();
    //console.log('FormValue', rawValue)
    if (this.isIndividual) {
      this.storeIndividualValueInService(rawValue);
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
      this.storeNonIndividualValueInService(rawValue);
      this.applicantDataService.setIndividualProspectDetails(null);
    }


    //  if(){

    const applicantData = this.applicantDataService.getApplicant();
    const leadId = (await this.getLeadId()) as number;

    const data = {
      applicantId: this.applicantId,
      ...applicantData,
      leadId,
    };
    console.log('leadId', this.leadStoreService.getLeadId());

    this.applicantService.saveApplicant(data).subscribe((res: any) => {

      if (res.Error === '0') {
        // this.router.navigate([
        //   `/pages/sales-applicant-details/${leadId}/identity-details`,
        //   this.applicantId,
        // ]);
        this.toasterService.showSuccess(
          'Applicant Basic Details Saved Successfully',
          ''
        );
      }
    });
    //  }else{
    //  this.utilityService.validateAllFormFields(this.basicForm)
    //  console.log('utilityservice', this.basicForm.get('details')['controls'])
    //  }
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
    const formValue = value.details[0];
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2;
    applicantDetails.name3 = formValue.name3;
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.title = value.title;
    applicantDetails.entityType = value.entity;
    applicantDetails.customerCategory = formValue.customerCategory || '';
    applicantDetails.custSegment = formValue.custSegment || '';

    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.emailId = formValue.emailId;
    prospectDetails.alternateEmailId = formValue.alternateEmailId;
    prospectDetails.mobilePhone = `91${formValue.mobilePhone}`;
    prospectDetails.dob = this.utilityService.getDateFormat(formValue.dob);
    prospectDetails.minorGuardianName = formValue.minorGuardianName;
    prospectDetails.fatherName = formValue.fatherName;
    prospectDetails.spouseName = formValue.spouseName;
    prospectDetails.motherMaidenName = formValue.motherMaidenName;
    prospectDetails.occupation = formValue.occupation;
    prospectDetails.nationality = formValue.nationality;
    prospectDetails.preferredLanguage = formValue.preferredLanguage;

    prospectDetails.age = Number(this.showAge);
    prospectDetails.gender = formValue.gender || '';
    prospectDetails.minorGuardianRelation = formValue.minorGuardianRelation || '';
    prospectDetails.alternateMobileNumber = formValue.alternateMobileNumber;
    prospectDetails.politicallyExposedPerson = formValue.politicallyExposedPerson;
    prospectDetails.isSeniorCitizen = this.isSeniorCitizen;
    prospectDetails.isMinor = this.isMinor;


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
    applicantDetails.title = formValue.title;
    applicantDetails.entityType = value.entity;

    applicantDetails.customerCategory = formValue.customerCategory;

    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.companyEmailId = formValue.companyEmailId;

    prospectDetails.alternateEmailId = formValue.alternateEmailId;
    // prospectDetails.occupation = formValue.occupation;
    prospectDetails.dateOfIncorporation = this.utilityService.getDateFormat(formValue.dateOfIncorporation);
    prospectDetails.numberOfDirectors = Number(formValue.numberOfDirectors);
    prospectDetails.preferredLanguageCommunication =
      formValue.preferredLanguageCommunication;
    this.applicantDataService.setCorporateProspectDetails(prospectDetails);
  }

  onBack() {
    this.location.back();
  }
}
