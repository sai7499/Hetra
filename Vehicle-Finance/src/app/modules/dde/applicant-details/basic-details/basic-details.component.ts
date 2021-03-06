import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { LabelsService } from '@services/labels.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { Location } from '@angular/common';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service';
import { distinctUntilChanged } from 'rxjs/operators';

import {
  Applicant,
  ApplicantDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
  IndivProspectProfileDetails,
  DirectorDetails
} from '@model/applicant.model';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { AgeValidationService } from '@services/age-validation.service';
import { ObjectComparisonService } from '@services/obj-compare.service';

import { LoanViewService } from '@services/loan-view.service';

@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  disableSaveBtn: boolean;
  basicForm: FormGroup;
  isIndividual = false;
  //isSelfEmployed = true;
  labels: any = {};
  validationData: any;
  LOV: any = [];
  applicantId: number;
  applicant: Applicant;
  leadId: number;
  showAge: any;
  isSeniorCitizen: any = '0';
  isMinor: any = '0';
  gaurdianNamemandatory: any = {};
  checkingMinor: boolean;
  checkingSenior: boolean;
  mobilePhone: string;
  isDirty: boolean;
  public toDayDate: Date = new Date();
  setBirthDate: Date = new Date();
  ageMinDate: Date = new Date();
  businessDate: Date = new Date();
  isRequiredSpouse = 'Spouse Name is Required';
  isRequiredFather = 'Father Name is Required';
  validation: any;
  countryList = [];
  directorObject: any = [];
  directorCount = 1;
  productCategory: string;
  fundingProgram: string;
  isChecked: boolean;
  ownerPropertyRelation: any;
  selfEmpBusType: any = [];
  checkedBoxHouse: boolean;
  custCatValue: string;
  occupationValue: string;
  ageOfSeniorCitizen : any;
  isMarried: boolean;
  applicantData = [];
  showNotApplicant: boolean;
  externalExpiryDate: any;
  externalIssueDate: any;
  showEmployeeNo: boolean = false;
  checkedEquitasEmployee: string = '0';
  checkedRelativeEquitas: string = '0';
  showMsg = {
    issueDate: false,
    expiryDate: false
  }

  emailPattern = {
    rule: '^\\w+([.-]?\\w+)@\\w+([.-]?\\w+)(\\.\\w{2,10})+$',
    msg: 'Invalid email',
  };

  minorityData: {
    key: string,
    value: string
  }[]
  hideMsgForOwner: boolean = false;

  monthValidation: {
    rule?: any;
    msg?: string;
  }[];

  yearValidation: {
    rule?: any;
    msg?: string;
  }[];

  public showSalaried: boolean;
  public showSelfEmp: boolean;
  public maxAge: Date = new Date();
  public minAge: Date = new Date();
  isSave: boolean = false;
  apiValue: any;
  finalValue: any;
  isExpiryDate: boolean = false;
  maxExtrIssue = new Date()
  isLoan360: boolean;
  occupation: any[];
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId= '';
  udfGroupId= 'APG008';
  selfMaxAge: any;
  salariedMaxAge: any;
  initUDFValues: any;
  editedUDFValues: any;
  relationShipLov: any[];
  isAppNonInd: boolean;
  islastNameReq: boolean = true;

  constructor(
    private labelsData: LabelsService,
    private commomLovService: CommomLovService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private location: Location,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private createLeadDataService: CreateLeadDataService,
    private toggleDdeService: ToggleDdeService,
    private ageValidationService: AgeValidationService,
    private objectComparisonService: ObjectComparisonService,
    private loanViewService: LoanViewService
  ) {
    this.toDayDate = this.utilityService.setTimeForDates(this.toDayDate)

    this.maxExtrIssue.setDate(this.maxExtrIssue.getDate() - 1)
    this.maxExtrIssue = this.utilityService.setTimeForDates(this.maxExtrIssue)

  }
  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getLeadSectiondata();  // function call to get the required funding program and product category

    this.setMinorityData();
    this.basicForm = new FormGroup({
      entity: new FormControl({ value: '', disabled: true }),
      bussinessEntityType: new FormControl('', Validators.required),
      applicantRelationshipWithLead: new FormControl('', Validators.required),
      applicantRelationship: new FormControl('', Validators.required),
      title: new FormControl(''),
      details: new FormArray([]),
      directors: new FormArray([this.getDirectorsControls()]),
    });
    this.getAgeValidation();
    // this.setBirthDate.setFullYear(this.setBirthDate.getFullYear() - 10)
    // this.ageMinDate.setFullYear(this.ageMinDate.getFullYear() - 100)
    this.businessDate.setDate(this.businessDate.getDate() - 1)

    this.getLOV();
    this.getCountryList();

    const formArray = this.basicForm.get('details') as FormArray;
    this.validation = formArray.at(0);

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.applicantDataService.setApplicantId(this.applicantId);
    });
    this.leadId = (await this.getLeadId()) as number;
    const operationType = this.toggleDdeService.getOperationType();
    if (operationType) {
      this.basicForm.disable();
      this.disableSaveBtn = true;
    }

    this.monthValidation = this.monthValiationCheck();
    //this.isSave=this.applicantDataService.getForSaveBasicDetails()
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.DDE.applicantBasicdataDDE ;

    })
  }

  setMinorityData() {
    this.minorityData = [{
      key: '1',
      value: 'Yes'
    },
    {
      key: '0',
      value: 'No'
    }]
  }

  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.productCategory = leadData['leadDetails'].productId;
    this.fundingProgram = leadData['leadDetails'].fundingProgram;

    this.applicantData = leadData['applicantDetails'];

  }

  getAgeValidation() {
    this.ageValidationService.getAgeValidationData().subscribe(
      data => {
        const minAge = data.ages.applicant.minAge;
        const maxAge = data.ages.applicant.maxAge;
        this.maxAge = new Date();
        this.minAge = new Date();
        this.minAge.setFullYear(this.minAge.getFullYear() - minAge);
        this.maxAge.setFullYear(this.maxAge.getFullYear() - maxAge);
        this.minAge = this.utilityService.setTimeForDates(this.minAge)
        this.maxAge = this.utilityService.setTimeForDates(this.maxAge)
        this.salariedMaxAge = data.ages.seniorCitizen.salaried
        this.selfMaxAge = data.ages.seniorCitizen.selfEmployment;
        console.log(this.salariedMaxAge,'AGES',this.selfMaxAge)
        this.ageOfSeniorCitizen= this.selfMaxAge;
      }
    );
  }

  monthValiationCheck() {
    const monthData = [
      {
        rule: (month) => {
          return month < 0;
        },
        msg: 'Month should be greater than or equal to 0',
      },
      {
        rule: (month) => {
          return month > 11;
        },
        msg: 'Month should be less than or equal to 11',
      },
    ];
    return monthData;
  }

  selectApplicantType(event) {
    const value = event.target.value;
    this.showNotApplicant = false;


    this.applicantData.forEach((data) => {
      if (data.applicantId !== this.applicantId) {
        if (data.applicantTypeKey == "APPAPPRELLEAD" && data.applicantTypeKey === value) {
          this.toasterService.showError('There should be only one main applicant for this lead', '')
          this.showNotApplicant = true;
        }
        //  else if (data.applicantTypeKey !== "APPAPPRELLEAD") {
        //   this.toasterService.showInfo('Should One Applicant Is Required', '')
        // } 
      }

    })
    this.getRelationShip(value)
  }

  getRelationShip(value){
    if(!this.isIndividual){
      return;
    }
    if(!this.isAppNonInd){
      this.relationShipLov = this.LOV.LOVS.relationship;
      if(value==='APPAPPRELLEAD'){
        this.relationShipLov=  this.relationShipLov.filter((data)=>data.key === '5RELATION')  
        this.basicForm.get('applicantRelationship').setValue(this.relationShipLov[0].key) 
       }else{
         this.relationShipLov=  this.relationShipLov.filter((data)=>data.key !== '5RELATION') 
         this.basicForm.get('applicantRelationship').setValue('')  
       }
  
    }
    
  }

  calculateIncome(value) {
    const annualIncome = 12 * value;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      annualIncomeAmount: annualIncome
    })

  }



  onOwnHouseAvailable(event) {
    this.isChecked = event.target.checked;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    if (this.isChecked === true) {
      this.hideMsgForOwner = true;
      details.get('houseOwnerProperty').setValidators([Validators.required]);
      details.get('ownHouseAppRelationship').setValidators([Validators.required]);
      details.get('houseOwnerProperty').updateValueAndValidity();
      details.get('ownHouseAppRelationship').updateValueAndValidity();
      const houseOwner = details.get('houseOwnerProperty').value;
      const ownHouseAppRelationship = details.get('ownHouseAppRelationship').value
      details.patchValue({
        houseOwnerProperty: houseOwner,
        ownHouseAppRelationship: ownHouseAppRelationship
      });
      this.enableOwnerProperty(details)

    } else {
      this.hideMsgForOwner = false;
      details.get('houseOwnerProperty').clearValidators();
      details.get('ownHouseAppRelationship').clearValidators();
      details.get('houseOwnerProperty').updateValueAndValidity();
      details.get('ownHouseAppRelationship').updateValueAndValidity();
      details.patchValue({
        houseOwnerProperty: '',
        ownHouseAppRelationship: ''
      })
      this.disableOwnerProperty(details)
    }
  }
  enableOwnerProperty(details){
    details.get('houseOwnerProperty').enable();
    details.get('ownHouseAppRelationship').enable();
  }

  disableOwnerProperty(details){
    details.get('houseOwnerProperty').disable();
    details.get('ownHouseAppRelationship').disable();

  }



  getCountryList() {
    this.applicantService.getCountryList().subscribe((res: any) => {
      const response = res;
      const responseError = response.Error;
      if (responseError == '0') {
        const list = response.ProcessVariables.countries;
        if (list) {
          list.map((element) => {
            const datas = {
              key: element.countryCode,
              value: element.countryName,
            };
            this.countryList.push(datas);
          });
        }
      }
    });
  }


  clearFatherOrSpouseValidation() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const fatherName = details.get('fatherName').value;
    const spouseName = details.get('spouseName').value;
    if (spouseName) {
      details.get('fatherName').clearValidators();
      details.get('fatherName').updateValueAndValidity();
      this.isRequiredFather = '';
      // const fatherName= details.get('fatherName').value || null;
      setTimeout(() => {
        details.get('fatherName').setValue(fatherName || null);
      });
    }
    if (fatherName) {
      details.get('spouseName').clearValidators();
      details.get('spouseName').updateValueAndValidity();
      this.isRequiredSpouse = '';
      // const spouseName= details.get('spouseName').value || null;
      setTimeout(() => {
        details.get('spouseName').setValue(spouseName || null);
      });
    }
  }

  eitherFathOrspouse() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    let fatherName = details.get('fatherName').value;
    let spouseName = details.get('spouseName').value;
    details
      .get('fatherName')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((value1) => {
        if (fatherName === value1) {
          return;
        }
        fatherName = value1;
        if (value1) {
          details.get('spouseName').clearValidators();
          details.get('spouseName').updateValueAndValidity();
          this.isRequiredSpouse = '';
          // const spouseName= details.get('spouseName').value || null;
          setTimeout(() => {
            details.get('spouseName').setValue(spouseName || null);
          });
        } else {
          details.get('spouseName').setValidators([Validators.required]);
          details.get('spouseName').updateValueAndValidity();
          this.isRequiredSpouse = 'Spouse name is Required';
          // const spouseName= details.get('spouseName').value || null;
          setTimeout(() => {
            details.get('spouseName').setValue(spouseName || null);
          });
        }
      });

    details.get('spouseName').valueChanges.subscribe((value) => {
      if (spouseName === value) {
        return;
      }
      spouseName = value;
      if (value) {
        details.get('fatherName').clearValidators();
        details.get('fatherName').updateValueAndValidity();
        this.isRequiredFather = '';
        // const fatherName= details.get('fatherName').value || null;
        setTimeout(() => {
          details.get('fatherName').setValue(fatherName || null);
        });
      } else {
        details.get('fatherName').setValidators([Validators.required]);
        details.get('fatherName').updateValueAndValidity();
        this.isRequiredFather = 'Father Name is Required';
        setTimeout(() => {
          details.get('fatherName').setValue(fatherName || null);
        });
      }
    });
  }

  initiallayAgecal(dob) {
    const convertDate = new Date(this.utilityService.getDateFromString(dob));
    this.setDateAndAge(convertDate)

  }
  ageCalculation(event) {
    const value = event;
    const convertDate = new Date(this.utilityService.getNewDateFormat(value));
    this.setDateAndAge(convertDate)
  }

  setDateAndAge(value) {
    const convertAge = new Date(value);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('age').setValue(this.showAge)

    this.checkingMinor = this.showAge < 18;
    details.get('isMinor').setValue(this.checkingMinor);

    this.checkingSenior = this.showAge >= this.ageOfSeniorCitizen;
    details.get('isSeniorCitizen').setValue(this.checkingSenior);

    this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0';
    this.isMinor = this.checkingMinor == true ? '1' : '0';

    this.setGaurdianFieldMandatory();
  }
  checkSenior(event) {
    if (event.target.checked && (this.showAge <= this.ageOfSeniorCitizen)) {
      event.target.checked = false;
    } else {
      event.target.checked = true;
    }
    if (event.target.checked == true) {
    }
  }

  checkMinor(event) {
    if (event.target.checked && (this.showAge > 18)) {
      event.target.checked = false;
    } else {
      event.target.checked = true;
    }

  }

  setGaurdianFieldMandatory() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0) as FormGroup;
    if (details.get('isMinor').value) {
      details.addControl('minorGuardianName', new FormControl());
      details.addControl('minorGuardianRelation', new FormControl());
    } else {
      details.removeControl('minorGuardianName');
      details.removeControl('minorGuardianRelation');
    }
  }



  setBasicData() {
    this.isIndividual = this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP';
    const dob = this.applicant.aboutIndivProspectDetails.dob;
    const applicantType = this.applicant.applicantDetails.applicantTypeKey
    this.getRelationShip(applicantType)
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      bussinessEntityType: this.applicant.applicantDetails.bussinessEntityType,
      applicantRelationshipWithLead:
        this.applicant.applicantDetails.applicantTypeKey || '',
      title: this.applicant.applicantDetails.title || '',
      // applicantRelationship: this.applicant.aboutIndivProspectDetails.relationWithApplicant || ''
    });
    
    const relationshipVal = this.applicant.aboutIndivProspectDetails.relationWithApplicant;
    const relValue = this.relationShipLov.find((data : any)=>{
      return data.key ===  relationshipVal;
    })
    const appRelationship = this.basicForm.get('applicantRelationship')
    if(this.applicant.aboutIndivProspectDetails.relationWithApplicant){
      appRelationship.setValue(relValue ? relationshipVal : '')
    }else{
      if(!this.isAppNonInd && applicantType === 'APPAPPRELLEAD'){
        appRelationship.setValue(this.relationShipLov[0].key)
      }
    }
    const applicantDetails = this.applicant.applicantDetails;

    this.custCatValue = applicantDetails.custSegment;
    //this.ageOfSeniorCitizen = this.custCatValue !== "SEMCUSTSEG" ? 60 : 65;
    if (this.isIndividual) {
      this.clearFormArray();
      this.addIndividualFormControls();
      this.onCustCategoryChanged(this.custCatValue)
      this.setValuesForIndividual();
      this.initiallayAgecal(dob);
      if(this.applicant.aboutIndivProspectDetails && this.applicant.aboutIndivProspectDetails.maritalStatus){
        this.setMaritalStatusValue(this.applicant.aboutIndivProspectDetails.maritalStatus);
      }
    } else {
      this.addNonIndividualFormControls();
      this.removeApplicantRelationControl();
      this.setValuesForNonIndividual();

      // setTimeout(() => {
      //   this.listerForDirectors();
      // });

    }

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    if (applicantDetails.ownHouseProofAvail == '1') {
      this.checkedBoxHouse = true;
      this.isChecked = true;
      this.hideMsgForOwner = true;
      this.enableOwnerProperty(details)
    } else {
      this.checkedBoxHouse = false;
      this.isChecked = false;
      this.hideMsgForOwner = false;
      this.disableOwnerProperty(details)
    }
    // this.checkedBoxHouse = applicantDetails.ownHouseProofAvail == '1' ? true : false;
    // this.isChecked= applicantDetails.ownHouseProofAvail == '1' ? true : false;





    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,
      monthlyIncomeAmount: applicantDetails.monthlyIncomeAmount,
      annualIncomeAmount: applicantDetails.annualIncomeAmount,
      //ownHouseProofAvail: applicantDetails.ownHouseProofAvail,
      houseOwnerProperty: applicantDetails.houseOwnerProperty || '',
      ownHouseAppRelationship: applicantDetails.ownHouseAppRelationship || '',
      averageBankBalance: applicantDetails.averageBankBalance,
      rtrType: applicantDetails.rtrType || '',
      prevLoanAmount: applicantDetails.prevLoanAmount,
      loanTenorServiced: applicantDetails.loanTenorServiced,
      currentEMILoan: applicantDetails.currentEMILoan,
      agriNoOfAcres: applicantDetails.agriNoOfAcres,
      agriOwnerProperty: applicantDetails.agriOwnerProperty || '',
      agriAppRelationship: applicantDetails.agriAppRelationship || '',
      grossReceipt: applicantDetails.grossReceipt,
      //customerCategory: applicantDetails.customerCategory || ' ',
      custSegment: applicantDetails.custSegment || '',
    });
    this.apiValue = this.basicForm.getRawValue();
    if (this.isIndividual) {
      const dob = this.basicForm.getRawValue().details[0].dob
      this.apiValue.details[0].dob = this.utilityService.getDateFormat(dob)
    } else {
      const doc = this.basicForm.getRawValue().details[0].dateOfIncorporation;
      const externalRatingIssueDate = this.basicForm.getRawValue().details[0].externalRatingIssueDate;
      const externalRatingExpiryDate = this.basicForm.getRawValue().details[0].externalRatingExpiryDate;
      this.apiValue.details[0].dateOfIncorporation = this.utilityService.getDateFormat(doc)
      this.apiValue.details[0].externalRatingIssueDate = this.utilityService.getDateFormat(externalRatingIssueDate)
      this.apiValue.details[0].externalRatingExpiryDate = this.utilityService.getDateFormat(externalRatingExpiryDate)
    }

    if (this.loanViewService.checkIsLoan360()) {
      this.basicForm.disable();
      this.disableSaveBtn = true;
    }
  }

  removeApplicantRelationControl() {
    this.basicForm.removeControl('applicantRelationship');
  }

  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
      ? this.applicant.aboutIndivProspectDetails
      : {};
    const indivProspectProfileDetails = this.applicant.indivProspectProfileDetails
    this.basicForm.get('title').setValidators([Validators.required]);
    this.basicForm.get('bussinessEntityType').clearValidators();
    this.basicForm.updateValueAndValidity();
    //this.showAge = aboutIndivProspectDetails.age;
    const mobile = aboutIndivProspectDetails.mobilePhone;
    if (mobile && mobile.length === 12) {
      this.mobilePhone = mobile.slice(2, 12);
    } else if (mobile && mobile.length === 10) {
      this.mobilePhone = mobile;
    }
    const applicantDetails = this.applicant.applicantDetails
    //this.occupationValue = aboutIndivProspectDetails.occupation
    this.custCatValue = applicantDetails.custSegment;
    if (this.custCatValue === "SEMCUSTSEG") {
      // this.removeEmployeeValidators()
      this.setSelfEmpValidators()
    }
    else if (this.custCatValue == 'SALCUSTSEG') {
      this.setSalriedValidators()
    }

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    this.checkedEquitasEmployee = aboutIndivProspectDetails.isEquitasEmployee;
    this.checkedRelativeEquitas = aboutIndivProspectDetails.isEquitasEmployeeRelative;
    this.checkedRelativeEquitas == '1' ? details.get('isEquitasEmployee').disable() : details.get('isEquitasEmployee').enable()
    if (this.checkedEquitasEmployee == '1') {
      this.setEmployeeNoValidation(details)
      this.showEmployeeNo = true;
    } else {
      this.removeEmployeeNoValidation(details)
      this.showEmployeeNo = false;
    }

    let noofmonths = '';
    let noofyears = ''
    if (aboutIndivProspectDetails.yearsInCurrentResidence) {

      noofmonths = String(Number(aboutIndivProspectDetails.yearsInCurrentResidence) % 12) || '';
      noofyears = String(Math.floor(Number(aboutIndivProspectDetails.yearsInCurrentResidence) / 12)) || '';
    }

    let noofmonthsInBusiness = '';
    let noofyearsInBusiness = ''

    if (aboutIndivProspectDetails.currentBusinessYears) {

      noofmonthsInBusiness = String(Number(aboutIndivProspectDetails.currentBusinessYears) % 12) || '';
      noofyearsInBusiness = String(Math.floor(Number(aboutIndivProspectDetails.currentBusinessYears) / 12)) || '';
    }

    let noofmonthsInCurrEmp = '';
    let noofyearsInCurrEmp = ''

    if (aboutIndivProspectDetails.currentEmpYears) {

      noofmonthsInCurrEmp = String(Number(aboutIndivProspectDetails.currentEmpYears) % 12) || '';
      noofyearsInCurrEmp = String(Math.floor(Number(aboutIndivProspectDetails.currentEmpYears) / 12)) || '';
    }



    details.patchValue({
      emailId: aboutIndivProspectDetails.emailId || '',
      alternateEmailId: aboutIndivProspectDetails.alternateEmailId || '',
      mobilePhone: this.mobilePhone || '',
      dob:
        this.utilityService.getDateFromString(aboutIndivProspectDetails.dob) ||
        '',
      minorGuardianName: aboutIndivProspectDetails.minorGuardianName || '',
      fatherName: aboutIndivProspectDetails.fatherName || '',
      spouseName: aboutIndivProspectDetails.spouseName || '',
      motherMaidenName: aboutIndivProspectDetails.motherMaidenName || '',
      preferredLanguage: aboutIndivProspectDetails.preferredLanguage || 'ENGPRFLAN',
      occupation: aboutIndivProspectDetails.occupation || '',
      // nationality: aboutIndivProspectDetails.nationality || 'RSDTINDNATIONALITY',
      nationality: aboutIndivProspectDetails.nationality || 'INDNATIONALITY',
      age: this.showAge,
      gender: aboutIndivProspectDetails.gender || '',
      politicallyExposedPerson:
        aboutIndivProspectDetails.politicallyExposedPerson || '',
      alternateMobileNumber:
        aboutIndivProspectDetails.alternateMobileNumber || '',
      minorGuardianRelation:
        aboutIndivProspectDetails.minorGuardianRelation || '',
      employeeCode: aboutIndivProspectDetails.employeeCode || '',
      employerType: aboutIndivProspectDetails.employerType || '',
      designation: aboutIndivProspectDetails.designation || '',
      currentEmpYears: aboutIndivProspectDetails.currentEmpYears || '',
      noOfYearsCurrEmp: noofyearsInCurrEmp || '',
      noOfMonthsCurrEmp: noofmonthsInCurrEmp || '',

      employerName: aboutIndivProspectDetails.employerName || '',

      businessType: aboutIndivProspectDetails.businessType || '',
      businessName: aboutIndivProspectDetails.businessName || '',
      businessStartDate:
        this.utilityService.getDateFromString(aboutIndivProspectDetails.businessStartDate) || '',
      currentBusinessYears: aboutIndivProspectDetails.currentBusinessYears || '',
      noOfMonthsBussiness: noofmonthsInBusiness,
      noOfYearsBussiness: noofyearsInBusiness,
      turnOver: aboutIndivProspectDetails.turnOver || '',
      noOfYrsResidence: aboutIndivProspectDetails.yearsInCurrentResidence || '',
      noOfMonths: noofmonths,
      noOfYears: noofyears,
      recommendations: aboutIndivProspectDetails.recommendations || '',
      religion: aboutIndivProspectDetails.religion || '',
      community: aboutIndivProspectDetails.community || '',
      isMinority: aboutIndivProspectDetails.isMinority || '',
      residentStatus: aboutIndivProspectDetails.residentStatus || '',
      maritalStatus: aboutIndivProspectDetails.maritalStatus || '',
      weddingAnniversaryDate: this.utilityService.getDateFromString(aboutIndivProspectDetails.weddingAnniversaryDate) || '',
      educationalQualification: aboutIndivProspectDetails.eduQualification || '',
      noOfAdultsDependant: aboutIndivProspectDetails.noOfAdultsDependant || '',
      noOfChildrenDependant: aboutIndivProspectDetails.noOfChildrenDependant || '',
      marginMoney: aboutIndivProspectDetails.marginMoney || '',
      emiAffordability: aboutIndivProspectDetails.emiAffordability || '',
      equitasEmployeeNumber: aboutIndivProspectDetails.equitasEmployeeNumber || ''
    });
    //this.clearFatherOrSpouseValidation();
    //this.eitherFathOrspouse();
    if(this.applicant.ucic){
      details.get('name3').clearValidators();
      details.get('name3').updateValueAndValidity();
      this.islastNameReq = false
     }
  }

  setValuesForNonIndividual() {
    this.basicForm.patchValue({ title: 'M/SSALUTATION' });
    const corporateProspectDetails = this.applicant.corporateProspectDetails;
    const contactNumber = corporateProspectDetails.companyPhoneNumber;
    if (contactNumber && contactNumber.length == 12) {
      const contactSlice = contactNumber.slice(0, 2);
      if (contactSlice == '91') {
        this.mobilePhone = contactNumber.slice(2, 12);
      } else {
        this.mobilePhone = contactNumber;
      }
    } else {
      this.mobilePhone = contactNumber;
    }
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);


    if (corporateProspectDetails.externalRatingIssueDate) {
      const convertDate = this.utilityService.getDateFromString(corporateProspectDetails.externalRatingIssueDate)
      this.updateExternalIssueDate(convertDate)
    }
    details.patchValue({
      companyPhoneNumber: this.mobilePhone || '',
      companyEmailId: corporateProspectDetails.companyEmailId || '',
      alternateEmailId: corporateProspectDetails.alternateEmailId || '',
      numberOfDirectors: corporateProspectDetails.numberOfDirectors || '',
      dateOfIncorporation:
        this.utilityService.getDateFromString(
          corporateProspectDetails.dateOfIncorporation
        ) || '',
      countryOfCorporation: corporateProspectDetails.countryOfCorporation || '',
      businessType: corporateProspectDetails.businessType || '',
      // industry : corporateProspectDetails.industry || '',
      preferredLanguageCommunication:
        corporateProspectDetails.preferredLanguageCommunication || 'ENGPRFLAN',
      // customerCategory: applicantDetails.customerCategory || '',

      directorIdentificationNumber:
        corporateProspectDetails.directorIdentificationNumber || '',
      contactPerson: corporateProspectDetails.contactPerson || '',
      contactPersonDesignation:
        corporateProspectDetails.contactPersonDesignation || '',
      alternateContactNumber:
        corporateProspectDetails.alternateContactNumber || '',
      directorName: corporateProspectDetails.directorName || '',
      ratingIssuerName: corporateProspectDetails.ratingIssuerName || '',
      externalRatingAssigned:
        corporateProspectDetails.externalRatingAssigned || '',
      externalRatingIssueDate:
        this.utilityService.getDateFromString(
          corporateProspectDetails.externalRatingIssueDate
        ) || '',
      externalRatingExpiryDate:
        this.utilityService.getDateFromString(
          corporateProspectDetails.externalRatingExpiryDate
        ) || '',
      foreignCurrencyDealing:
        corporateProspectDetails.foreignCurrencyDealing || '',
      exposureBankingSystem:
        corporateProspectDetails.exposureBankingSystem || '',
      creditRiskScore: corporateProspectDetails.creditRiskScore || '',
    });

    if (corporateProspectDetails.externalRatingExpiryDate) {
      const convertDate = this.utilityService.getDateFromString(corporateProspectDetails.externalRatingExpiryDate)
      this.updateExternalExpiryDate(convertDate)
    }

    const directorArray = this.applicant.directorDetails;
    const director = this.basicForm.get('directors') as FormArray;
    console.log(this.basicForm, 'director', director,)
    const directorValue = this.applicant.corporateProspectDetails.numberOfDirectors;

    this.addDirectorControls(directorValue);
    if (Number(directorValue) === Number(directorArray.length)) {
      directorArray.forEach((value, index) => {         //patching directorDetails
        console.log(value, 'value', index)
        director.at(index).patchValue({
          directorName: value.directorName,
          din: value.din
        })


      })
    }

  }


  isEquitasEmployee(event) {
    const value = event.target.checked;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    if (value) {
      this.showEmployeeNo = true;
      this.checkedEquitasEmployee = '1'
      this.setEmployeeNoValidation(details);

    } else {
      this.showEmployeeNo = false;
      this.checkedEquitasEmployee = '0'
      this.removeEmployeeNoValidation(details);
      details.get('equitasEmployeeNumber').setValue('');
    }
  }

  setEmployeeNoValidation(details) {
    details.get('equitasEmployeeNumber').setValidators([Validators.required]);
    details.get('equitasEmployeeNumber').updateValueAndValidity();
    details.get('isEquitasEmployeeRelative').disable();
  }

  removeEmployeeNoValidation(details) {
    details.get('equitasEmployeeNumber').clearValidators();
    details.get('equitasEmployeeNumber').updateValueAndValidity();
    details.get('isEquitasEmployeeRelative').enable()
  }

  isRelativeEquitas(event) {
    const value = event.target.checked;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    if (value) {
      this.checkedRelativeEquitas = '1';
      // this.disableEquitasEmployee=true;
      details.get('isEquitasEmployee').disable()

    } else {
      this.checkedRelativeEquitas = '0'
      details.get('isEquitasEmployee').enable()

    }
  }


  addIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl('', Validators.required),
      name2: new FormControl(''),
      name3: new FormControl('', Validators.required),
      mobilePhone: new FormControl(null, Validators.required),
      dob: new FormControl(null, Validators.required),
      age: new FormControl({ value: '', disabled: true }),
      gender: new FormControl('', Validators.required),
      isSeniorCitizen: new FormControl(''),
      isMinor: new FormControl(''),

      applicantType: new FormControl(null),

      minorGuardianName: new FormControl('', Validators.required),
      minorGuardianRelation: new FormControl('', Validators.required),

      fatherName: new FormControl(''),
      spouseName: new FormControl(''),
      motherMaidenName: new FormControl(null, Validators.required),
      occupation: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      //customerCategory: new FormControl('', Validators.required),
      custSegment: new FormControl('', Validators.required),
      emailId: new FormControl(''),
      alternateEmailId: new FormControl(''),
      alternateMobileNumber: new FormControl(''),
      preferredLanguage: new FormControl('', Validators.required),
      politicallyExposedPerson: new FormControl(null, Validators.required),
      designation: new FormControl(''),
      employerName: new FormControl(null),
      currentEmpYears: new FormControl(null),
      noOfYearsCurrEmp: new FormControl(null),
      noOfMonthsCurrEmp: new FormControl(null),
      employeeCode: new FormControl(null),
      employerType: new FormControl(''),

      businessType: new FormControl(''),
      businessName: new FormControl(null),
      businessStartDate: new FormControl(null),
      currentBusinessYears: new FormControl(null),
      noOfYearsBussiness: new FormControl(null),
      noOfMonthsBussiness: new FormControl(null),
      turnOver: new FormControl(''),

      // added new form controls  on 16-07-2020
      monthlyIncomeAmount: new FormControl(''),
      annualIncomeAmount: new FormControl({ value: '', disabled: true }),
      ownHouseProofAvail: new FormControl(''),
      houseOwnerProperty: new FormControl({ value: '', disabled: true }),
      ownHouseAppRelationship: new FormControl({ value: '', disabled: true }),
      averageBankBalance: new FormControl(''),
      rtrType: new FormControl(''),
      prevLoanAmount: new FormControl(''),
      loanTenorServiced: new FormControl(''),
      currentEMILoan: new FormControl(''),
      agriNoOfAcres: new FormControl(''),
      agriOwnerProperty: new FormControl(''),
      agriAppRelationship: new FormControl(''),
      grossReceipt: new FormControl(''),

      //added new form controls on 04.12.2020
      noOfYrsResidence: new FormControl(''),
      noOfYears: new FormControl('', Validators.required),
      noOfMonths: new FormControl('', Validators.required),
      recommendations: new FormControl(''),
      religion: new FormControl('', Validators.required),
      community: new FormControl('', Validators.required),
      isMinority: new FormControl('', Validators.required),
      residentStatus: new FormControl('', Validators.required),
      maritalStatus: new FormControl('', Validators.required),
      weddingAnniversaryDate: new FormControl('', Validators.required),
      educationalQualification: new FormControl(''),
      noOfAdultsDependant: new FormControl('', Validators.required),
      noOfChildrenDependant: new FormControl('', Validators.required),
      marginMoney: new FormControl('', Validators.required),
      emiAffordability: new FormControl('', Validators.required),
      isEquitasEmployeeRelative: new FormControl(''),
      isEquitasEmployee: new FormControl(''),
      equitasEmployeeNumber: new FormControl(''),

    });
    formArray.push(controls);
    // setTimeout(() => {
    //     this.addOrRemoveSelfEmployedFormControls(false);
    // });
  }

  addNonIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null, Validators.required),
      name2: new FormControl(null),
      name3: new FormControl(null),
      // companyPhoneNumber: new FormControl(null),
      dateOfIncorporation: new FormControl(null, Validators.required),
      contactPerson: new FormControl(null, Validators.required),
      companyPhoneNumber: new FormControl(null, Validators.required),
      countryOfCorporation: new FormControl(null, Validators.required),
      businessType: new FormControl('', Validators.required),
      // industry: new FormControl(''  ),
      companyEmailId: new FormControl(null),
      alternateEmailId: new FormControl(null),
      alternateContactNumber: new FormControl(''),
      preferredLanguageCommunication: new FormControl('', Validators.required),
      contactPersonDesignation: new FormControl('', Validators.required),
      numberOfDirectors: new FormControl(null),
      // directorName: new FormControl(null),
      // din: new FormControl(null, Validators.required),
      ratingIssuerName: new FormControl(null, Validators.required),
      externalRatingAssigned: new FormControl(null, Validators.required),
      externalRatingIssueDate: new FormControl(null, Validators.required),
      externalRatingExpiryDate: new FormControl(null, Validators.required),
      foreignCurrencyDealing: new FormControl(null, Validators.required),
      exposureBankingSystem: new FormControl(null, Validators.required),
      creditRiskScore: new FormControl(null, Validators.required),

      // added new form controls on 16-07-2020
      //custSegment: new FormControl('', Validators.required),
      monthlyIncomeAmount: new FormControl(''),
      annualIncomeAmount: new FormControl({ value: '', disabled: true }),
      ownHouseProofAvail: new FormControl(''),
      houseOwnerProperty: new FormControl({ value: '', disabled: true }),
      ownHouseAppRelationship: new FormControl({ value: '', disabled: true }),
      averageBankBalance: new FormControl(''),
      rtrType: new FormControl(''),
      prevLoanAmount: new FormControl(''),
      loanTenorServiced: new FormControl(''),
      currentEMILoan: new FormControl(''),
      agriNoOfAcres: new FormControl(''),
      agriOwnerProperty: new FormControl(''),
      agriAppRelationship: new FormControl(''),
      grossReceipt: new FormControl(''),
    });
    formArray.push(controls);
  }


  getDirectorsControls() {                      // director array controls
    return new FormGroup({
      directorName: new FormControl(),
      din: new FormControl()
    });
  }


  addDirectorControls(value) {                      // adding director controls based on no of directors
    const director = this.basicForm.get('directors') as FormArray;
    if (value === '' || value == null) {
      return;
    }
    let directorValue = Number(value);
    if (directorValue === this.directorCount) {
      return;
    }

    const form = <FormArray>this.basicForm.controls['directors'];
    if (directorValue === 0) {
      director.controls = [];
    }

    const remainingCount = this.directorCount - directorValue;
    if (remainingCount < 0) {
      for (let i = this.directorCount; i < directorValue; i++) {
        form.push(this.getDirectorsControls())

      }

    }
    if (remainingCount > 0) {
      for (let i = this.directorCount - 1; i >= directorValue; i--) {
        form.removeAt(i);
      }
    }
    this.directorCount = directorValue;
    this.setDirectorsValidators(value);
  }

  setDirectorsValidators(value) {                  // set validators in director array only for Non individual
    if (value !== '' || value == null) {
      for (let i = 0; i < value; i++) {
        this.basicForm.get('directors')['controls'][i].get('directorName').setValidators(Validators.required);
        this.basicForm.get('directors')['controls'][i].get('din').setValidators(Validators.required);
        this.basicForm.get('directors').updateValueAndValidity();
      }
    }
  }
  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      console.log('this.LOV.LOVS', this.LOV.LOVS)
      this.ownerPropertyRelation = this.LOV.LOVS.applicantRelationshipWithLead.filter(data => data.value !== 'Guarantor')
      this.getIdentifyAppNonInd();
      if(this.isAppNonInd){
        this.relationShipLov = this.LOV.LOVS['concernType-SelfEmployed'];
      }else{
        this.relationShipLov = this.LOV.LOVS['relationship'];
      }
      const businessTypevalue = this.LOV.LOVS.businessType
      businessTypevalue.find((data) => {
        if (data.key == "13BIZTYP" || data.key == "14BIZTYP" || data.key == "15BIZTYP" || data.key == "7BIZTYP") {
          this.selfEmpBusType.push(data)
        }
      })

      this.applicant = this.applicantDataService.getApplicant(); // To get Applicant details from api
      this.udfDetails = this.applicant.udfDetails;
      this.setBasicData();
      if (this.applicant.ucic) {
        if (this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP') {
          this.disableUCICIndividualDetails();
        } else {
          this.disableUCICNonIndividualDetails();
        }
      }
      if (this.applicant.ekycDone == '1') {
        if (this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP') {
          this.disableEKYDetails();
        }
      }


    });

  }
  getIdentifyAppNonInd(){
    this.isAppNonInd= this.applicantData.some((data : any)=>{
      return data.applicantTypeKey == 'APPAPPRELLEAD' && data.entityTypeKey == 'NONINDIVENTTYP'     
   })
  }

  disableEKYDetails() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const applicantDetails = this.applicant.applicantDetails;
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails;
    applicantDetails.name1 ? details.get('name1').disable() : details.get('name1').enable();
    details.get('name2').disable()
    applicantDetails.name3 ? details.get('name3').disable() : details.get('name3').enable();
    aboutIndivProspectDetails.dob ? details.get('dob').disable() : details.get('dob').enable();
    aboutIndivProspectDetails.gender ? details.get('gender').disable() : details.get('gender').enable();
  }

  disableUCICIndividualDetails() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('name1').disable();
    details.get('name2').disable();
    details.get('name3').disable();
    details.get('dob').disable();
    details.get('mobilePhone').disable();
    details.get('gender').disable();

  }
  disableUCICNonIndividualDetails() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('name1').disable();
    details.get('name2').disable();
    details.get('name3').disable();
    details.get('dateOfIncorporation').disable();
    details.get('companyPhoneNumber').disable();
  }
  clearFormArray() {
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
  }

  // onIndividualChange(event) {
  //   const value = event.target.value;
  //   this.isIndividual = value === 'INDIVENTTYP';
  //   const formArray = this.basicForm.get('details') as FormArray;
  //   formArray.clear();
  //   this.isIndividual
  //     ? this.addIndividualFormControls()
  //     : this.addNonIndividualFormControls();
  // }

  // onOccupationChange(event) {
  //   this.occupationValue = event.target.value;
  //   console.log('occValue', this.occupationValue)
  //   if (this.occupationValue === "FAROCPTION") {
  //     this.removeEmployeeValidators()
  //   } else {
  //     this.setSalriedValidators()
  //   }

  // }


  setEqutasDefaultValues(details) {
    this.checkedEquitasEmployee = '0'
    this.checkedRelativeEquitas = '0'
    details.get('isEquitasEmployee').enable();
    details.get('isEquitasEmployeeRelative').enable();
    details.get('equitasEmployeeNumber').setValue(null);
    details.get('equitasEmployeeNumber').clearValidators();
    details.get('equitasEmployeeNumber').updateValueAndValidity();
  }
  onCustCategoryChanged(value) {
    this.custCatValue = value;

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('occupation').setValue('');
    const lov = this.LOV.LOVS.occupation;
    this.occupation = this.applicantDataService.getOccupationLov(lov, this.custCatValue);
    //console.log('occupation', this.occupation)
    this.setEqutasDefaultValues(details);
    this.setNullValues(details)
    if (this.custCatValue == 'SEMCUSTSEG') {
      this.ageOfSeniorCitizen = this.salariedMaxAge;

      this.checkingSenior = this.showAge >= this.ageOfSeniorCitizen;

      details.get('isSeniorCitizen').setValue(this.checkingSenior);

      this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0';
      this.showSelfEmp = true;
      this.setSelfEmpValidators();
      this.removeSalariedValidators()
    } else if (this.custCatValue == 'SALCUSTSEG') {
      this.ageOfSeniorCitizen = this.selfMaxAge;
      this.checkingSenior = this.showAge >= this.ageOfSeniorCitizen;
      details.get('isSeniorCitizen').setValue(this.checkingSenior);
      this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0';
      this.showSalaried = true;
      this.setSalriedValidators();
      this.removeSelfEmpValidators()
    }

    else if (this.custCatValue == 'FTBCUSTSEG' || this.custCatValue == 'FTUCUSTSEG' || this.custCatValue == 'TROPCUSTSEG') {
      //this.showSalaried = true;
      this.setSelfEmpValidators();
      this.removeSalariedValidators();
    } else {
      this.showSalaried = false;
      this.showSelfEmp = false;
      this.removeSalariedValidators();
      this.removeSelfEmpValidators();
    }

  }






  setNullValues(details) {
    details.get('businessType').setValue(null);
    details.get('businessName').setValue(null);
    details.get('businessStartDate').setValue(null);
    details.get('noOfYearsBussiness').setValue(null);
    details.get('noOfMonthsBussiness').setValue(null);
    details.get('turnOver').setValue(null);
    details.get('employerType').setValue(null);
    details.get('designation').setValue(null);
    details.get('employerName').setValue(null);
    details.get('currentEmpYears').setValue(null);
    details.get('noOfYearsCurrEmp').setValue(null);
    details.get('noOfMonthsCurrEmp').setValue(null);
    details.get('employeeCode').setValue(null);
  }

  // removeEmployeeValidators() {
  //   this.employerType = '';
  //   this.employeeCode = '';
  //   this.employerName = '';
  //   this.designation = '';
  //   this.noOfEmpYears = '';

  //  setTimeout(() => {
  //   const formArray = this.basicForm.get('details') as FormArray;
  //   const details = formArray.at(0);

  //   const employerType=details.get('employerType');
  //   const designation=details.get('designation');
  //   const employerName= details.get('employerName')
  //   const employeeCode = details.get('employeeCode')
  //   const currentEmpYears= details.get('currentEmpYears')

  //   this.setControlValues(employerType);
  //   this.setControlValues(designation);
  //   this.setControlValues(employerName);
  //   this.setControlValues(employeeCode);
  //   this.setControlValues(currentEmpYears);
  //  });

  // }

  // setControlValues(controls : AbstractControl){
  //    controls.clearValidators();
  //    controls.updateValueAndValidity
  //    const value= controls.value;

  //    controls.setValue(value || null)
  // }

  setSalriedValidators() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('employerType').setValidators([Validators.required]);
    details.get('employerType').updateValueAndValidity();
    details.get('designation').setValidators([Validators.required]);
    details.get('designation').updateValueAndValidity();
    details.get('employerName').setValidators([Validators.required]);
    details.get('employerName').updateValueAndValidity();

    details.get('noOfYearsCurrEmp').setValidators([Validators.required]);
    details.get('noOfYearsCurrEmp').updateValueAndValidity();

    details.get('noOfMonthsCurrEmp').setValidators([Validators.required]);
    details.get('noOfMonthsCurrEmp').updateValueAndValidity();


    details.get('employeeCode').setValidators([Validators.required]);
    details.get('employeeCode').updateValueAndValidity();

  }
  setSelfEmpValidators() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('businessType').setValidators([Validators.required]);
    details.get('businessType').updateValueAndValidity();
    details.get('businessName').setValidators([Validators.required]);
    details.get('businessName').updateValueAndValidity();
    details.get('businessStartDate').setValidators([Validators.required]);
    details.get('businessStartDate').updateValueAndValidity();
    details.get('noOfYearsBussiness').setValidators([Validators.required]);
    details.get('noOfYearsBussiness').updateValueAndValidity();
    details.get('noOfMonthsBussiness').setValidators([Validators.required]);
    details.get('noOfMonthsBussiness').updateValueAndValidity();
    details.get('turnOver').setValidators([Validators.required]);
    details.get('turnOver').updateValueAndValidity();
  }
  removeSalariedValidators() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('employerType').clearValidators();
    details.get('employerType').updateValueAndValidity();
    details.get('designation').clearValidators();
    details.get('designation').updateValueAndValidity();
    details.get('employerName').clearValidators();
    details.get('employerName').updateValueAndValidity();
    details.get('currentEmpYears').clearValidators();
    details.get('currentEmpYears').updateValueAndValidity();
    details.get('noOfYearsCurrEmp').clearValidators();
    details.get('noOfYearsCurrEmp').updateValueAndValidity();
    details.get('noOfMonthsCurrEmp').clearValidators();
    details.get('noOfMonthsCurrEmp').updateValueAndValidity();

    details.get('employeeCode').clearValidators();
    details.get('employeeCode').updateValueAndValidity();

    details.patchValue({
      employerType: '',
      designation: '',
      employerName: '',
      currentEmpYears: '',
      noOfYearsCurrEmp: '',
      noOfMonthsCurrEmp: '',
      employeeCode: ''
    })
  }
  removeSelfEmpValidators() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('businessType').clearValidators();
    details.get('businessType').updateValueAndValidity();
    details.get('businessName').clearValidators();
    details.get('businessName').updateValueAndValidity();
    details.get('businessStartDate').clearValidators();
    details.get('businessStartDate').updateValueAndValidity();
    details.get('currentBusinessYears').clearValidators();
    details.get('currentBusinessYears').updateValueAndValidity();
    details.get('noOfYearsBussiness').clearValidators();
    details.get('noOfYearsBussiness').updateValueAndValidity();
    details.get('noOfMonthsBussiness').clearValidators();
    details.get('noOfMonthsBussiness').updateValueAndValidity();
    details.get('turnOver').clearValidators();
    details.get('turnOver').updateValueAndValidity();

    details.patchValue({
      businessType: '',
      businessName: '',
      businessStartDate: '',
      currentBusinessYears: '',
      noOfYearsBussiness: '',
      noOfMonthsBussiness: '',
      turnOver: ''
    })
  }


  onChangeOwner(event) {
    const value = event.target.value;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const appRelation = this.getSelfRelationValue()
    if (value === 'APPAPPRELLEAD') {
      details.get('ownHouseAppRelationship').setValue(appRelation.key);
    } else {
      details.get('ownHouseAppRelationship').setValue('');
    }
  }

  onChangeAgriOwner(event) {
    const value = event.target.value;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const appRelation = this.getSelfRelationValue()
    if (value === 'APPAPPRELLEAD') {
      details.get('agriAppRelationship').setValue(appRelation.key);
    } else {
      details.get('agriAppRelationship').setValue('');
    }
  }
  getSelfRelationValue() {
    const relationship = this.LOV.LOVS.relationship;
    const appRelation = relationship.find((data: any) => {
      return data.key === '5RELATION'
    })
    return appRelation
  }



  setValidation() {                    // set validators based upon product aanf funding program
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    if (this.productCategory == '1003' && (this.fundingProgram == '25' || this.fundingProgram == '24')) {
      details.get('monthlyIncomeAmount').setValidators([Validators.required]);
      details.get('monthlyIncomeAmount').updateValueAndValidity();
    }

    if (this.productCategory == '1003' && this.fundingProgram == '27') {
      details.get('rtrType').setValidators([Validators.required]);
      details.get('rtrType').updateValueAndValidity();
      details.get('prevLoanAmount').setValidators([Validators.required]);
      details.get('prevLoanAmount').updateValueAndValidity();
      details.get('loanTenorServiced').setValidators([Validators.required]);
      details.get('loanTenorServiced').updateValueAndValidity();
      details.get('currentEMILoan').setValidators([Validators.required]);
      details.get('currentEMILoan').updateValueAndValidity();
    }
    if (this.productCategory == '1003' && this.fundingProgram == '29') {
      details.get('agriNoOfAcres').setValidators([Validators.required]);
      details.get('agriNoOfAcres').updateValueAndValidity();
      details.get('agriOwnerProperty').setValidators([Validators.required]);
      details.get('agriOwnerProperty').updateValueAndValidity();
      details.get('agriAppRelationship').setValidators([Validators.required]);
      details.get('agriAppRelationship').updateValueAndValidity();

    }
    if (this.productCategory == '1003' && this.fundingProgram == '30') {
      details.get('grossReceipt').setValidators([Validators.required]);
      details.get('grossReceipt').updateValueAndValidity();

    }

  }

  updateExternalExpiryDate(event) {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    this.externalExpiryDate = new Date(event)
    this.isExpiryDate = false;

    if (this.externalExpiryDate < this.toDayDate) {
      this.showMsg['expiryDate'] = true;
    } else {
      this.showMsg['expiryDate'] = false;
    }

  }

  updateExternalIssueDate(event) {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    this.showMsg['expiryDate'] = false;
    this.externalIssueDate = new Date(event);
    if (this.externalIssueDate > this.maxExtrIssue) {
      this.showMsg['issueDate'] = true
    } else {
      this.showMsg['issueDate'] = false
    }

    details.get('externalRatingExpiryDate').setValue(null)


  }

  async onSubmit() {
    console.log('this.basicForm', this.basicForm)
    this.setValidation();
    const value = this.basicForm.getRawValue();
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    if (this.hideMsgForOwner) {
      const houseOwner = details.get('houseOwnerProperty').value;
      const ownHouseAppRelationship = details.get('ownHouseAppRelationship').value
      details.patchValue({
        houseOwnerProperty: houseOwner,
        ownHouseAppRelationship: ownHouseAppRelationship
      })
    }

    // if (this.showSalaried) {
    //   const designation = details.get('designation').value;
    //   const employerType = details.get('employerType').value
    //   details.patchValue({
    //     designation: designation,
    //     employerType: employerType
    //   })
    // }

    if (this.showSelfEmp) {
      const businessType = details.get('businessType').value;
      details.patchValue({
        businessType: businessType
      })
    }


    this.isDirty = true;

    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false
    if (this.basicForm.invalid || isUDFInvalid) {

      this.toasterService.showError(
        'Please fill all mandatory fields.',
        'Applicant Details'
      );

      return;

    }


    if (this.showNotApplicant) {

      this.toasterService.showError('There should be only one main applicant for this lead', '');
      return;

    }

    if (this.isIndividual) {

      const fatherName = details.get('fatherName').value
      const spouseName = details.get('spouseName').value
      if (!fatherName && !spouseName) {
        this.toasterService.showInfo(
          'Please enter either father name or spouse name',
          ''
        );
        return;
      }


      const formValueData = value.details[0];

      if (Number(formValueData.noOfYears) == 0 && Number(formValueData.noOfMonths) == 0) {

        this.toasterService.showError('Please fill any one of the no of years or months', 'No of years residing at present residence')
        return;
      }

      if (this.custCatValue === "SEMCUSTSEG") {

        if (Number(formValueData.noOfYearsBussiness) == 0 && Number(formValueData.noOfMonthsBussiness) == 0) {

          this.toasterService.showError('Please fill any one of the no of years or months', 'No of years in current business')
          return;
        }

      }

      if (this.custCatValue === 'SALCUSTSEG') {
        if (Number(formValueData.noOfYearsCurrEmp) == 0 && Number(formValueData.noOfMonthsCurrEmp) == 0) {

          this.toasterService.showError('Please fill any one of the no of years or months', 'No of years in current employment')
          return;
        }
      }

      this.storeIndividualValueInService(value);
    } else {
      this.storeNonIndividualValueInService(value);
    }
    const udfDetails= this.userDefineForm? JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    

    const applicantData = this.applicantDataService.getApplicant();
    const leadId = (await this.getLeadId()) as number;
    //const udfData = this.userDefineForm?  JSON.stringify(this.userDefineForm.udfData.getRawValue()) : ""
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
      leadId: this.leadId,
      udfDetails : [{
        "udfGroupId": this.udfGroupId,
        //"udfScreenId": this.udfScreenId,
        "udfData": udfDetails
      }]
    };


    this.applicantService.saveApplicant(data).subscribe((response: any) => {
      if (response.ProcessVariables.error.code === '0') {
        // this.isSave= true;
        // this.applicantDataService.setForSaveBasicDetails(true);
        this.toasterService.showSuccess(
          'Record Saved Successfully',
          ''
        );
        this.udfDetails[0].udfData=  udfDetails;
    
        this.applicantDataService.setUdfDatas(this.udfDetails)
        this.apiValue = this.basicForm.getRawValue();
        this.initUDFValues = this.userDefineForm.udfData.getRawValue();


        if (this.isIndividual) {
          const dob = this.basicForm.getRawValue().details[0].dob
          this.apiValue.details[0].dob = this.utilityService.getDateFormat(dob)
        } else {
          const doc = this.basicForm.getRawValue().details[0].dateOfIncorporation;
          const externalRatingIssueDate = this.basicForm.getRawValue().details[0].externalRatingIssueDate;
          const externalRatingExpiryDate = this.basicForm.getRawValue().details[0].externalRatingExpiryDate;
          this.apiValue.details[0].dateOfIncorporation = this.utilityService.getDateFormat(doc)
          this.apiValue.details[0].externalRatingIssueDate = this.utilityService.getDateFormat(externalRatingIssueDate)
          this.apiValue.details[0].externalRatingExpiryDate = this.utilityService.getDateFormat(externalRatingExpiryDate)
        }
      } else {
        this.toasterService.showError(
          response.ProcessVariables.error.message,
          'Applicant Details'
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
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2 ? formValue.name2 : '';
    applicantDetails.name3 = formValue.name3 ? formValue.name3 : '';

    applicantDetails.monthlyIncomeAmount = formValue.monthlyIncomeAmount;
    applicantDetails.annualIncomeAmount = formValue.annualIncomeAmount;
    applicantDetails.ownHouseProofAvail = this.isChecked == true ? '1' : '0',
      applicantDetails.houseOwnerProperty = formValue.houseOwnerProperty;
    applicantDetails.ownHouseAppRelationship = formValue.ownHouseAppRelationship;
    applicantDetails.averageBankBalance = formValue.averageBankBalance;
    applicantDetails.rtrType = formValue.rtrType;
    applicantDetails.prevLoanAmount = formValue.prevLoanAmount;
    applicantDetails.loanTenorServiced = Number(formValue.loanTenorServiced);
    applicantDetails.currentEMILoan = formValue.currentEMILoan;
    applicantDetails.agriNoOfAcres = Number(formValue.agriNoOfAcres);
    applicantDetails.agriOwnerProperty = formValue.agriOwnerProperty;
    applicantDetails.agriAppRelationship = formValue.agriAppRelationship;
    applicantDetails.grossReceipt = formValue.grossReceipt;

    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.entityType = value.entity;
    applicantDetails.title = value.title;
    //applicantDetails.customerCategory = formValue.customerCategory;
    applicantDetails.custSegment = formValue.custSegment || '';
    this.applicantDataService.setApplicantDetails(applicantDetails);

    const aboutIndivProspectDetails = formValue;
    prospectDetails.dob = this.utilityService.getDateFormat(formValue.dob);
    prospectDetails.mobilePhone = aboutIndivProspectDetails.mobilePhone
      ? `91${aboutIndivProspectDetails.mobilePhone}`
      : '';
    prospectDetails.isSeniorCitizen = this.isSeniorCitizen;
    prospectDetails.isMinor = this.isMinor;
    prospectDetails.minorGuardianName = aboutIndivProspectDetails.minorGuardianName
      ? aboutIndivProspectDetails.minorGuardianName
      : '';
    // prospectDetails.minorGuardianUcic = Number(
    //   aboutIndivProspectDetails.minorGuardianUcic
    // );
    prospectDetails.age = Number(this.showAge);
    prospectDetails.gender = formValue.gender || '';
    prospectDetails.minorGuardianRelation =
      formValue.minorGuardianRelation || '';
    prospectDetails.alternateMobileNumber = formValue.alternateMobileNumber
      ? formValue.alternateMobileNumber
      : '';
    prospectDetails.politicallyExposedPerson =
      formValue.politicallyExposedPerson;
    prospectDetails.spouseName = aboutIndivProspectDetails.spouseName
      ? aboutIndivProspectDetails.spouseName
      : '';
    prospectDetails.fatherName = aboutIndivProspectDetails.fatherName
      ? aboutIndivProspectDetails.fatherName
      : '';
    prospectDetails.motherMaidenName =
      aboutIndivProspectDetails.motherMaidenName;
    prospectDetails.nationality = aboutIndivProspectDetails.nationality;
    prospectDetails.occupation = aboutIndivProspectDetails.occupation;
    prospectDetails.emailId = aboutIndivProspectDetails.emailId
      ? aboutIndivProspectDetails.emailId
      : '';
    prospectDetails.alternateEmailId = aboutIndivProspectDetails.alternateEmailId
      ? aboutIndivProspectDetails.alternateEmailId
      : '';
    prospectDetails.preferredLanguage =
      aboutIndivProspectDetails.preferredLanguage;
    prospectDetails.designation = aboutIndivProspectDetails.designation;

    prospectDetails.currentEmpYears = String((Number(aboutIndivProspectDetails.noOfYearsCurrEmp) * 12) + Number(aboutIndivProspectDetails.noOfMonthsCurrEmp)) || '';

    prospectDetails.employeeCode = aboutIndivProspectDetails.employeeCode
      ? aboutIndivProspectDetails.employeeCode
      : '';

    prospectDetails.businessType = aboutIndivProspectDetails.businessType
      ? aboutIndivProspectDetails.businessType
      : '';
    prospectDetails.businessName = aboutIndivProspectDetails.businessName
      ? aboutIndivProspectDetails.businessName
      : '';
    prospectDetails.businessStartDate = this.utilityService.getDateFormat(aboutIndivProspectDetails.businessStartDate);


    aboutIndivProspectDetails.currentBusinessYears = String((Number(aboutIndivProspectDetails.noOfYearsBussiness) * 12) + Number(aboutIndivProspectDetails.noOfMonthsBussiness)) || '';

    prospectDetails.currentBusinessYears = aboutIndivProspectDetails.currentBusinessYears
      ? aboutIndivProspectDetails.currentBusinessYears
      : '';
    prospectDetails.turnOver = aboutIndivProspectDetails.turnOver
      ? aboutIndivProspectDetails.turnOver
      : '';



    //adding new fields provided for dde basic details




    aboutIndivProspectDetails.noOfYrsResidence = String((Number(aboutIndivProspectDetails.noOfYears) * 12) + Number(aboutIndivProspectDetails.noOfMonths)) || '';


    prospectDetails.relationWithApplicant = value.applicantRelationship || '';
    prospectDetails.yearsInCurrentResidence = aboutIndivProspectDetails.noOfYrsResidence || '';
    prospectDetails.recommendations = aboutIndivProspectDetails.recommendations || '';
    prospectDetails.religion = aboutIndivProspectDetails.religion || '';
    prospectDetails.community = aboutIndivProspectDetails.community || '';
    prospectDetails.isMinority = aboutIndivProspectDetails.isMinority || '';
    prospectDetails.residentStatus = aboutIndivProspectDetails.residentStatus || '';
    prospectDetails.maritalStatus = aboutIndivProspectDetails.maritalStatus || '';
    prospectDetails.weddingAnniversaryDate = this.utilityService.getDateFormat(aboutIndivProspectDetails.weddingAnniversaryDate) || ''

    prospectDetails.eduQualification = aboutIndivProspectDetails.educationalQualification || '';
    prospectDetails.noOfAdultsDependant = aboutIndivProspectDetails.noOfAdultsDependant || '';
    prospectDetails.noOfChildrenDependant = aboutIndivProspectDetails.noOfChildrenDependant || '';
    prospectDetails.marginMoney = aboutIndivProspectDetails.marginMoney || '';
    prospectDetails.emiAffordability = aboutIndivProspectDetails.emiAffordability || '';
    prospectDetails.isEquitasEmployeeRelative = this.checkedRelativeEquitas;
    prospectDetails.isEquitasEmployee = this.checkedEquitasEmployee;
    prospectDetails.equitasEmployeeNumber = aboutIndivProspectDetails.equitasEmployeeNumber || '';
    prospectDetails.employerType = formValue.employerType || '';
    prospectDetails.employerName = formValue.employerName || '';



    this.applicantDataService.setIndividualProspectDetails(prospectDetails);


    // indivProspectProfileDetails.employerType = formValue.employerType
    //   ? formValue.employerType
    //   : '';
    // indivProspectProfileDetails.employerName = formValue.employerName
    //   ? formValue.employerName
    //   : '';
    // console.log('indivProspectProfileDetails',indivProspectProfileDetails)
    // this.applicantDataService.setindivProspectProfileDetails(
    //   indivProspectProfileDetails
    // );
  }

  storeNonIndividualValueInService(value) {
    const prospectDetails: CorporateProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};
    const directorDetails: DirectorDetails = {}

    const formValue = value.details[0];

    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2 ? formValue.name2 : '';
    applicantDetails.name3 = formValue.name3 ? formValue.name3 : '';
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.entityType = value.entity;
    applicantDetails.bussinessEntityType = value.bussinessEntityType || '';
    applicantDetails.title = value.title;

    // added new form controls on 15-07-2020

    //applicantDetails.custSegment = formValue.custSegment;
    applicantDetails.monthlyIncomeAmount = formValue.monthlyIncomeAmount;
    applicantDetails.annualIncomeAmount = formValue.annualIncomeAmount;
    applicantDetails.ownHouseProofAvail = this.isChecked == true ? '1' : '0',
      applicantDetails.houseOwnerProperty = formValue.houseOwnerProperty;
    applicantDetails.ownHouseAppRelationship = formValue.ownHouseAppRelationship;
    applicantDetails.averageBankBalance = formValue.averageBankBalance;
    applicantDetails.rtrType = formValue.rtrType;
    applicantDetails.prevLoanAmount = formValue.prevLoanAmount;
    applicantDetails.loanTenorServiced = Number(formValue.loanTenorServiced);
    applicantDetails.currentEMILoan = formValue.currentEMILoan;
    applicantDetails.agriNoOfAcres = Number(formValue.agriNoOfAcres);
    applicantDetails.agriOwnerProperty = formValue.agriOwnerProperty;
    applicantDetails.agriAppRelationship = formValue.customerCategory;
    applicantDetails.grossReceipt = formValue.grossReceipt;

    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.dateOfIncorporation = this.utilityService.getDateFormat(
      formValue.dateOfIncorporation
    );
    prospectDetails.contactPerson = formValue.contactPerson;
    prospectDetails.companyPhoneNumber = formValue.companyPhoneNumber;
    prospectDetails.countryOfCorporation = formValue.countryOfCorporation;
    prospectDetails.businessType = formValue.businessType;
    // prospectDetails.industry = formValue.industry;
    prospectDetails.companyEmailId = formValue.companyEmailId;
    prospectDetails.alternateEmailId = formValue.alternateEmailId;
    prospectDetails.preferredLanguageCommunication =
      formValue.preferredLanguageCommunication;
    prospectDetails.alternateContactNumber = formValue.alternateContactNumber;
    prospectDetails.contactPersonDesignation =
      formValue.contactPersonDesignation;
    prospectDetails.numberOfDirectors = Number(formValue.numberOfDirectors);
    // prospectDetails.directorName = formValue.directorName;
    // prospectDetails.directorIdentificationNumber =
    //   formValue.directorIdentificationNumber;
    prospectDetails.ratingIssuerName = formValue.ratingIssuerName;
    prospectDetails.externalRatingAssigned = formValue.externalRatingAssigned;
    prospectDetails.externalRatingIssueDate = this.utilityService.getDateFormat(
      formValue.externalRatingIssueDate
    );
    prospectDetails.externalRatingExpiryDate = this.utilityService.getDateFormat(
      formValue.externalRatingExpiryDate
    );
    prospectDetails.foreignCurrencyDealing = formValue.foreignCurrencyDealing;
    prospectDetails.exposureBankingSystem = formValue.exposureBankingSystem;
    prospectDetails.creditRiskScore = formValue.creditRiskScore;
    this.applicantDataService.setCorporateProspectDetails(prospectDetails);


    const items = this.basicForm.get('directors').value;
    items.map((value) => {
      const data = {
        directorName: value.directorName,
        din: value.din
      };
      this.directorObject.push(data);
    });

    this.applicantDataService.setDirectorDetails(this.directorObject);
  }
  onBack() {
    //this.location.back();
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }

  onNext() {
    if (this.isLoan360) {
      this.router.navigate([
        `/pages/applicant-details/${this.leadId}/identity-details`,
        this.applicantId,
      ]);
    }
    this.finalValue = this.basicForm.getRawValue();
    console.log('this.finalValue', this.finalValue)
    if (this.isIndividual) {
      // if(this.applicant.ucic){
      //   this.finalValue.details[0].name1=this.apiValue.details[0].name1
      //   this.finalValue.details[0].name2=this.apiValue.details[0].name2
      //   this.finalValue.details[0].name3=this.apiValue.details[0].name3
      //   this.finalValue.details[0].mobilePhone=this.apiValue.details[0].mobilePhone
      //   this.finalValue.details[0].dob=this.apiValue.details[0].dob
      //   this.finalValue.details[0].gender=this.apiValue.details[0].gender
      // }
      const dob = this.basicForm.getRawValue().details[0].dob
      this.finalValue.details[0].dob = this.utilityService.getDateFormat(dob)
    } else {
      // if(this.applicant.ucic){
      //   this.finalValue.details[0].name1=this.apiValue.details[0].name1
      //   this.finalValue.details[0].name2=this.apiValue.details[0].name2
      //   this.finalValue.details[0].name3=this.apiValue.details[0].name3
      //   this.finalValue.details[0].companyPhoneNumber=this.apiValue.details[0].companyPhoneNumber
      //   this.finalValue.details[0].dateOfIncorporation=this.apiValue.details[0].dateOfIncorporation
      // }
      const doc = this.basicForm.getRawValue().details[0].dateOfIncorporation;
      const externalRatingIssueDate = this.basicForm.getRawValue().details[0].externalRatingIssueDate;
      const externalRatingExpiryDate = this.basicForm.getRawValue().details[0].externalRatingExpiryDate;
      this.finalValue.details[0].dateOfIncorporation = this.utilityService.getDateFormat(doc)
      this.finalValue.details[0].externalRatingIssueDate = this.utilityService.getDateFormat(externalRatingIssueDate)
      this.finalValue.details[0].externalRatingExpiryDate = this.utilityService.getDateFormat(externalRatingExpiryDate)
    }
    // console.log(JSON.stringify(this.apiValue));
    // console.log(JSON.stringify(this.finalValue));
    // console.log(this.objectComparisonService.compare(this.apiValue, this.finalValue));
    this.editedUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue);
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)
    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false
    if (this.basicForm.invalid || isUDFInvalid) {
      this.toasterService.showInfo('Please SAVE details before proceeding', '');
      return;
    }
    if (!isValueCheck|| !isUDFCheck) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }


    this.router.navigate([
      `/pages/applicant-details/${this.leadId}/identity-details`,
      this.applicantId,
    ]);


  }

  onBackToApplicant() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }

  getAnniversaryDate(event) {

  }
  get details(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0) as FormGroup;
    return details
  }

  setMaritalStatusValue(status: string) {

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0) as FormGroup;

    if (status !== '2MRGSTS') {
      this.isMarried = false;
      details.removeControl('weddingAnniversaryDate');
    } else {
      this.isMarried = true;
      details.addControl('weddingAnniversaryDate', new FormControl('', Validators.required))
    }

    if(status === '1MRGSTS'){
      details.get('noOfChildrenDependant').clearValidators();
      details.get('noOfChildrenDependant').updateValueAndValidity();  
      const depValue = details.get('noOfChildrenDependant').value; 
      details.get('noOfChildrenDependant').setValue(depValue || null);

    }else{
      details.get('noOfChildrenDependant').setValidators(Validators.required);
      details.get('noOfChildrenDependant').updateValueAndValidity();
      
    }


  }

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identifyValue', value)
    if(value.event === 'init'){
      this.initUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    }
  }
}