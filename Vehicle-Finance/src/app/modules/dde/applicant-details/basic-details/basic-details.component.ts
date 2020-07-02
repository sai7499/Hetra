import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { Location } from '@angular/common';
import { UtilityService} from '@services/utility.service'
import { ToasterService} from '@services/toaster.service';
import { distinctUntilChanged } from 'rxjs/operators';

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
  leadId :  number;
  showAge : any;
  initialAge : any;
  isSeniorCitizen: any = "0"
  isMinor: any = "0"
  gaurdianNamemandatory: any = {};
  checkingMinor: boolean;
  checkingSenior: boolean;
  mobilePhone : string
  isDirty : boolean;
  public toDayDate: Date = new Date();
  isRequiredSpouse ='Spouse Name is Required';
  isRequiredFather = 'Father Name is Required'

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
  nameLength30={
    rule: 30,
  }
  length2 ={
    rule : 2
  }
  
  length20 ={
    rule : 20
  }
  mobileLenght10={
    rule: 10,
    msg : 'Mobile Number Should be 10 Digits'
  }
  namePattern = {
    rule: '^[A-Z]*[a-z]*$',
    msg: 'Invalid Name',
  };
  nameSpacePattern = {
    rule: '^[A-Za-z]{1}[A-Z ]*[a-z ]*$',
    msg: 'Invalid Name',
  };
//   companyPattern ={
//    rule : '^[A-Z]*[a-z]*$',
//    msg: 'Invalid Name',
//  };
  numberPattern={
    rule : '^[0-9]',
    msg : 'Invalid'
  }
  mobilePattern={
    rule: '^[6-9][0-9]*$',
    msg: 'Invalid Mobile Number',
  }
  emailPattern={
    rule : '^\\w+([\.-]?\\w+)@\\w+([\.-]?\\w+)(\\.\\w{2,10})+$',
    msg : 'Invalid email'
  }
  landlinePattern={
    rule : '^[0-9]{6,15}',
    msg : "Invalid Number"
  }
  landlineLength15={
    rule: 15,
    msg : 'Should be Valid'
  }

  
  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private location: Location,
    private utilityService : UtilityService,
    private toasterService : ToasterService
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
      entity: new FormControl({value :'', disabled : true}),
      applicantRelationshipWithLead: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      details: new FormArray([]),
    });
    this.addNonIndividualFormControls();
    this.getLOV();
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    details.patchValue({ preferredLanguage: 'ENGPRFLAN' })
    
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.applicantDataService.setApplicantId(this.applicantId);
    });
    this.leadId = (await this.getLeadId()) as number;
    console.log('leadId', this.leadId);
    this.eitherFather()
    this.eitherMother()
    this.eitherFathOrspouse()
  }
  eitherFather(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    const fatherName= details.get('fatherName').value;
    const spouseName= details.get('spouseName').value;
    if(fatherName ){
        
      details.get('spouseName').clearValidators()
      details.get('spouseName').updateValueAndValidity()
      this.isRequiredSpouse = '';
      // const spouseName= details.get('spouseName').value || null;
      setTimeout(() => {
        details.get('spouseName').setValue(spouseName || null)
      });
      
     
    }
  }

  eitherMother(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    const fatherName= details.get('fatherName').value;
    const spouseName= details.get('spouseName').value;
    if(spouseName){
      details.get('fatherName').clearValidators()
      details.get('fatherName').updateValueAndValidity()
     this.isRequiredFather = '';
     //const fatherName= details.get('fatherName').value || null;
      setTimeout(() => {
        details.get('fatherName').setValue(fatherName || null)
      });
     
     
    }
  
  }

  eitherFathOrspouse(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    let fatherName= details.get('fatherName').value;
    let spouseName= details.get('spouseName').value;
    details.get('fatherName').valueChanges.pipe(distinctUntilChanged()).subscribe((value1)=>{
      console.log('value', value1)
      if(fatherName==value1){
        return
      }
      fatherName= value1
      if(value1 ){
        
        details.get('spouseName').clearValidators()
        details.get('spouseName').updateValueAndValidity()
        this.isRequiredSpouse = '';
        // const spouseName= details.get('spouseName').value || null;
        setTimeout(() => {
          details.get('spouseName').setValue(spouseName || null)
        });
        
       
      }else{
        details.get('spouseName').setValidators([Validators.required])
        details.get('spouseName').updateValueAndValidity()
        this.isRequiredSpouse = 'Spouse name is required';
        //const spouseName= details.get('spouseName').value || null;
        setTimeout(() => {
          details.get('spouseName').setValue(spouseName || null)
        });
      }
    })
    
    details.get('spouseName').valueChanges.subscribe((value)=>{
      if(spouseName==value){
        return
      }
      spouseName= value
      if(value){
        details.get('fatherName').clearValidators()
        details.get('fatherName').updateValueAndValidity()
       this.isRequiredFather = '';
       //const fatherName= details.get('fatherName').value || null;
        setTimeout(() => {
          details.get('fatherName').setValue(fatherName || null)
        });
       
       
      }else{
        details.get('fatherName').setValidators([Validators.required])
        details.get('fatherName').updateValueAndValidity();
        this.isRequiredFather = 'Father name is required';
        setTimeout(() => {
          details.get('fatherName').setValue(fatherName || null)
        });
      }
    })

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
 
  // onCheckSenior(event){
  //   if(event.target.checked && (this.showAge < 70 || this.initialageCal< 70)){
  //     event.target.checked= false;
  //    }
  //   else{event.target.checked = true;}
  // }

  setBasicData() {
    this.isIndividual = this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP';
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      applicantRelationshipWithLead:
        this.applicant.applicantDetails.applicantTypeKey || '',
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


      customerCategory: applicantDetails.customerCategory || ' ',
      custSegment: applicantDetails.custSegment || ' ',
    });
  }

  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
      ? this.applicant.aboutIndivProspectDetails
      : {};
      //console.log('aboutIndivProspectDetails', aboutIndivProspectDetails)
      this.showAge = aboutIndivProspectDetails.age;
      const mobile = aboutIndivProspectDetails.mobilePhone;
      if (mobile && mobile.length == 12) {
        this.mobilePhone = mobile.slice(2, 12);
      }
      else if (mobile && mobile.length == 10) {
        this.mobilePhone = mobile
      }
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const applicantDetails = this.applicant.applicantDetails;
    details.patchValue({
      emailId: aboutIndivProspectDetails.emailId || '',
      alternateEmailId: aboutIndivProspectDetails.alternateEmailId || '',
      mobilePhone: this.mobilePhone || '',
      dob: this.utilityService.getDateFromString(aboutIndivProspectDetails.dob) || '',
      minorGuardianName: aboutIndivProspectDetails.minorGuardianName || '',
      fatherName: aboutIndivProspectDetails.fatherName || '',
      spouseName: aboutIndivProspectDetails.spouseName || '',
      motherMaidenName: aboutIndivProspectDetails.motherMaidenName || '',
      preferredLanguage: aboutIndivProspectDetails.preferredLanguage || '',
      occupation: aboutIndivProspectDetails.occupation || '',
      nationality: aboutIndivProspectDetails.nationality || '',
      age: this.showAge,
      gender: aboutIndivProspectDetails.gender || '',
      politicallyExposedPerson: aboutIndivProspectDetails.politicallyExposedPerson || '',
      alternateMobileNumber: aboutIndivProspectDetails.alternateMobileNumber || '',
      minorGuardianRelation: aboutIndivProspectDetails.minorGuardianRelation || '',
      employeeCode: aboutIndivProspectDetails.employeeCode || '',
      employerType: aboutIndivProspectDetails.employerType || '',
      // isSeniorCitizen: aboutIndivProspectDetails.isSeniorCitizen || '',
      // minorGuardianUcic: aboutIndivProspectDetails.minorGuardianUcic || '',
      designation: aboutIndivProspectDetails.designation || '',

      currentEmpYears: aboutIndivProspectDetails.currentEmpYears || '',
      department: aboutIndivProspectDetails.department || '',
      employerName : aboutIndivProspectDetails.employerName || ''
      
      

      //employerType : aboutIndivProspectDetails.employerType,
    });
  }

  setValuesForNonIndividual() {
    const applicantDetails = this.applicant.applicantDetails;
    const corporateProspectDetails = this.applicant.corporateProspectDetails;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
     
      companyPhoneNumber: corporateProspectDetails.companyPhoneNumber || '',
      companyEmailId: corporateProspectDetails.companyEmailId || '',
      alternateEmailId: corporateProspectDetails.alternateEmailId || '',
      numberOfDirectors: corporateProspectDetails.numberOfDirectors || '',
      dateOfIncorporation: corporateProspectDetails.dateOfIncorporation || '',
      preferredLanguageCommunication:
        corporateProspectDetails.preferredLanguageCommunication || '',
      customerCategory: applicantDetails.customerCategory || '',
      directorName: corporateProspectDetails.directorName || '',
      directorIdentificationNumber:
        corporateProspectDetails.directorIdentificationNumber || '',
      contactPerson: corporateProspectDetails.contactPerson || '',
      contactPersonDesignation:
        corporateProspectDetails.contactPersonDesignation || '',
      contactPersonMobile: corporateProspectDetails.contactPersonMobile || '',
      ratingIssuerName: corporateProspectDetails.ratingIssuerName || '',
      externalRatingAssigned: corporateProspectDetails.externalRatingAssigned || '',
      externalRatingIssueDate: corporateProspectDetails.externalRatingIssueDate || '',
      externalRatingExpiryDate:
        corporateProspectDetails.externalRatingExpiryDate || '',
      foreignCurrencyDealing: corporateProspectDetails.foreignCurrencyDealing || '',
      exposureBankingSystem: corporateProspectDetails.exposureBankingSystem || '',
      creditRiskScore: corporateProspectDetails.creditRiskScore || '',
    });
  }

  addIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null, Validators.required),
      name2: new FormControl(null),
      name3: new FormControl(null),
      mobilePhone: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      age: new FormControl(''),
      gender: new FormControl('', Validators.required),
      isSeniorCitizen: new FormControl(''),
      isMinor: new FormControl(''),

      applicantType: new FormControl(null),

      minorGuardianName: new FormControl('', Validators.required),
      minorGuardianRelation: new FormControl('', Validators.required),

      fatherName: new FormControl('', Validators.required),
      spouseName: new FormControl('', Validators.required),
      motherMaidenName: new FormControl(null, Validators.required),
      occupation: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      customerCategory: new FormControl('', Validators.required),
      custSegment: new FormControl('', Validators.required),
      emailId: new FormControl(''),
      alternateEmailId: new FormControl(''),
      alternateMobileNumber: new FormControl(''),
      preferredLanguage: new FormControl('', Validators.required),
      politicallyExposedPerson: new FormControl(null),
      // accountNumber: new FormControl(null),
      // accountBank: new FormControl(''),
      // branchAddress: new FormControl(null),
      // spokeAddress: new FormControl(null),
      designation: new FormControl(''),
      employerName: new FormControl(null, Validators.required),
      currentEmpYears: new FormControl(null, Validators.required),
      employeeCode: new FormControl(null, Validators.required),
      employerType: new FormControl('', Validators.required),
      // department: new FormControl(''),
      // businessType: new FormControl(''),
      // businessName: new FormControl(null),
      // businessStartDate: new FormControl(null),
      // currentBusinessYear: new FormControl(null),
      // turnOver: new FormControl(null),
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
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      //console.log('lovs', this.LOV)

      this.applicant = this.applicantDataService.getApplicant();
      console.log('DDE COMING APPLICANT DATAS ', this.applicant);
      
      this.setBasicData();
    });
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
    this.isDirty= true
    if ( this.basicForm.invalid){
      return
    }
    const value = this.basicForm.getRawValue();
    console.log('GETRAWVALUE', value);
    if (this.isIndividual) {
      this.storeIndividualValueInService(value);
    } else {
      this.storeNonIndividualValueInService(value);
    }

    const applicantData = this.applicantDataService.getApplicant();
    console.log('applicantData',applicantData)
    const leadId = (await this.getLeadId()) as number;
    console.log('LEADID', leadId);
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
      leadId: this.leadId,
    };

    this.applicantService.saveApplicant(data).subscribe((response: any) => {
      if (response.ProcessVariables.error.code === '0') {
        //console.log('RESPONSE', response);
        // this.router.navigate([
        //   `/pages/applicant-details/${this.leadId}/identity-details`,
        //   this.applicantId,
        // ]);
        this.toasterService.showSuccess(
          'Applicant Basic Details Saved Successfully',
          ''
        );
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
    console.log('formValue',formValue)
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2? formValue.name2: '';
    applicantDetails.name3 = formValue.name3? formValue.name3: '';
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.entityType = value.entity;
    applicantDetails.title = value.title;
    applicantDetails.customerCategory = formValue.customerCategory;
    applicantDetails.custSegment = formValue.custSegment || '';
    this.applicantDataService.setApplicantDetails(applicantDetails);

    const aboutIndivProspectDetails = formValue;
    prospectDetails.dob = this.utilityService.getDateFormat(formValue.dob);
    prospectDetails.mobilePhone = aboutIndivProspectDetails.mobilePhone? `91${aboutIndivProspectDetails.mobilePhone}`: '';
    prospectDetails.isSeniorCitizen = this.isSeniorCitizen;
    prospectDetails.isMinor = this.isMinor;
    prospectDetails.minorGuardianName =
      aboutIndivProspectDetails.minorGuardianName? aboutIndivProspectDetails.minorGuardianName: '';
    // prospectDetails.minorGuardianUcic = Number(
    //   aboutIndivProspectDetails.minorGuardianUcic
    // );
    prospectDetails.age = Number(this.showAge);
    prospectDetails.gender = formValue.gender || '';
    prospectDetails.minorGuardianRelation = formValue.minorGuardianRelation || '';
    prospectDetails.alternateMobileNumber = formValue.alternateMobileNumber?formValue.alternateMobileNumber : '';
    prospectDetails.politicallyExposedPerson = formValue.politicallyExposedPerson;
    prospectDetails.spouseName = aboutIndivProspectDetails.spouseName? aboutIndivProspectDetails.spouseName: '';
    prospectDetails.fatherName = aboutIndivProspectDetails.fatherName? aboutIndivProspectDetails.fatherName: '';
    prospectDetails.motherMaidenName =
      aboutIndivProspectDetails.motherMaidenName;
    prospectDetails.nationality = aboutIndivProspectDetails.nationality;
    prospectDetails.occupation = aboutIndivProspectDetails.occupation;
    prospectDetails.emailId = aboutIndivProspectDetails.emailId? aboutIndivProspectDetails.emailId: '';
    prospectDetails.alternateEmailId =
      aboutIndivProspectDetails.alternateEmailId? aboutIndivProspectDetails.spouseName: '';
    prospectDetails.preferredLanguage =
      aboutIndivProspectDetails.preferredLanguage;
    prospectDetails.designation = aboutIndivProspectDetails.designation;
    prospectDetails.currentEmpYears = aboutIndivProspectDetails.currentEmpYears? aboutIndivProspectDetails.currentEmpYears: '';
    prospectDetails.employeeCode = aboutIndivProspectDetails.employeeCode? aboutIndivProspectDetails.employeeCode: '';
   
    
    // prospectDetails.department = 'department';
    

    this.applicantDataService.setIndividualProspectDetails(prospectDetails);

    // this.applicantDataService.setIndividualProspectDetails(
    //   ProspectProfileDetails
    // );

    indivProspectProfileDetails.employerType = formValue.employerType? formValue.employerType: '';
    indivProspectProfileDetails.employerName = formValue.employerName? formValue.employerName: '';
    //console.log('indivProspectProfileDetails',indivProspectProfileDetails)
    this.applicantDataService.setindivProspectProfileDetails(
      indivProspectProfileDetails
    );
  }

  storeNonIndividualValueInService(value) {
    const prospectDetails: CorporateProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};

    const formValue = value.details[0];

    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2?formValue.name2 : '';
    applicantDetails.name3 = formValue.name3?formValue.name3 : '';
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
    this.utilityService.getDateFormat(corporateProspectDetails.externalRatingExpiryDate);
    // prospectDetails.externalRatingIssueDate = '22-Mar-2020';
    prospectDetails.externalRatingIssueDate =
    this.utilityService.getDateFormat(corporateProspectDetails.externalRatingIssueDate);
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
  onBack() {
    this.location.back();
  }

  onNext(){
    this.router.navigate([
      `/pages/applicant-details/${this.leadId}/identity-details`,
      this.applicantId,
    ]);
  }

 
onBackToApplicant(){
  this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`)
}

}
