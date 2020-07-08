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
import { pairwise, distinctUntilChanged } from 'rxjs/operators';


@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual: boolean;
  isSelfEmployed = true;
  labels: any = {};
  validationData : any
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
  mobilePhone: any;
  

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
    msg : 'Mobile Number Should be 10 Digits' 
  }
  numberOfDirectors2={
    rule : 2
  }
  // namePattern = {
  //   rule: '^[A-Za-z ]{0,99}$',
  //   msg: 'Invalid Name',
  // };
  // nameSpacePattern = {
  //   rule: '^[A-Za-z]{1}[A-Z ]*[a-z ]*$',
  //   msg: 'Invalid Name',
  // };

  //   companyPattern ={
  //    rule : '^[A-Z]*[a-z]*$',
  //    msg: 'Invalid Name',
  //  };

  mobilePattern = {
    rule: '^[6-9][0-9]*$',
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
  isRequiredSpouse ='Spouse Name is Required';
  isRequiredFather = 'Father Name is Required'

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
        this.validationData = data.validationData
        console.log(this.validationData)
      },
      (error) => {
        console.log(error);
      }
    );

    this.basicForm = new FormGroup({
      title: new FormControl(''),
      entity: new FormControl({ value: '' }),
      applicantRelationshipWithLead: new FormControl(''),

      details: new FormArray([]),


    });

   //this.addNonIndividualFormControls();
   


    this.getLovData();
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    details.patchValue({ preferredLanguage: 'ENGPRFLAN' })
    details.patchValue({ preferredLanguageCommunication: 'ENGPRFLAN' })
    
    
    //console.log('fatherNameValue',details.get('fatherName').value);
    if(this.applicant.applicantDetails.entityTypeKey=="INDIVENTTYP"){
      this.basicForm.get('title').setValidators([Validators.required])
      this.eitherFathOrspouse()
      this.eitherFather()
      this.eitherMother()
    }
    
    


    // setTimeout(() => { 
    // this.clearFormArray();
    // });
    //this.setGaurdianFieldMandatory()
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
    // else{
    //   details.get('spouseName').setValidators([Validators.required])
    //   details.get('spouseName').updateValueAndValidity()
    //   this.isRequiredSpouse = 'Spouse name is required';
    //   setTimeout(() => {
    //     details.get('spouseName').setValue(spouseName || null)
    //   });
    // }
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
    // else{
    //   details.get('fatherName').setValidators([Validators.required])
    //   details.get('fatherName').updateValueAndValidity();
    //   this.isRequiredFather = 'Father name is required';
    //   setTimeout(() => {
    //     details.get('fatherName').setValue(fatherName || null)
    //   });
    // }
  }

  

  eitherFathOrspouse(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    let fatherName= details.get('fatherName').value;
    let spouseName= details.get('spouseName').value;
    details.get('fatherName').valueChanges.pipe(distinctUntilChanged()).subscribe((value1)=>{
      //console.log('value', value1)
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
    this.isIndividual = this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP';
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
    if (this.applicant.applicantDetails.entityTypeKey=="INDIVENTTYP" && dob !== null) {
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
    const applicantDetails = this.applicant.applicantDetails;
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
    this.basicForm.patchValue({title : 'M/SSALUTATION'})
    const corporateProspectDetails = this.applicant.corporateProspectDetails
      ? this.applicant.corporateProspectDetails
      : {};
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,
      companyEmailId: corporateProspectDetails.companyEmailId || '',
      alternateEmailId: corporateProspectDetails.alternateEmailId || '',
      numberOfDirectors: corporateProspectDetails.numberOfDirectors || '',
      dateOfIncorporation: this.utilityService.getDateFromString(corporateProspectDetails.dateOfIncorporation) || '',
      contactPerson : corporateProspectDetails.contactPerson || '',
      contactPersonMobile : corporateProspectDetails.contactPersonMobile || '',
      countryOfCorporation : corporateProspectDetails.countryOfCorporation,
      businessType : corporateProspectDetails.businessType ,
      industry : corporateProspectDetails.industry || '',
      alternateContactNumber : corporateProspectDetails.alternateContactNumber || '',
      contactPersonDesignation : corporateProspectDetails.contactPersonDesignation || '',
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
      spouseName: new FormControl('', Validators.required),

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
      name1: new FormControl(null, Validators.required),
      name2: new FormControl(null, Validators.required),
      name3: new FormControl(null, Validators.required),
      dateOfIncorporation: new FormControl(null, Validators.required),
      contactPerson: new FormControl(null, Validators.required),
      contactPersonMobile: new FormControl(null, Validators.required),
      countryOfCorporation: new FormControl(null),
      businessType: new FormControl(''),
      industry: new FormControl(''),
      companyEmailId: new FormControl(null),
      alternateEmailId: new FormControl(null),
      alternateContactNumber: new FormControl(''),
      preferredLanguageCommunication: new FormControl(''),
      contactPersonDesignation: new FormControl('', Validators.required),
      numberOfDirectors: new FormControl(null),
      // directorName: new FormControl(null),
      // directorIdentificationNumber: new FormControl(null),
      // ratingIssuerName: new FormControl(null),
      // externalRatingAssigned: new FormControl(null),
      // externalRatingIssueDate: new FormControl(null),
      // externalRatingExpiryDate: new FormControl(null),
      // foreignCurrencyDealing: new FormControl(null),
      // exposureBankingSystem: new FormControl(null),
      // creditRiskScore: new FormControl(null),
    });
    formArray.push(controls);
  }

  onIndividualChange(event) {
    //console.log('OnIndividdaulevent',event )
    if (!event) {
      return;
    }
    const value = event.key;
    this.isIndividual = value === 'INDIVENTTYP';
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
    this.isIndividual
      ? this.addIndividualFormControls()
      : this.addNonIndividualFormControls();
  }

  async onSave() {
    this.isDirty = true
    console.log('basicForm', this.basicForm.controls)
    if (this.basicForm.invalid) {
      return
    }
    
    const rawValue = this.basicForm.getRawValue();
    console.log('FormValue', rawValue)
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

      if (res.ProcessVariables.error.code === '0') {
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
    applicantDetails.name2 = formValue.name2? formValue.name2 : '';
    applicantDetails.name3 = formValue.name3? formValue.name3 : '';
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.title = value.title;
    applicantDetails.entityType = value.entity;
    applicantDetails.customerCategory = formValue.customerCategory || '';
    applicantDetails.custSegment = formValue.custSegment || '';

    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.emailId = formValue.emailId? formValue.emailId : '';
    prospectDetails.alternateEmailId = formValue.alternateEmailId? formValue.alternateEmailId : '';
    prospectDetails.mobilePhone = formValue.mobilePhone? `91${formValue.mobilePhone}` : '';
    prospectDetails.dob = this.utilityService.getDateFormat(formValue.dob);
    prospectDetails.minorGuardianName = formValue.minorGuardianName? formValue.minorGuardianName: '';
    prospectDetails.fatherName = formValue.fatherName? formValue.fatherName : '';
    prospectDetails.spouseName = formValue.spouseName? formValue.spouseName : '';
    prospectDetails.motherMaidenName = formValue.motherMaidenName;
    prospectDetails.occupation = formValue.occupation;
    prospectDetails.nationality = formValue.nationality;
    prospectDetails.preferredLanguage = formValue.preferredLanguage;

    prospectDetails.age = Number(this.showAge);
    prospectDetails.gender = formValue.gender || '';
    prospectDetails.minorGuardianRelation = formValue.minorGuardianRelation || '';
    prospectDetails.alternateMobileNumber = formValue.alternateMobileNumber? formValue.alternateMobileNumber : '';
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
    applicantDetails.name2 = formValue.name2? formValue.name2 : '';
    applicantDetails.name3 = formValue.name3? formValue.name3 : '';
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.title = formValue.title;
    applicantDetails.entityType = value.entity;

    //applicantDetails.customerCategory = formValue.customerCategory;

    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.dateOfIncorporation = this.utilityService.getDateFormat(formValue.dateOfIncorporation);
    prospectDetails.contactPerson = formValue.contactPerson;
    prospectDetails.contactPersonMobile = formValue.contactPersonMobile;
    prospectDetails.countryOfCorporation = formValue.countryOfCorporation;
    prospectDetails.businessType = formValue.businessType;
    prospectDetails.industry = formValue.industry;
    prospectDetails.companyEmailId = formValue.companyEmailId;
    prospectDetails.alternateEmailId = formValue.alternateEmailId;
    prospectDetails.alternateContactNumber = formValue.alternateContactNumber;
    prospectDetails.preferredLanguageCommunication =
      formValue.preferredLanguageCommunication;
    prospectDetails.contactPersonDesignation = formValue.contactPersonDesignation;
    prospectDetails.numberOfDirectors = Number(formValue.numberOfDirectors);
    
    this.applicantDataService.setCorporateProspectDetails(prospectDetails);
  }

  onBack() {
    this.location.back();
  }
}
