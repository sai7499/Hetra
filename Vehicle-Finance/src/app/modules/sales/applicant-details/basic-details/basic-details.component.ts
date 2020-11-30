import { Component, OnInit, ViewChild,  HostListener } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, formatDate } from '@angular/common';

import { LabelsService } from '@services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { LOVS, Item, LovList } from '@model/lov.model';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { UtilityService } from '@services/utility.service';
import {
  Applicant,
  ApplicantDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
} from '@model/applicant.model';
import { LeadStoreService } from '../../services/lead.store.service';
import { dateFieldName } from '@progress/kendo-angular-intl';
import { ToasterService } from '@services/toaster.service';
import { pairwise, distinctUntilChanged } from 'rxjs/operators';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { AgeValidationService } from '@services/age-validation.service';
import { ObjectComparisonService } from '@services/obj-compare.service';
@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual: boolean;
  isSelfEmployed = true;
  labels: any = {};
  validationData: any;
  applicantLov: any = [];
  applicantId: number | string = '';
  applicant: Applicant;
  showAge: number;

  isSeniorCitizen: any = '0';
  isMinor: any = '0';
 // gaurdianNamemandatory: any = {};
  checkingMinor: boolean;
  checkingSenior: boolean;

  isDirty: boolean;
  mobilePhone: any;
  countryList = [];
  leadId : number;
  mobileNumberChange: boolean;
  apiValue: any;
  finalValue: any;
  

  //imMinor : boolean= true
  // designation = [
  //   {
  //     key: 1,
  //     value: 'Salaried',
  //   },
  //   {
  //     key: 2,
  //     value: 'Self Employed',
  //   },
  // ];

  emailPattern = {
    rule: '^\\w+([.-]?\\w+)@\\w+([.-]?\\w+)(\\.\\w{2,10})+$',
    msg: 'Invalid email',
  };

  toDayDate: Date = new Date();
  setBirthDate : Date = new Date()
  public ageMinDate : Date = new Date()
  isRequiredSpouse = 'Spouse Name is Required';
  isRequiredFather = 'Father Name is Required';
  productCategory: string;
  fundingProgram: string;
  isChecked: boolean;
  ownerPropertyRelation: any;
  checkedBoxHouse: boolean;
  validation: any;
  custCatValue: string;
  ageOfSeniorCitizen = 65;
  applicantData = [];
  showNotApplicant : boolean;
  hideMsgForOwner: boolean = false;
  public maxAge: Date = new Date();
  public minAge: Date = new Date();
  isSave : boolean = false;


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
    private toasterService: ToasterService,
    private createLeadDataService: CreateLeadDataService,
    private ageValidationService: AgeValidationService,
    private objectComparisonService: ObjectComparisonService
  ) { 
    this.toDayDate= this.utilityService.setTimeForDates(this.toDayDate)
  }

  async ngOnInit() {
    
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );

    this.basicForm = new FormGroup({
      title: new FormControl(''),
      entity: new FormControl({ value: '', disabled: true }),
      bussinessEntityType: new FormControl('', Validators.required),
      applicantRelationshipWithLead: new FormControl(''),
      applicantRelationship: new FormControl('', Validators.required),
      details: new FormArray([]),
    });
    // this.setBirthDate.setFullYear(this.setBirthDate.getFullYear()-10)
    // this.ageMinDate.setFullYear(this.ageMinDate.getFullYear()-100)
    //this.addNonIndividualFormControls();
    this.getAgeValidation()
    this.getLeadSectiondata();
    this.getLovData();
    this.getCountryList();
    const formArray = this.basicForm.get('details') as FormArray;
    this.validation = formArray.at(0);
    this.leadId = (await this.getLeadId()) as number;
    //this.isSave=this.applicantDataService.getForSaveBasicDetails()

  }
  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData()
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
          this.minAge= this.utilityService.setTimeForDates(this.minAge)
          this.maxAge= this.utilityService.setTimeForDates(this.maxAge)
      }
    );
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
      const ownHouseAppRelationship= details.get('ownHouseAppRelationship').value
      details.patchValue({
        houseOwnerProperty : houseOwner,
        ownHouseAppRelationship : ownHouseAppRelationship
      })

    } else {
      this.hideMsgForOwner = false;
      details.get('houseOwnerProperty').clearValidators();
      details.get('ownHouseAppRelationship').clearValidators();
      details.get('houseOwnerProperty').updateValueAndValidity();
      details.get('ownHouseAppRelationship').updateValueAndValidity();
      details.patchValue({
        houseOwnerProperty : '',
        ownHouseAppRelationship : ''
      })
    }
  }

  clearFatherOrSpouseValidation() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const fatherName = details.get('fatherName').value;
    const spouseName = details.get('spouseName').value;
    if (fatherName) {
      details.get('spouseName').clearValidators();
      details.get('spouseName').updateValueAndValidity();
      this.isRequiredSpouse = '';
      // const spouseName= details.get('spouseName').value || null;
      setTimeout(() => {
        details.get('spouseName').setValue(spouseName || null);
      });
    }
    if (spouseName) {
      details.get('fatherName').clearValidators();
      details.get('fatherName').updateValueAndValidity();
      this.isRequiredFather = '';
      //const fatherName= details.get('fatherName').value || null;
      setTimeout(() => {
        details.get('fatherName').setValue(fatherName || null);
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
        if (fatherName == value1) {
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
        } 
        else {
          details.get('spouseName').setValidators([Validators.required]);
          details.get('spouseName').updateValueAndValidity();
          this.isRequiredSpouse = 'Spouse Name is Required';
          //const spouseName= details.get('spouseName').value || null;
          setTimeout(() => {
            details.get('spouseName').setValue(spouseName || null);
          });
        }
      });
      

    details.get('spouseName').valueChanges
    .subscribe((value) => {
      if (spouseName == value) {
        return;
      }
      spouseName = value;
      if (value) {
        details.get('fatherName').clearValidators();
        details.get('fatherName').updateValueAndValidity();
        this.isRequiredFather = '';
        //const fatherName= details.get('fatherName').value || null;
        setTimeout(() => {
          details.get('fatherName').setValue(fatherName || null);
        });
      } 
      else {
        details.get('fatherName').setValidators([Validators.required]);
        details.get('fatherName').updateValueAndValidity();
        this.isRequiredFather = 'Father Name is Required';
        setTimeout(() => {
          details.get('fatherName').setValue(fatherName || null);
        });
      }
    });
  }

  getApplicantDetails() {

    this.applicant = this.applicantDataService.getApplicant();
    this.setBasicData();
    if(this.applicant.ucic){
      if(this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP'){
         this.disableUCICIndividualDetails();
      }else{
        this.disableUCICNonIndividualDetails();
      }
    }
    if(this.applicant.ekycDone=='1'){
      if(this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP'){
        this.disableEKYDetails();
      }
    }
  }

  disableEKYDetails(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const applicantDetails = this.applicant.applicantDetails;
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails;
    applicantDetails.name1? details.get('name1').disable() : details.get('name1').enable();
    details.get('name2').disable() ;
    applicantDetails.name3 ? details.get('name3').disable() : details.get('name3').enable();
    aboutIndivProspectDetails.dob? details.get('dob').disable() : details.get('dob').enable();
    aboutIndivProspectDetails.gender ? details.get('gender').disable() :  details.get('gender').enable() ;
  }

  disableUCICIndividualDetails(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('name1').disable();
    details.get('name2').disable();
    details.get('name3').disable();
    details.get('dob').disable();
    details.get('mobilePhone').disable();
    details.get('gender').disable();

  }
  disableUCICNonIndividualDetails(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('name1').disable();
    details.get('name2').disable();
    details.get('name3').disable();
    details.get('dateOfIncorporation').disable();
    details.get('companyPhoneNumber').disable();
  }
  initiallayAgecal(dob) {
    const convertDate = new Date(this.utilityService.getDateFromString(dob));
    const convertAge = new Date(convertDate);
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
    if (event.target.checked && (this.showAge <= this.ageOfSeniorCitizen )) {
      event.target.checked = false;
    } else {
      event.target.checked = true;
    }
    // if (event.target.checked == true) {
    // }
  }

  checkMinor(event) {
    if (event.target.checked && (this.showAge > 18 )) {
      event.target.checked = false;
    } else {
      event.target.checked = true;
    }
  }

  // @HostListener('change') ngOnChanges($event) {
  //   this.isSave = false;
  // }

  // @HostListener('keydown', ['$event'])

  // onkeyup(event) {
  //   this.isSave = false;
  // }

  onCustCategoryChanged(event) {
    this.custCatValue = event.target.value;
    if (this.custCatValue == 'SEMCUSTSEG') {
      this.ageOfSeniorCitizen = 65;

      this.checkingSenior = this.showAge >= this.ageOfSeniorCitizen;
      const formArray = this.basicForm.get('details') as FormArray;
      const details = formArray.at(0);
      details.get('isSeniorCitizen').setValue(this.checkingSenior);

      this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0';

      
    } else {
      this.ageOfSeniorCitizen = 60
      this.checkingSenior = this.showAge >= this.ageOfSeniorCitizen;
      const formArray = this.basicForm.get('details') as FormArray;
      const details = formArray.at(0);
      details.get('isSeniorCitizen').setValue(this.checkingSenior);

      this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0';
      
    }
  }

  setBasicData() {
    this.isIndividual =
      this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP';
    const dob = this.applicant.aboutIndivProspectDetails.dob;

    // this.clearFormArray();
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      applicantRelationshipWithLead:
        this.applicant.applicantDetails.applicantTypeKey || '',
      title: this.applicant.applicantDetails.title || '',
      bussinessEntityType:
        this.applicant.applicantDetails.bussinessEntityType || '',
      applicantRelationship: this.applicant.aboutIndivProspectDetails.relationWithApplicant || ''
    });
    const applicantDetails = this.applicant.applicantDetails;
  
    this.custCatValue = applicantDetails.custSegment;
    this.ageOfSeniorCitizen= this.custCatValue !== "SEMCUSTSEG"? 60 : 65;
    if (this.isIndividual) {
      this.clearFormArray();
      this.addIndividualFormControls();
      this.setValuesForIndividual();
      this.initiallayAgecal(dob);
      


    } else {
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
      this.removeApplicantRelationControl();
    }

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    if( applicantDetails.ownHouseProofAvail=='1'){
      this.checkedBoxHouse = true;
      this.isChecked= true;
      this.hideMsgForOwner = true;
    }else{
      this.checkedBoxHouse = false;
      this.isChecked= false;
      this.hideMsgForOwner = false;
    }

    // this.checkedBoxHouse = applicantDetails.ownHouseProofAvail == '1' ? true : false;
    // this.isChecked= applicantDetails.ownHouseProofAvail == '1' ? true : false;

    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,

      //customerCategory: applicantDetails.customerCategory || '',
      custSegment: applicantDetails.custSegment || '',
      monthlyIncomeAmount: applicantDetails.monthlyIncomeAmount,
      annualIncomeAmount: applicantDetails.annualIncomeAmount,

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
    });
    //console.log('this.basicForm.value', this.basicForm.value)
    this.apiValue = this.basicForm.getRawValue();
    if (this.isIndividual){
      const dob= this.basicForm.getRawValue().details[0].dob
      this.apiValue.details[0].dob=this.utilityService.getDateFormat(dob)
    }else{
      const doc=this.basicForm.getRawValue().details[0].dateOfIncorporation;
       this.apiValue.details[0].dateOfIncorporation=this.utilityService.getDateFormat(doc)
    }
    
  }

  removeApplicantRelationControl() {
    this.basicForm.removeControl('applicantRelationship');
  }

  

  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
      ? this.applicant.aboutIndivProspectDetails
      : {};
    this.basicForm.get('title').setValidators([Validators.required]);
    this.basicForm.get('bussinessEntityType').clearValidators();
    this.basicForm.updateValueAndValidity();
    //this.showAge = aboutIndivProspectDetails.age;
    const mobile = aboutIndivProspectDetails.mobilePhone;
    if (mobile && mobile.length == 12) {
      this.mobilePhone = mobile.slice(2, 12);
    } else if (mobile && mobile.length == 10) {
      this.mobilePhone = mobile;
    }
  


    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      emailId: aboutIndivProspectDetails.emailId || '',
      alternateEmailId: aboutIndivProspectDetails.alternateEmailId || '',
      mobilePhone: this.mobilePhone,
      dob:
        this.utilityService.getDateFromString(aboutIndivProspectDetails.dob) ||
        new Date(),
      minorGuardianName: aboutIndivProspectDetails.minorGuardianName || '',
      fatherName: aboutIndivProspectDetails.fatherName || '',
      spouseName: aboutIndivProspectDetails.spouseName || '',
      motherMaidenName: aboutIndivProspectDetails.motherMaidenName || '',
      preferredLanguage: aboutIndivProspectDetails.preferredLanguage || 'ENGPRFLAN',
      occupation: aboutIndivProspectDetails.occupation || '',
      nationality: aboutIndivProspectDetails.nationality || 'INDNATIONALITY',
      age: this.showAge,
      gender: aboutIndivProspectDetails.gender || '',
      politicallyExposedPerson:
        aboutIndivProspectDetails.politicallyExposedPerson || '',
      alternateMobileNumber:
        aboutIndivProspectDetails.alternateMobileNumber || '',
      minorGuardianRelation:
        aboutIndivProspectDetails.minorGuardianRelation || '',
      recommendations: aboutIndivProspectDetails.recommendations || ''
    });

   
    // this.clearFatherOrSpouseValidation();
    // this.eitherFathOrspouse();
    this.listenerForMobilechange()
  }

  setValuesForNonIndividual() {
    const applicantDetails = this.applicant.applicantDetails;
    this.basicForm.patchValue({ title: 'M/SSALUTATION' });
    const corporateProspectDetails = this.applicant.corporateProspectDetails
      ? this.applicant.corporateProspectDetails
      : {};
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
    details.patchValue({
      // name1: applicantDetails.name1,
      // name2: applicantDetails.name2,
      // name3: applicantDetails.name3,
      companyEmailId: corporateProspectDetails.companyEmailId || '',
      alternateEmailId: corporateProspectDetails.alternateEmailId || '',
      numberOfDirectors: corporateProspectDetails.numberOfDirectors || '',
      dateOfIncorporation:
        this.utilityService.getDateFromString(
          corporateProspectDetails.dateOfIncorporation
        ) || '',
      contactPerson: corporateProspectDetails.contactPerson || '',
      companyPhoneNumber: this.mobilePhone || '',
      countryOfCorporation: corporateProspectDetails.countryOfCorporation || '',
      businessType: corporateProspectDetails.businessType || '',
      //industry : corporateProspectDetails.industry || '',
      alternateContactNumber:
        corporateProspectDetails.alternateContactNumber || '',
      contactPersonDesignation:
        corporateProspectDetails.contactPersonDesignation || '',
      preferredLanguageCommunication:
        corporateProspectDetails.preferredLanguageCommunication || 'ENGPRFLAN',
    });
    this.listenerCompanyNumberChange()
  }

  clearFormArray() {
    const formArray = this.basicForm.get('details') as FormArray;
    formArray.clear();
  }

  listenerForMobilechange(){
      const formArray= this.basicForm.get('details') as FormArray;
      const details = formArray.at(0)
      details.get('mobilePhone').valueChanges.subscribe((value)=>{
        if(!details.get('mobilePhone').invalid){
          if(value!==this.mobilePhone){
            this.mobileNumberChange= true;
          }else{
            this.mobileNumberChange= false;
          }
        }
      })
  }

  listenerCompanyNumberChange(){
    const formArray= this.basicForm.get('details') as FormArray;
    const details = formArray.at(0)
    details.get('companyPhoneNumber').valueChanges.subscribe((value)=>{
      if(!details.get('companyPhoneNumber').invalid){
        if(value!==this.mobilePhone){
          this.mobileNumberChange= true;
        }else{
          this.mobileNumberChange= false;
        }
      }
    })
  }

  getLovData() {
    this.lovService.getLovData().subscribe((value: LovList) => {
      this.applicantLov = value.LOVS;
      this.ownerPropertyRelation = this.applicantLov.applicantRelationshipWithLead.filter(data => data.value !== 'Guarantor')

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
      name3: new FormControl('', Validators.required),
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

      fatherName: new FormControl(''),
      spouseName: new FormControl(''),

      motherMaidenName: new FormControl('', Validators.required),
      occupation: new FormControl({ value: '' }, Validators.required),
      nationality: new FormControl('', Validators.required),

      emailId: new FormControl(''),
      alternateEmailId: new FormControl(''),
      preferredLanguage: new FormControl('', Validators.required),
      politicallyExposedPerson: new FormControl(null, Validators.required),
      //customerCategory: new FormControl('', Validators.required),
      custSegment: new FormControl('', Validators.required),
      monthlyIncomeAmount: new FormControl(''),
      annualIncomeAmount: new FormControl(''),
      ownHouseProofAvail: new FormControl(''),
      houseOwnerProperty: new FormControl(''),
      ownHouseAppRelationship: new FormControl(''),
      averageBankBalance: new FormControl(''),
      rtrType: new FormControl(''),
      prevLoanAmount: new FormControl(''),
      loanTenorServiced: new FormControl(''),
      currentEMILoan: new FormControl(''),
      agriNoOfAcres: new FormControl(''),
      agriOwnerProperty: new FormControl(''),
      agriAppRelationship: new FormControl(''),
      grossReceipt: new FormControl(''),

      //new formcontrol added for new fields
      recommendations: new FormControl('')
    });

    formArray.push(controls);
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

  addNonIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null, Validators.required),
      name2: new FormControl(null),
      name3: new FormControl(null),
      dateOfIncorporation: new FormControl(null, Validators.required),
      contactPerson: new FormControl(null, Validators.required),
      companyPhoneNumber: new FormControl(null, Validators.required),
      countryOfCorporation: new FormControl(null, Validators.required),
      businessType: new FormControl('', Validators.required),
      //industry: new FormControl(''),
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
      //custSegment: new FormControl('', Validators.required),
      monthlyIncomeAmount: new FormControl(''),
      annualIncomeAmount: new FormControl(''),
      ownHouseProofAvail: new FormControl(''),
      houseOwnerProperty: new FormControl(''),
      ownHouseAppRelationship: new FormControl(''),
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

  // onIndividualChange(event) {
  //   //console.log('OnIndividdaulevent',event )
  //   if (!event) {
  //     return;
  //   }
  //   const value = event.key;
  //   this.isIndividual = value === 'INDIVENTTYP';
  //   const formArray = this.basicForm.get('details') as FormArray;
  //   formArray.clear();
  //   this.isIndividual
  //     ? this.addIndividualFormControls()
  //     : this.addNonIndividualFormControls();
  // }

  async onSave() {
    this.setFormsValidators();
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    if(this.hideMsgForOwner){
      const houseOwner = details.get('houseOwnerProperty').value;
      const ownHouseAppRelationship= details.get('ownHouseAppRelationship').value
      details.patchValue({
        houseOwnerProperty : houseOwner,
        ownHouseAppRelationship : ownHouseAppRelationship
      })
    }
    this.isDirty = true;
   
    if (this.basicForm.invalid) {
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

    const rawValue = this.basicForm.getRawValue();
    if (this.isIndividual) {
      const fatherName= details.get('fatherName').value
      const spouseName= details.get('spouseName').value
      if(!fatherName && !spouseName){
        this.toasterService.showInfo(
          'Please enter either father name or spouse name',
          ''
        );
        return;
      }
      this.storeIndividualValueInService(rawValue);
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
      this.storeNonIndividualValueInService(rawValue);
      this.applicantDataService.setIndividualProspectDetails(null);
    }

    //  if(){

    const applicantData = this.applicantDataService.getApplicant();
    const leadId = (await this.getLeadId()) as number;
    this.leadId=leadId;


    const data = {
      applicantId: this.applicantId,
      ...applicantData,
      leadId,
    };
    this.applicantService.saveApplicant(data).subscribe((res: any) => {
      if (res.ProcessVariables.error.code === '0') {
        // this.router.navigate([
        //   `/pages/sales-applicant-details/${leadId}/identity-details`,
        //   this.applicantId,
        // ]);
        // this.isSave= true;
        // this.applicantDataService.setForSaveBasicDetails(true);
        this.toasterService.showSuccess(
          'Record Saved Successfully',
          ''
        );
        this.apiValue=this.basicForm.getRawValue();
        if(this.isIndividual){
          const dob= this.basicForm.getRawValue().details[0].dob
          this.apiValue.details[0].dob=this.utilityService.getDateFormat(dob)
        }else{
          const doc=this.basicForm.getRawValue().details[0].dateOfIncorporation;
          this.apiValue.details[0].dateOfIncorporation=this.utilityService.getDateFormat(doc)
        }
      }else{
        this.toasterService.showError(
          res.ProcessVariables.error.message,
          'Applicant Details'
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
  setFormsValidators() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    if (this.productCategory == '1003' && (this.fundingProgram == '25' || this.fundingProgram == '24')) {
      details.get('monthlyIncomeAmount').setValidators([Validators.required]);
      details.get('monthlyIncomeAmount').updateValueAndValidity();
      // details.get('annualIncomeAmount').setValidators([Validators.required]);
      // details.get('annualIncomeAmount').updateValueAndValidity();
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


  storeIndividualValueInService(value) {
    const prospectDetails: IndividualProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};
    const formValue = value.details[0];
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2 ? formValue.name2 : '';
    applicantDetails.name3 = formValue.name3 ? formValue.name3 : '';
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.title = value.title;
    applicantDetails.entityType = value.entity;
    //applicantDetails.customerCategory = formValue.customerCategory || '';
    applicantDetails.custSegment = formValue.custSegment || '';
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


    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.emailId = formValue.emailId ? formValue.emailId : '';
    prospectDetails.alternateEmailId = formValue.alternateEmailId
      ? formValue.alternateEmailId
      : '';
    prospectDetails.mobilePhone = formValue.mobilePhone
      ? `91${formValue.mobilePhone}`
      : '';
    prospectDetails.dob = this.utilityService.getDateFormat(formValue.dob);
    prospectDetails.minorGuardianName = formValue.minorGuardianName
      ? formValue.minorGuardianName
      : '';
    prospectDetails.fatherName = formValue.fatherName
      ? formValue.fatherName
      : '';
    prospectDetails.spouseName = formValue.spouseName
      ? formValue.spouseName
      : '';
    prospectDetails.motherMaidenName = formValue.motherMaidenName;
    prospectDetails.occupation = formValue.occupation;
    prospectDetails.nationality = formValue.nationality;
    prospectDetails.preferredLanguage = formValue.preferredLanguage;

    prospectDetails.age = Number(this.showAge);
    prospectDetails.gender = formValue.gender || '';
    prospectDetails.minorGuardianRelation =
      formValue.minorGuardianRelation || '';
    prospectDetails.alternateMobileNumber = formValue.alternateMobileNumber
      ? formValue.alternateMobileNumber
      : '';
    prospectDetails.politicallyExposedPerson =
      formValue.politicallyExposedPerson;
    prospectDetails.isSeniorCitizen = this.isSeniorCitizen;
    prospectDetails.isMinor = this.isMinor;

    //adding new fields
    prospectDetails.relationWithApplicant = value.applicantRelationship || '';
    prospectDetails.recommendations = formValue.recommendations || '';

    this.applicantDataService.setIndividualProspectDetails(prospectDetails);
  }

  storeNonIndividualValueInService(value) {
    const prospectDetails: CorporateProspectDetails = {};
    const applicantDetails: ApplicantDetails = {};

    const formValue = value.details[0];

    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2 ? formValue.name2 : '';
    applicantDetails.name3 = formValue.name3 ? formValue.name3 : '';
    applicantDetails.loanApplicationRelation =
      value.applicantRelationshipWithLead;
    applicantDetails.title = formValue.title;
    applicantDetails.entityType = value.entity;
    applicantDetails.bussinessEntityType = value.bussinessEntityType;

   // applicantDetails.custSegment = formValue.custSegment;
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

    //applicantDetails.customerCategory = formValue.customerCategory;

    this.applicantDataService.setApplicantDetails(applicantDetails);

    prospectDetails.dateOfIncorporation = this.utilityService.getDateFormat(
      formValue.dateOfIncorporation
    );
    prospectDetails.contactPerson = formValue.contactPerson;
    prospectDetails.companyPhoneNumber = formValue.companyPhoneNumber;
    prospectDetails.countryOfCorporation = formValue.countryOfCorporation;
    prospectDetails.businessType = formValue.businessType;
    //prospectDetails.industry = formValue.industry;
    prospectDetails.companyEmailId = formValue.companyEmailId;
    prospectDetails.alternateEmailId = formValue.alternateEmailId;
    prospectDetails.alternateContactNumber = formValue.alternateContactNumber;
    prospectDetails.preferredLanguageCommunication =
      formValue.preferredLanguageCommunication;
    prospectDetails.contactPersonDesignation =
      formValue.contactPersonDesignation;
    prospectDetails.numberOfDirectors = formValue.numberOfDirectors ? Number(formValue.numberOfDirectors) : 0;

    this.applicantDataService.setCorporateProspectDetails(prospectDetails);
  }

  onBack() {
    //this.location.back();
    this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`)
  }

  onNext() {
      this.finalValue = this.basicForm.getRawValue();
      //console.log('basicFrm',this.basicForm.value)
      if (this.isIndividual){
        // if(this.applicant.ucic){
        //   this.finalValue.details[0].name1=this.apiValue.details[0].name1
        //   this.finalValue.details[0].name2=this.apiValue.details[0].name2
        //   this.finalValue.details[0].name3=this.apiValue.details[0].name3
        //   this.finalValue.details[0].mobilePhone=this.apiValue.details[0].mobilePhone
        //   this.finalValue.details[0].dob=this.apiValue.details[0].dob
        //   this.finalValue.details[0].gender=this.apiValue.details[0].gender
        // }
        const dob= this.basicForm.getRawValue().details[0].dob
        this.finalValue.details[0].dob=this.utilityService.getDateFormat(dob)
      }else{
        // if(this.applicant.ucic){
        //   this.finalValue.details[0].name1=this.apiValue.details[0].name1
        //   this.finalValue.details[0].name2=this.apiValue.details[0].name2
        //   this.finalValue.details[0].name3=this.apiValue.details[0].name3
        //   this.finalValue.details[0].companyPhoneNumber=this.apiValue.details[0].companyPhoneNumber
        //   this.finalValue.details[0].dateOfIncorporation=this.apiValue.details[0].dateOfIncorporation
        // }
       
        const doc=this.basicForm.getRawValue().details[0].dateOfIncorporation;
        this.finalValue.details[0].dateOfIncorporation=this.utilityService.getDateFormat(doc)
      }
      // console.log(JSON.stringify(this.apiValue));
      //  console.log(JSON.stringify(this.finalValue));
      // console.log(this.objectComparisonService.compare(this.apiValue, this.finalValue));

      const isValueCheck=this.objectComparisonService.compare(this.apiValue, this.finalValue)
      if(this.basicForm.invalid){
        this.toasterService.showInfo('Please SAVE details before proceeding', '');
        return;
      }
      if(!isValueCheck){
        this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
        return;
      }
    
      
      if(this.mobileNumberChange){
        this.router.navigateByUrl(
          `/pages/lead-section/${this.leadId}/otp-section/${this.applicantId}`
        );
      }
      else{
        this.router.navigateByUrl(
          `/pages/sales-applicant-details/${this.leadId}/identity-details/${this.applicantId}`
        );
      }
    }
      
     
  
}
