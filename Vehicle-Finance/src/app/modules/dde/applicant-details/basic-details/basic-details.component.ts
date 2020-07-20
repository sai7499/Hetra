import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
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

@Component({
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css'],
})
export class BasicDetailsComponent implements OnInit {
  basicForm: FormGroup;
  isIndividual = false;
  isSelfEmployed = true;
  labels: any = {};
  validationData: any;
  LOV: any = [];
  applicantId: number;
  applicant: Applicant;
  leadId: number;
  showAge: any;
  initialAge: any;
  isSeniorCitizen: any = '0';
  isMinor: any = '0';
  gaurdianNamemandatory: any = {};
  checkingMinor: boolean;
  checkingSenior: boolean;
  mobilePhone: string;
  isDirty: boolean;
  public toDayDate: Date = new Date();
  isRequiredSpouse = 'Spouse Name is Required';
  isRequiredFather = 'Father Name is Required';
  validation: any;
  countryList = [];
  directorObject: any = [];
  isDirectorName: any;
  isDin: any = [];
  directorCount = 1;
  productCategory: string;
  fundingProgram: string;
  isChecked: boolean;
  ownerPropertyRelation : any;
  checkedBoxHouse : boolean;



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

  emailPattern = {
    rule: '^\\w+([.-]?\\w+)@\\w+([.-]?\\w+)(\\.\\w{2,10})+$',
    msg: 'Invalid email',
  };

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
  ) { }
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
    this.getLeadSectiondata();  // function call to get the required funding program and product category


    this.basicForm = new FormGroup({
      entity: new FormControl({ value: '', disabled: true }),
      bussinessEntityType: new FormControl('', Validators.required),
      applicantRelationshipWithLead: new FormControl('', Validators.required),
      title: new FormControl(''),
      details: new FormArray([]),
      directors: new FormArray([this.getDirectorsControls()]),


    });
    // this.addNonIndividualFormControls();
    //console.log('this.basicForm', this.basicForm)
    this.getLOV();
    this.getCountryList();

    const formArray = this.basicForm.get('details') as FormArray;
    this.validation = formArray.at(0);
    const details = formArray.at(0);
    details.patchValue({ preferredLanguage: 'ENGPRFLAN' });
    details.patchValue({ preferredLanguageCommunication: 'ENGPRFLAN' });

    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.applicantDataService.setApplicantId(this.applicantId);
    });
    this.leadId = (await this.getLeadId()) as number;
    console.log('leadId', this.leadId);
    if (this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP') {
      this.basicForm.get('title').setValidators([Validators.required]);
      this.eitherFather();
      this.eitherMother();
      this.eitherFathOrspouse();
    }

    console.log('basic form', this.basicForm.get('details'));

  }

  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    console.log('data-->', leadData);
    this.productCategory = leadData['leadDetails'].productId;
    this.fundingProgram = leadData['leadDetails'].fundingProgram;
    console.log('prod cat', this.productCategory);
    console.log('funding prgm cat', this.fundingProgram);
    // this.fundingProgram = '24';
    // this.productCategory = '1003';
  }
  // method for calculating annual income based on input monthy income

  calculateIncome(value) {
    const annualIncome = 12 * value;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.patchValue({
      annualIncomeAmount : annualIncome
    })
    
  }



  onOwnHouseAvailable(event){
    console.log('event', event)
   this.isChecked= event.target.checked;
   const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    if(this.isChecked=== true){
      
      details.get('houseOwnerProperty').setValidators([Validators.required]);
      details.get('ownHouseAppRelationship').setValidators([Validators.required]);
      details.get('houseOwnerProperty').updateValueAndValidity();
      details.get('ownHouseAppRelationship').updateValueAndValidity();
     
    }else{
      details.get('houseOwnerProperty').clearValidators();
      details.get('ownHouseAppRelationship').clearValidators();
      details.get('houseOwnerProperty').updateValueAndValidity();
      details.get('ownHouseAppRelationship').updateValueAndValidity();
    }
  }



  getCountryList() {
    this.applicantService.getCountryList().subscribe((res: any) => {
      // console.log('responce Country list', res)
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

  eitherFather() {
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
  }

  eitherMother() {
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
        console.log('value', value1);
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
          this.isRequiredSpouse = 'Spouse name is required';
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
        this.isRequiredFather = 'Father name is required';
        setTimeout(() => {
          details.get('fatherName').setValue(fatherName || null);
        });
      }
    });
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
    const convertDate = new Date(this.utilityService.getDateFromString(dob));
    const convertAge = new Date(convertDate);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.initialAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
    console.log('initially age', this.initialAge);

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    details.get('age').setValue(this.initialAge)
    this.checkingMinor = this.initialAge < 18;
    details.get('isMinor').setValue(this.checkingMinor);

    this.checkingSenior = this.initialAge > 70;
    details.get('isSeniorCitizen').setValue(this.checkingSenior);

    this.isMinor = this.checkingMinor == true ? '1' : '0';
    // console.log('isminor',details.get('isMinor').value)
    this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0';
    // console.log('issenior', this.isSeniorCitizen)
    this.setGaurdianFieldMandatory();
  }
  ageCalculation(event) {
    console.log('event', event);
    const value = event;

    const convertDate = new Date(this.utilityService.getNewDateFormat(value));
    const convertAge = new Date(convertDate);
    const timeDiff = Math.abs(Date.now() - convertAge.getTime());
    this.showAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365);
    console.log('showAge', this.showAge);

    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('age').setValue(this.showAge)

    this.checkingMinor = this.showAge < 18;
    details.get('isMinor').setValue(this.checkingMinor);

    this.checkingSenior = this.showAge > 70;
    details.get('isSeniorCitizen').setValue(this.checkingSenior);

    // this.basicForm
    //   .get('details')
    // ['controls'][0].get('isMinor').value = this.checkingMinor =
    //   this.showAge < 18 ? true : false;
    // this.basicForm
    //   .get('details')
    // ['controls'][0].get('isSeniorCitizen').value = this.checkingSenior =
    //   this.showAge > 70 ? true : false;

    // console.log(this.basicForm.get('details')['controls'][0].get('isMinor').value)
    // console.log(this.basicForm.get('details')['controls'][0].get('isSeniorCitizen').value)

    // this.checkMinorOrSenior(this.showAge)

    this.isSeniorCitizen = this.checkingSenior == true ? '1' : '0';
    this.isMinor = this.checkingMinor == true ? '1' : '0';

    this.setGaurdianFieldMandatory();
  }
  checkSenior(event) {
    if (event.target.checked && (this.showAge < 70 || this.initialAge < 70)) {
      event.target.checked = false;
    } else {
      event.target.checked = true;
    }
    if (event.target.checked == true) {
    }
  }

  checkMinor(event) {
    if (event.target.checked && (this.showAge > 18 || this.initialAge > 18)) {
      event.target.checked = false;
    } else {
      event.target.checked = true;
    }
    console.log();
  }

  setGaurdianFieldMandatory() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0) as FormGroup;
    if (details.get('isMinor').value) {
      console.log('isminorgaur', details.get('isMinor').value);
      details.addControl('minorGuardianName', new FormControl());
      details.addControl('minorGuardianRelation', new FormControl());
    } else {
      details.removeControl('minorGuardianName');
      details.removeControl('minorGuardianRelation');
    }
  }

  // onCheckSenior(event){
  //   if(event.target.checked && (this.showAge < 70 || this.initialageCal< 70)){
  //     event.target.checked= false;
  //    }
  //   else{event.target.checked = true;}
  // }

  setBasicData() {
    this.isIndividual =
      this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP';
    this.basicForm.patchValue({
      entity: this.applicant.applicantDetails.entityTypeKey,
      bussinessEntityType: this.applicant.applicantDetails.bussinessEntityType,
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
      // this.getDirectorsControls();
      this.setValuesForNonIndividual();
      setTimeout(() => {
        this.listerForDirectors();
      });

    }
    const dob = this.applicant.aboutIndivProspectDetails.dob;
    console.log('dob', dob);
    if (
      this.applicant.applicantDetails.entityTypeKey === 'INDIVENTTYP' &&
      dob !== null
    ) {
      this.initiallayAgecal(dob);
    }
    const applicantDetails = this.applicant.applicantDetails;
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);

    this.checkedBoxHouse= applicantDetails.ownHouseProofAvail=='1'? true : false;

    details.patchValue({
      name1: applicantDetails.name1,
      name2: applicantDetails.name2,
      name3: applicantDetails.name3,
      monthlyIncomeAmount: applicantDetails.monthlyIncomeAmount,
      annualIncomeAmount: applicantDetails.annualIncomeAmount,
      //ownHouseProofAvail: applicantDetails.ownHouseProofAvail,
      houseOwnerProperty: applicantDetails.houseOwnerProperty ||'',
      ownHouseAppRelationship: applicantDetails.ownHouseAppRelationship,
      averageBankBalance: applicantDetails.averageBankBalance,
      rtrType: applicantDetails.rtrType ||'',
      prevLoanAmount: applicantDetails.prevLoanAmount,
      loanTenorServiced: applicantDetails.loanTenorServiced,
      currentEMILoan: applicantDetails.currentEMILoan,
      agriNoOfAcres: applicantDetails.agriNoOfAcres,
      agriOwnerProperty: applicantDetails.agriOwnerProperty ||'',
      agriAppRelationship: applicantDetails.agriAppRelationship ||'',
      grossReceipt: applicantDetails.grossReceipt,
      //customerCategory: applicantDetails.customerCategory || ' ',
      custSegment: applicantDetails.custSegment || ' ',
    });
  }

  setValuesForIndividual() {
    const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
      ? this.applicant.aboutIndivProspectDetails
      : {};
    // console.log('aboutIndivProspectDetails', aboutIndivProspectDetails)
    this.showAge = aboutIndivProspectDetails.age;
    const mobile = aboutIndivProspectDetails.mobilePhone;
    if (mobile && mobile.length === 12) {
      this.mobilePhone = mobile.slice(2, 12);
    } else if (mobile && mobile.length === 10) {
      this.mobilePhone = mobile;
    }
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    const applicantDetails = this.applicant.applicantDetails;
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
      preferredLanguage: aboutIndivProspectDetails.preferredLanguage || '',
      occupation: aboutIndivProspectDetails.occupation || '',
      nationality: aboutIndivProspectDetails.nationality || '',
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
      // isSeniorCitizen: aboutIndivProspectDetails.isSeniorCitizen || '',
      // minorGuardianUcic: aboutIndivProspectDetails.minorGuardianUcic || '',
      designation: aboutIndivProspectDetails.designation || '',

      currentEmpYears: aboutIndivProspectDetails.currentEmpYears || '',
      department: aboutIndivProspectDetails.department || '',
      employerName: aboutIndivProspectDetails.employerName || '',

      // employerType : aboutIndivProspectDetails.employerType,
    });
  }

  setValuesForNonIndividual() {
    const applicantDetails = this.applicant.applicantDetails;
    this.basicForm.patchValue({ title: 'M/SSALUTATION' });
    const corporateProspectDetails = this.applicant.corporateProspectDetails;
    const directorDetails = this.applicant.directorDetails;
    const contactNumber = corporateProspectDetails.companyPhoneNumber;
    if (contactNumber && contactNumber.length == 12) {
      const contactSlice = contactNumber.slice(0, 2);
      // console.log('contactslice', contactSlice)
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
        corporateProspectDetails.preferredLanguageCommunication || '',
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

    const directorArray = this.applicant.directorDetails;
    const director = this.basicForm.get('directors') as FormArray;
    const directorValue = this.applicant.corporateProspectDetails.numberOfDirectors;

    if (directorValue >= 0) {
      
      //director.clear();
      this.addDirectorControls(directorValue);
      for (let i= 0 ; i< directorValue; i++){
        this.basicForm.get('directors')['controls'][i].get('directorName').setValidators([Validators.required]);
        this.basicForm.get('directors')['controls'][i].get('directorName').updateValueAndValidity();
        this.basicForm.get('directors')['controls'][i].get('din').setValidators([Validators.required]);
         this.basicForm.get('directors')['controls'][i].get('din').updateValueAndValidity();
       }
    }
    // director.controls= [];
    directorArray.forEach((value, index) => {
      // director.push(new FormGroup(
      //   {
      //     directorName: new FormControl(value.directorName),
      //     din: new FormControl(value.din)
      // }
      // ))
      // director.at(index).patchValue({
      //   directorName: value.directorName,
      //   din: value.din
      // })
      director.push(this.getDirectorsControls(value)) 

    })
  }

  addIndividualFormControls() {
    const formArray = this.basicForm.get('details') as FormArray;
    const controls = new FormGroup({
      name1: new FormControl(null, Validators.required),
      name2: new FormControl(null),
      name3: new FormControl(null, Validators.required),
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
      //customerCategory: new FormControl('', Validators.required),
      custSegment: new FormControl('', Validators.required),
      emailId: new FormControl(''),
      alternateEmailId: new FormControl(''),
      alternateMobileNumber: new FormControl(''),
      preferredLanguage: new FormControl('', Validators.required),
      politicallyExposedPerson: new FormControl(null, Validators.required),
      designation: new FormControl(''),
      employerName: new FormControl(null, Validators.required),
      currentEmpYears: new FormControl(null, Validators.required),
      employeeCode: new FormControl(null, Validators.required),
      employerType: new FormControl('', Validators.required),

      // added new form controls  on 16-07-2020
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


      // occupation: new FormControl(''),
      // customerCategory: new FormControl(null),
      // accountNumber: new FormControl(null),
      // accountBank: new FormControl(''),
      // branchAddress: new FormControl(null),
      // spokeAddress: new FormControl(null),
    });
    formArray.push(controls);
  }


  getDirectorsControls(data?) {
    data = data || {};
    console.log('data in dirtor control',data)
    return new FormGroup({
      directorName: new FormControl(),
      din: new FormControl()
    });
  }

  listerForDirectors() {
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('numberOfDirectors').valueChanges.subscribe((val) => {
     
      this.addDirectorControls(val)
      if(val!==''){
        console.log('valuessss', val)
        for (let i= 0 ; i< val; i++){
         this.basicForm.get('directors')['controls'][i].get('directorName').setValidators([Validators.required]);
         this.basicForm.get('directors')['controls'][i].get('directorName').updateValueAndValidity();
         this.basicForm.get('directors')['controls'][i].get('din').setValidators([Validators.required]);
         this.basicForm.get('directors')['controls'][i].get('din').updateValueAndValidity();
        }
       
     }
    })
  }


  addDirectorControls(value) {
    const director = this.basicForm.get('directors') as FormArray;
    if (value === '' || value == null) {

      // director.controls = [];
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
        // form.push(this.getDirectorsControls())
        console.log('value', form.at(i), 'index', i)
        form.removeAt(i);

      }
    }
    this.directorCount = directorValue;


  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => {
      this.LOV = lov;
      // console.log('lovs', this.LOV)
      this.ownerPropertyRelation=this.LOV.LOVS.applicantRelationshipWithLead.filter(data => data.value !== 'Guarantor')

      this.applicant = this.applicantDataService.getApplicant();
      console.log('DDE COMING APPLICANT DATAS ', this.applicant);
      this.setBasicData();
    });

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

  setDedupeValidators(){
    const formArray = this.basicForm.get('details') as FormArray;
    const details = formArray.at(0);
    if(this.productCategory=='1003' && (this.fundingProgram=='25' || this.fundingProgram=='24')){
        details.get('monthlyIncomeAmount').setValidators([Validators.required]);
        details.get('monthlyIncomeAmount').updateValueAndValidity();
        // details.get('annualIncomeAmount').setValidators([Validators.required]);
        // details.get('annualIncomeAmount').updateValueAndValidity();
    }
    
    if(this.productCategory=='1003' && this.fundingProgram=='27'){
      details.get('rtrType').setValidators([Validators.required]);
        details.get('rtrType').updateValueAndValidity();
        details.get('prevLoanAmount').setValidators([Validators.required]);
        details.get('prevLoanAmount').updateValueAndValidity();
        details.get('loanTenorServiced').setValidators([Validators.required]);
        details.get('loanTenorServiced').updateValueAndValidity();
        details.get('currentEMILoan').setValidators([Validators.required]);
        details.get('currentEMILoan').updateValueAndValidity();
    }
    if(this.productCategory=='1003' && this.fundingProgram=='29'){
      details.get('agriNoOfAcres').setValidators([Validators.required]);
      details.get('agriNoOfAcres').updateValueAndValidity();
      details.get('agriOwnerProperty').setValidators([Validators.required]);
      details.get('agriOwnerProperty').updateValueAndValidity();
      details.get('agriAppRelationship').setValidators([Validators.required]);
      details.get('agriAppRelationship').updateValueAndValidity();
      
    }
    if(this.productCategory=='1003' && this.fundingProgram=='30'){
      details.get('grossReceipt').setValidators([Validators.required]);
      details.get('grossReceipt').updateValueAndValidity();
     
    }
    
  }

  async onSubmit() {
    this.setDedupeValidators();
    const value = this.basicForm.getRawValue();
    this.isDirty = true;
    if (this.basicForm.invalid) {
      this.toasterService.showError(
        'Please fill all mandatory fields.',
        'Applicant Details'
      );
      console.log('details valid status', this.basicForm)
      return;
      
    }

    console.log('GETRAWVALUE', value);
    if (this.isIndividual) {
      this.storeIndividualValueInService(value);
    } else {
      this.storeNonIndividualValueInService(value);
    }

    const applicantData = this.applicantDataService.getApplicant();
    console.log('applicantData', applicantData);
    const leadId = (await this.getLeadId()) as number;
    console.log('LEADID', leadId);
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
      leadId: this.leadId,
    };

    this.applicantService.saveApplicant(data).subscribe((response: any) => {
      if (response.ProcessVariables.error.code === '0') {

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
    console.log('formValue', formValue);
    applicantDetails.name1 = formValue.name1;
    applicantDetails.name2 = formValue.name2 ? formValue.name2 : '';
    applicantDetails.name3 = formValue.name3 ? formValue.name3 : '';

    applicantDetails.monthlyIncomeAmount = formValue.monthlyIncomeAmount;
    applicantDetails.annualIncomeAmount = formValue.annualIncomeAmount;
    applicantDetails.ownHouseProofAvail = this.isChecked== true? '1' : '0',
    applicantDetails.houseOwnerProperty = formValue.houseOwnerProperty;
    applicantDetails.ownHouseAppRelationship = formValue.ownHouseAppRelationship;
    applicantDetails.averageBankBalance = formValue.averageBankBalance;
    applicantDetails.rtrType = formValue.rtrType;
    applicantDetails.prevLoanAmount = formValue.prevLoanAmount;
    applicantDetails.loanTenorServiced = formValue.loanTenorServiced;
    applicantDetails.currentEMILoan = formValue.currentEMILoan;
    applicantDetails.agriNoOfAcres = formValue.agriNoOfAcres;
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
      ? aboutIndivProspectDetails.spouseName
      : '';
    prospectDetails.preferredLanguage =
      aboutIndivProspectDetails.preferredLanguage;
    prospectDetails.designation = aboutIndivProspectDetails.designation;
    prospectDetails.currentEmpYears = aboutIndivProspectDetails.currentEmpYears
      ? aboutIndivProspectDetails.currentEmpYears
      : '';
    prospectDetails.employeeCode = aboutIndivProspectDetails.employeeCode
      ? aboutIndivProspectDetails.employeeCode
      : '';

    // prospectDetails.department = 'department';

    this.applicantDataService.setIndividualProspectDetails(prospectDetails);

    // this.applicantDataService.setIndividualProspectDetails(
    //   ProspectProfileDetails
    // );

    indivProspectProfileDetails.employerType = formValue.employerType
      ? formValue.employerType
      : '';
    indivProspectProfileDetails.employerName = formValue.employerName
      ? formValue.employerName
      : '';
    // console.log('indivProspectProfileDetails',indivProspectProfileDetails)
    this.applicantDataService.setindivProspectProfileDetails(
      indivProspectProfileDetails
    );
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

    applicantDetails.custSegment = formValue.custSegment;
    applicantDetails.monthlyIncomeAmount = formValue.monthlyIncomeAmount;
    applicantDetails.annualIncomeAmount = formValue.annualIncomeAmount;
    applicantDetails.ownHouseProofAvail = this.isChecked== true? '1' : '0',
    applicantDetails.houseOwnerProperty = formValue.houseOwnerProperty;
    applicantDetails.ownHouseAppRelationship = formValue.ownHouseAppRelationship;
    applicantDetails.averageBankBalance = formValue.averageBankBalance;
    applicantDetails.rtrType = formValue.rtrType;
    applicantDetails.prevLoanAmount = formValue.prevLoanAmount;
    applicantDetails.loanTenorServiced = formValue.loanTenorServiced;
    applicantDetails.currentEMILoan = formValue.currentEMILoan;
    applicantDetails.agriNoOfAcres = formValue.agriNoOfAcres;
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
    // console.log('itemsssss-->',items)
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
    this.location.back();
  }

  onNext() {
    this.router.navigate([
      `/pages/applicant-details/${this.leadId}/identity-details`,
      this.applicantId,
    ]);
  }

  onBackToApplicant() {
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }
}
