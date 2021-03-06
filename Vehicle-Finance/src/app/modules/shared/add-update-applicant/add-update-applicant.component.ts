
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Component, OnInit, OnChanges, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UtilityService } from '@services/utility.service';
import { SalesDedupeService } from '@services/sales-dedupe.service';
import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LeadStoreService } from '@services/lead-store.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { ApplicantService } from '@services/applicant.service';
import { formatDate, Location } from '@angular/common';

import { ViewChild, ElementRef, } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AgeValidationService } from '@services/age-validation.service';
import { ObjectComparisonService } from '@services/obj-compare.service';

const { Modals } = Plugins;


import {
  Applicant,
  ApplicantDetails,
  AddressDetails,
  IndivIdentityInfoDetails,
  IndivProspectProfileDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
  DirectorDetails,
} from '@model/applicant.model';
import { Constant } from '@assets/constants/constant';
import { map } from 'rxjs/operators';
import { ToasterService } from '@services/toaster.service';
import { Subscription } from 'rxjs';
import { ready } from 'jquery';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

import { environment } from 'src/environments/environment';
import { BiometricService } from '@services/biometric.service';

declare var identi5: any;


@Component({
  selector: 'app-add-update-applicant',
  templateUrl: './add-update-applicant.component.html',
  styleUrls: ['./add-update-applicant.component.css'],
})
export class AddOrUpdateApplicantComponent implements OnInit {
  isEnableDedupe: boolean;
  showNegativeListModal: boolean;
  negativeModalInput: {
    isNLFound?: boolean;
    isNLTRFound?: boolean;
    nlRemarks?: string;
    nlTrRemarks?: string;
  };

  panRequired: boolean;

  isMobileChanged: boolean = false;
  isName1Changed: boolean = false;
  isPanChanged: boolean = false;
  isAadharChanged: boolean = false;
  isPassportChanged: boolean = false;
  isDrivingLicenseChanged: boolean = false;
  isVoterIdChanged: boolean = false;

  isContactNumberChanged: boolean = false;
  isCinNumberChanged: boolean = false;
  isCstNumberChanged: boolean = false;
  isGstNumberChanged: boolean = false;
  isTanNumberChanged: boolean = false;
  isUdhyogChanged: boolean = false;

  firstName: string;
  mobileNumber: string;
  mobile: string;
  aadhar: string;
  drivingLicenseNumber: string;
  passportNumber: string;
  pan: string;
  drivingLicenseIssueDate: any;
  drivingLicenseExpiryDate: any;
  passportIssueDate: any;
  passportExpiryDate: any;
  voterIdNumber: string;
  isPermanantAddressSame: boolean;
  isRegAddressSame: boolean;
  showDedupeModal: boolean;
  isDirty: boolean;
  isDirtyUcic: boolean;

  tanNumber: string;
  contactNumber: string;
  corporateIdentificationNumber: string;
  cstVatNumber: string;
  gstNumber: string;

  toDayDate: Date = new Date();
  setBirthDate: Date = new Date();
  ageMinDate: Date = new Date();
  isAlertSuccess: boolean = true;
  isAlertDanger: boolean = true;

  defaultExpiryDate: Date = new Date()
  mandatory: any = {};
  expiryMandatory: any = {};
  productCategory: string;
  fundingProgram: string;
  isChecked: boolean;
  ownerPropertyRelation: any;
  checkedBoxHouse: boolean;
  savedChecking: boolean = false;
  dedupeMobile: boolean = false;
  dedupeContactNumber: boolean = false;
  showApplicantAddCheckBox: boolean;
  leadAddressDetails = [];
  checkedAddressLead = '0';
  values: any = [];
  labels: any = {};
  validationData: any;

  LOV: any = [];
  coApplicantForm: FormGroup;
  isCurrAddSameAsPermAdd: any = '0';
  isCommAddSameAsRegAdd: any = '0';
  applicantId: number;
  applicant: Applicant;
  selectedApplicant: number;
  isMandatory: boolean;
  pincodeResult: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };

  applicantType = Constant.ENTITY_INDIVIDUAL_TYPE;
  public maxAge: Date = new Date();
  public minAge: Date = new Date();

  panValue = '1PANTYPE';
  leadId: number;
  applicantDetails: ApplicantDetails;
  permanentPincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };
  currentPincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };
  registerPincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };
  communicationPincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };

  aboutIndivProspectDetails: IndividualProspectDetails;

  indivIdentityInfoDetails: IndivIdentityInfoDetails;

  indivProspectProfileDetails: IndivProspectProfileDetails;

  corporateProspectDetails: CorporateProspectDetails;

  addressDetails: AddressDetails[];

  directorDetails: DirectorDetails[];
  isPanDisabled: boolean;
  Licensemessage: string;
  passportMandatory: any = {};
  isPassportRequired: boolean;
  isVoterRequired: boolean;

  voterIdListener: Subscription;
  passportListener: Subscription;
  isVoterFirst = true;
  isPassportFirst = true;
  isDisabledCheckbox: boolean = false;
  addDisabledCheckBox: boolean;
  panValidate = false;
  showEkycbutton = false;
  showMessage: any = {
    passportExpiry: false,
    passportIssue: false,
    drivingLicenseExpiry: false,
    drivinglicenseIssue: false
  };
  disabledDrivingDates = true;
  disabledPassportDates = true;
  showModifyCurrCheckBox: boolean;
  showSrField: boolean;
  checkedModifyCurrent: boolean;
  SelectDate: string = 'Select Date';
  applicantData = [];
  applicationRelationWithLead = [];
  showNotApplicant = false;
  dedupeVaribales: any;
  referenceAdharNo: string;
  SRNumberValidate: boolean = true;
  storeAdharValue: any;
  hideMsgForOwner: boolean = false;
  storeAdharFlag: boolean = false;
  eKYCChecked: boolean = false;
  ekycDone: string = '0';
  ekycBuutonAdharBased: boolean = false;
  apiReferenceNo: string;
  backupRefNo: string;
  gender: any;
  storeSRNumber: string;
  successSR: boolean = false;
  failureSR: boolean = false;
  validateSrBoolean: boolean;
  successSrValue: string;
  listening: boolean = false;
  individualDatas: any[] = [];
  permenantAddDatas: any[] = [];
  currentAddDatas: any[] = [];
  nonIndividualDatas: any[] = [];
  regiesterAddDatas: any[] = [];
  communicationAddDatas: any[] = [];

  lastName: string;
  apiValue: any;
  finalValue: any;
  apiAddressLeadCheckBox: any = '0';
  apiCurrentCheckBox: any = '0';
  isExtCustValueChange: boolean = false;
  maxPassportExpiryDate: Date;
  minPassportIssueDate: Date = new Date();
  passportIssueInvalidMsg: string = "Invalid Date"
  passportExpiryInvalidMsg: string = "Invalid Date";
  drivingIssueInvalidMsg: string = "Invalid Date"
  drivingExpiryInvalidMsg: string = "Invalid Date";

  maxDate: Date = new Date();
  minDrivingExpiryDate: Date = new Date();

  isMobile: any;

  @ViewChild('pTag', { static: false }) pTag: ElementRef<HTMLElement>;

  // User defined Fields
  udfScreenId: string = 'APS002';
  udfGroupId: string = 'APG002';

  applicantDedupeUdfScreenId: string  = 'APS003';
  applicantDedupeUGroupId: string = 'APG003';

  negativeDedupeUdfScreenId: string  = '';
  negativeDedupeUGroupId: string = 'APG004';

  constructor(
    private labelsData: LabelsService,
    private lovData: LovDataService,
    private commomLovService: CommomLovService,
    private leadStoreService: LeadStoreService,
    private activatedRoute: ActivatedRoute,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private utilityService: UtilityService,
    private router: Router,
    private location: Location,
    private salesDedupeService: SalesDedupeService,
    private toasterService: ToasterService,
    private createLeadDataService: CreateLeadDataService,
    private biometricService: BiometricService,
    private ngxService: NgxUiLoaderService,
    private ageValidationService: AgeValidationService,
    private objectComparisonService: ObjectComparisonService

  ) {

    this.toDayDate = this.utilityService.setTimeForDates(this.toDayDate)

    this.minPassportIssueDate.setFullYear(this.minPassportIssueDate.getFullYear() - 10)
    this.minPassportIssueDate.setDate(this.minPassportIssueDate.getDate() + 1)
    this.minPassportIssueDate = this.utilityService.setTimeForDates(this.minPassportIssueDate)

    this.maxDate.setDate(this.maxDate.getDate() - 1)
    this.maxDate = this.utilityService.setTimeForDates(this.maxDate)

  }

  // setTimeForDates(value){
  //   var date = value.getDate()
  //   var month = value.getMonth()
  //   var year = value.getFullYear()
  //   return new Date(year, month, date, 0 , 0)
  // }

  async ngOnInit() {
    this.leadId = this.activatedRoute.snapshot.params['leadId'];
    this.isMobile = environment.isMobile;
    this.initForm();
    // if (this.leadId) {
    this.getAgeValidation()
    setTimeout(async () => {
      const gotLeadData = this.activatedRoute.snapshot.data.leadData;
      if (gotLeadData.Error === '0') {
        const leadData = gotLeadData.ProcessVariables;
        this.createLeadDataService.setLeadSectionData(leadData);
        //this.leadStoreService.setLeadCreation(leadData);
      }
      this.getLeadSectiondata();
      // }
      this.lovData.getLovData().subscribe((res: any) => {
        this.values = res[0].addApplicant[0];
      });
      this.leadId = (await this.getLeadId()) as number;
      if (!this.leadId) {
        const id: any = await this.getLeadIdAndApplicantId();
        this.leadId = id.leadId;
        this.applicantId = id.applicantId;
        if (isNaN(this.applicantId)) {
          this.applicantId = null;
        }
        const dedupeFlag = this.applicantDataService.getDedupeFlag()
        if (this.applicantId && !dedupeFlag) {
          this.isEnableDedupe = false;
          this.getApplicantDetails();
          this.storeAdharValue = '';

        } else {
          this.dedupeMobile = true;
          this.isMobileChanged = true; // for enable check dedupe button
          this.isContactNumberChanged = true;
          this.coApplicantForm.get('dedupe').get('pan').disable();
          this.getDedupeStoredValues();
          this.setDedupeValidators();
        }
      }

      const currentUrl = this.location.path();
      this.labelsData.getScreenId().subscribe((data) => {
        let udfScreenId = data.ScreenIDS;
  
        this.udfScreenId = currentUrl.includes('sales') ? udfScreenId.ADE.addEditApplicantDetailADE : udfScreenId.QDE.addEditApplicantDetailQDE ;
        this.negativeDedupeUdfScreenId = currentUrl.includes('sales') ? udfScreenId.ADE.negativeListdedupeADE : udfScreenId.QDE.negativeListdedupeQDE ;
  
      })

    })
    this.isExtCustValueChange = this.applicantDataService.getDetectvalueChange();
    console.log('this.isExtCustValueChange', this.isExtCustValueChange)

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
      }
    );
  }


  getDedupeDetails() {
    let dedupeValues: any = {};
    const details: any = {};
    dedupeValues = this.applicantDataService.getDedupeValues();
    if (this.applicantType === Constant.ENTITY_INDIVIDUAL_TYPE) {
      if (dedupeValues.panType === '1PANTYPE') {
        this.isPanDisabled = true;
      }
      details.gender = dedupeValues.gender
      details.pan = dedupeValues.pan;
      details.aadhar = dedupeValues.aadhar;
      details.mobile = dedupeValues.mobileNumber;
      details.panType = dedupeValues.panType;
      details.voterIdNumber = dedupeValues.voterIdNumber;
      if (dedupeValues.dob) {
        details.dob = dedupeValues.dob;
        // .split('/')
        // .reverse()
        // .join('-');
        details.dob = new Date(
          this.utilityService.getDateFromString(details.dob)
        );
      }
      details.passportNumber = dedupeValues.passportNumber;
      details.passportIssueDate = this.utilityService.getDateFromString(
        dedupeValues.passportIssueDate
      );
      details.passportExpiryDate = this.utilityService.getDateFromString(
        dedupeValues.passportExpiryDate
      );
      details.drivingLicenseNumber =
        dedupeValues.drivingLicenseNumber;
      details.drivingLicenseIssueDate = this.utilityService.getDateFromString(
        dedupeValues.drivingLicenseIssueDate
      );
      details.drivingLicenseExpiryDate = this.utilityService.getDateFromString(
        dedupeValues.drivingLicenseExpiryDate
      );
    } else {

      if (dedupeValues.panType === '1PANTYPE') {
        //this.panPattern = this.panFormPattern;
        this.isPanDisabled = true;
      }
      details.tanNumber = dedupeValues.tanNumber;
      details.gstNumber = dedupeValues.gstNumber;
      details.cstVatNumber = dedupeValues.cstVatNumber;
      details.pan = dedupeValues.panNumber;
      details.aadhar = dedupeValues.aadhar;
      details.companyPhoneNumber = dedupeValues.companyPhoneNumber;
      details.panType = dedupeValues.panType;
      details.corporateIdentificationNumber =
        dedupeValues.corporateIdentificationNumber;
      details.contactPerson = dedupeValues.contactPerson;

      if (dedupeValues.dateOfIncorporation) {
        details.dateOfIncorporation =
          dedupeValues.dateOfIncorporation;
        details.dateOfIncorporation = new Date(
          this.utilityService.getDateFromString(details.dateOfIncorporation)
        );
      }
    }

    return details;
  }

  getDedupeStoredValues() {

    const dedupeFlag = this.applicantDataService.getDedupeFlag();
    let dedupeValues: any = {};

    if (dedupeFlag) {
      dedupeValues = this.applicantDataService.getDedupeValues();
      this.applicantType = dedupeValues.entityType;
      const details = this.getDedupeDetails()
      this.firstName = dedupeValues.name1 || '';
      this.aadhar = details.aadhar || '';
      this.drivingLicenseNumber = details.drivingLicenseNumber || '';
      this.voterIdNumber = details.voterIdNumber || '';

      this.passportNumber = details.passportNumber || '';

      this.pan = details.pan || '';
      let mobile = details.mobile ? details.mobile : '';
      if (mobile && mobile.length === 12) {
        mobile = mobile.slice(2, 12);
      }
      this.mobileNumber = mobile;
      let companyPhoneNumber = details.companyPhoneNumber
        ? details.companyPhoneNumber
        : '';
      if (companyPhoneNumber && companyPhoneNumber.length == 12) {
        //companyPhoneNumber = companyPhoneNumber.slice(2, 12);
        if (companyPhoneNumber.slice(0, 2) == '91') {
          companyPhoneNumber = companyPhoneNumber.slice(2, 12);
        }
      }
      this.disabledPassportDates = details.passportNumber ? false : true;
      this.disabledDrivingDates = details.drivingLicenseNumber ? false : true;
      this.contactNumber = companyPhoneNumber;
      //this.setValueForFormControl('pan', details.pan);
      const dedupe = this.coApplicantForm.get('dedupe');
      if (dedupeValues.ownHouseProofAvail == '1') {
        this.checkedBoxHouse = true;
        this.isChecked = true;
        this.hideMsgForOwner = true;
        this.enableOwnerProperty()
      } else {
        this.checkedBoxHouse = false;
        this.isChecked = false;
        this.hideMsgForOwner = false;
        this.disableOwnerProperty()
      }

      dedupe.patchValue({
        //title: 'M/SSALUTATION',
        entityType: dedupeValues.entityType || '',
        loanApplicationRelation:
          dedupeValues.loanApplicationRelation || '',
        name1: dedupeValues.firstName || '',
        name2: dedupeValues.middleName || '',
        name3: dedupeValues.lastName || '',

        panType: dedupeValues.panType || '',
        aadhar: dedupeValues.aadhar || '',
        bussinessEntityType:
          dedupeValues.bussinessEntityType || '',
        monthlyIncomeAmount:
          dedupeValues.monthlyIncomeAmount || '',
        annualIncomeAmount:
          dedupeValues.annualIncomeAmount || '',
        houseOwnerProperty:
          dedupeValues.houseOwnerProperty || '',
        ownHouseAppRelationship:
          dedupeValues.ownHouseAppRelationship || '',
        averageBankBalance:
          dedupeValues.averageBankBalance || '',
        rtrType: dedupeValues.rtrType || '',
        prevLoanAmount: dedupeValues.prevLoanAmount || '',
        loanTenorServiced:
          dedupeValues.loanTenorServiced || '',
        currentEMILoan: dedupeValues.currentEMILoan || '',
        agriNoOfAcres: dedupeValues.agriNoOfAcres || '',
        agriOwnerProperty:
          dedupeValues.agriOwnerProperty || '',
        agriAppRelationship:
          dedupeValues.agriAppRelationship || '',
        grossReceipt: dedupeValues.grossReceipt || '',
        custSegment: dedupeValues.custSegment || '',
      });
      if (dedupeValues.panType === '2PANTYPE') {
        this.coApplicantForm.get('dedupe').get('pan').disable();

      } else {
        dedupe.patchValue({
          pan: dedupeValues.pan || '',
        });
        this.coApplicantForm.get('dedupe').get('pan').enable();

      }

      if (this.applicantId) {

        this.getApiForDedupeDetails();

      }
      if (dedupeValues.entityType == 'INDIVENTTYP') {
        this.setDedupeForIndividual()
        if (dedupeValues.panType === '2PANTYPE') {
          this.getPanValue(dedupeValues.panType);
        }

      } else {
        this.setDedupeForNonIndividual()
      }
      setTimeout(() => {
        this.listenerForUnique();
        this.setDedupeValidators();

      });
    }
  }

  getApiForDedupeDetails() {
    const data = {
      applicantId: this.applicantId,
    };
    this.applicantService.getApplicantDetail(data).subscribe((res: any) => {
      const processVariables = res.ProcessVariables;
      const applicant: Applicant = {
        ...processVariables,
      };

      if (processVariables.ucic) {
        const applicantDetails = processVariables.applicantDetails;
        const indivIdentityInfoDetails = processVariables.indivIdentityInfoDetails;
        const corporateProspectDetails = processVariables.corporateProspectDetails;

        if (processVariables.applicantDetails.entityTypeKey == "INDIVENTTYP") {
          this.gender = processVariables.aboutIndivProspectDetails.gender;
          this.lastName = processVariables.applicantDetails.name3
          //this.disableUCICIndividualDetails(indivIdentityInfoDetails)
          this.coApplicantForm.get('dedupe').disable();
          this.enableUsedCarFields(applicantDetails);
        } else {
          //this.disableUCICNonIndividualDetails(corporateProspectDetails)
          this.coApplicantForm.get('dedupe').disable();
          this.enableUsedCarFields(applicantDetails);
        }
      }
      if (processVariables.ekycDone == '1') {
        if (processVariables.applicantDetails.entityTypeKey == "INDIVENTTYP") {
          //this.disablePermanentAddress();
          this.disableEKYCDetails()
        }
      }
    });
  }

  setDedupeForIndividual() {
    const details = this.getDedupeDetails()
    let mobile = details.mobile ? details.mobile : '';
    if (mobile && mobile.length === 12) {
      mobile = mobile.slice(2, 12);
    }
    this.addIndFormControls();
    this.removeNonIndFormControls();
    const dedupe = this.coApplicantForm.get('dedupe')
    dedupe.get('bussinessEntityType').clearValidators()
    dedupe.get('bussinessEntityType').updateValueAndValidity()


    dedupe.patchValue({
      mobilePhone: mobile || '',
      dob: details.dob || '',
      gender: details.gender || '',
      //identity_type: applicantValue.identity_type || '',
      //aadhar: details.aadhar || '',
      voterIdNumber: details.voterIdNumber,
      drivingLicenseNumber: details.drivingLicenseNumber || '',
      drivingLicenseIssueDate: details.drivingLicenseIssueDate || '',
      drivingLicenseExpiryDate: details.drivingLicenseExpiryDate || '',
      passportNumber: details.passportNumber || '',
      passportIssueDate: details.passportIssueDate || '',
      passportExpiryDate: details.passportExpiryDate || '',
    });

  }
  setDedupeForNonIndividual() {
    this.coApplicantForm.get('dedupe').get('aadhar').clearValidators();
    this.coApplicantForm.get('dedupe').get('aadhar').updateValueAndValidity();
    this.coApplicantForm.get('dedupe').get('bussinessEntityType').setValidators([Validators.required]);
    this.coApplicantForm.get('dedupe').get('bussinessEntityType').updateValueAndValidity();
    const dedupe = this.coApplicantForm.get('dedupe')
    const details = this.getDedupeDetails()
    //let mobile = details.mobile ? details.mobile : '';

    this.addNonIndFormControls();
    this.removeIndFormControls();
    // if (mobile && mobile.length === 12) {
    //   mobile = mobile.slice(2, 12);
    // }
    let companyPhoneNumber = details.companyPhoneNumber
    if (companyPhoneNumber && companyPhoneNumber.length === 12) {
      companyPhoneNumber = companyPhoneNumber.slice(2, 12);
    }
    dedupe.patchValue({
      //aadhar : details.aadhar,
      companyPhoneNumber: companyPhoneNumber,
      dateOfIncorporation: details.dateOfIncorporation,
      contactPerson: details.contactPerson,
      corporateIdentificationNumber: details.corporateIdentificationNumber,
      cstVatNumber: details.cstVatNumber,
      gstNumber: details.gstNumber,
      tanNumber: details.tanNumber,
    });
  }


  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    this.productCategory = leadData['leadDetails'].productId;
    this.fundingProgram = leadData['leadDetails'].fundingProgram;

    this.applicantData = leadData['applicantDetails'];
    this.getLOV();

  }

  selectEntityType(event: any) {
    this.applicantType = event.target.value;
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;
    if (this.applicantType == 'INDIVENTTYP') {
      //this.namePattern = this.namePatternNonIdv;
      this.addIndFormControls();
      this.removeNonIndFormControls();
      dedupe.get('bussinessEntityType').clearValidators();
      dedupe.get('bussinessEntityType').updateValueAndValidity()
    } else {
      const dedupe = this.coApplicantForm.get('dedupe');
      // dedupe.patchValue({
      //   title: 'M/SSALUTATION',
      // });
      dedupe.get('aadhar').clearValidators();
      dedupe.get('bussinessEntityType').setValidators([Validators.required]);
      dedupe.get('bussinessEntityType').updateValueAndValidity()
      //this.namePattern = { ...this.namePatternIdv };
      this.addNonIndFormControls();
      this.removeIndFormControls();
    }
  }
  addIndFormControls() {
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;

    dedupe.addControl('dob', new FormControl(''));
    dedupe.addControl('mobilePhone', new FormControl(''));
    dedupe.addControl('gender', new FormControl(''));
    dedupe.addControl('drivingLicenseNumber', new FormControl(''));
    dedupe.addControl('drivingLicenseIssueDate', new FormControl(''));
    dedupe.addControl('drivingLicenseExpiryDate', new FormControl(''));
    dedupe.addControl('passportNumber', new FormControl(''));
    dedupe.addControl('passportIssueDate', new FormControl(''));
    dedupe.addControl('passportExpiryDate', new FormControl(''));
    dedupe.addControl('voterIdNumber', new FormControl(''));
    dedupe.addControl('custSegment', new FormControl(''));
  }
  addNonIndFormControls() {
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;
    dedupe.addControl('companyPhoneNumber', new FormControl(''));
    dedupe.addControl('dateOfIncorporation', new FormControl(''));
    dedupe.addControl('contactPerson', new FormControl(''));
    dedupe.addControl('corporateIdentificationNumber', new FormControl(''));
    dedupe.addControl('cstVatNumber', new FormControl(''));
    dedupe.addControl('gstNumber', new FormControl(''));
    dedupe.addControl('tanNumber', new FormControl(''));
  }

  removeIndFormControls() {
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;

    dedupe.removeControl('dob');
    dedupe.removeControl('mobilePhone');
    dedupe.removeControl('gender');
    dedupe.removeControl('drivingLicenseNumber');
    dedupe.removeControl('drivingLicenseIssueDate');
    dedupe.removeControl('drivingLicenseExpiryDate');
    dedupe.removeControl('passportNumber');
    dedupe.removeControl('passportIssueDate');
    dedupe.removeControl('passportExpiryDate');
    dedupe.removeControl('voterIdNumber');
    dedupe.removeControl('custSegment');

  }
  removeNonIndFormControls() {
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;
    dedupe.removeControl('companyPhoneNumber');
    dedupe.removeControl('dateOfIncorporation');

    dedupe.removeControl('contactPerson');
    dedupe.removeControl('corporateIdentificationNumber');
    dedupe.removeControl('cstVatNumber');
    dedupe.removeControl('gstNumber');
    dedupe.removeControl('tanNumber');

    //dedupe.removeControl('registeredAddress');
  }

  selectApplicantType(event) {
    const value = event.target.value;
    this.showNotApplicant = false;
    this.checkedAddressLead = '0';
    if (value !== "APPAPPRELLEAD") {
      this.showApplicantAddCheckBox = true;
    } else {
      this.showApplicantAddCheckBox = false;
    }
    if (this.applicantData) {
      this.applicantData.forEach((data) => {
        if (data.applicantId !== this.applicantId) {
          if (data.applicantTypeKey == "APPAPPRELLEAD" && data.applicantTypeKey === value) {
            this.toasterService.showError('There should be only one main applicant for this lead', '')
            this.showNotApplicant = true;
          }
        }
        // else if (this.applicantData.length==1){
        //      if (value !== "APPAPPRELLEAD") {
        //     this.toasterService.showError('There should be one applicant for this lead','')
        //   } 
        // }
      });

    }

  }

  onChangeOwner(event) {
    const value = event.target.value;
    const details = this.coApplicantForm.get('dedupe');
    const appRelation = this.getSelfRelationValue()
    if (value === 'APPAPPRELLEAD') {
      details.get('ownHouseAppRelationship').setValue(appRelation.key);
    } else {
      details.get('ownHouseAppRelationship').setValue('');
    }
  }

  onChangeAgriOwner(event) {
    const value = event.target.value;
    const details = this.coApplicantForm.get('dedupe');
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


  getPanValue(event?: any) {
    this.panValue = event;
    this.isPanDisabled = this.panValue === '1PANTYPE';
    this.panValidate = false;
    const dedupe = this.coApplicantForm.get('dedupe');
    if (this.applicantType == 'NONINDIVENTTYP') {
      if (!this.isPanDisabled) {
        //this.panPattern = {};
        this.panRequired = false;
        // dedupe.patchValue({
        //   pan: null,
        // });
        dedupe.get('pan').disable();
      } else {
        dedupe.get('pan').enable();
        //this.panPattern = this.panFormPattern;
        this.panRequired = true;

      }
      setTimeout(() => {
        dedupe.patchValue({
          pan: null,
        });
      });
    } else {
      const passportValue = dedupe.get('passportNumber').value;
      const voterId = dedupe.get('voterIdNumber').value;

      this.isVoterFirst = true;
      this.isPassportFirst = true;
      if (!this.isPanDisabled) {
        //this.panPattern = {};
        this.panRequired = false;
        dedupe.get('pan').disable();
        if (!voterId) {

          this.isPassportRequired = true;
          setTimeout(() => {
            dedupe.get('passportNumber').setValue(passportValue || null);
          })
        }
        if (!passportValue) {
          this.isVoterRequired = true;
          setTimeout(() => {
            dedupe.get('voterIdNumber').setValue(voterId || null);
          })
        }
        const dedupeFlag = this.applicantDataService.getDedupeFlag();

        if (!dedupeFlag && !voterId && !passportValue) {
          this.toasterService.showInfo(
            'You should enter either passport or voter id',
            ''
          );
        }
        //this.voterIdListener = this.listenerVoterId();
        //this.passportListener = this.listenerPassport();

        // dedupe.get('passportNumber').setValue(passportValue || null);
      } else {
        dedupe.get('pan').enable();
        //this.panPattern = this.panFormPattern;
        this.panRequired = true;
        this.isPassportRequired = false;
        this.isVoterRequired = false;
        if (this.voterIdListener) {
          this.voterIdListener.unsubscribe();
        }
        if (this.passportListener) {
          this.passportListener.unsubscribe();
        }
      }

      setTimeout(() => {
        dedupe.patchValue({
          pan: null,
          passportNumber: passportValue || null,
          voterIdNumber: voterId || null,
        });
      });
    }
  }

  listenerVoterId() {
    // let isFirst = true;
    const dedupe = this.coApplicantForm.get('dedupe');
    return dedupe.get('voterIdNumber').valueChanges.subscribe((value) => {
      if (this.isPanDisabled) {
        return;
      }
      if (value === undefined) {
        return;
      }
      if (value) {
        this.isVoterFirst = false;
        this.isPassportRequired = false;
        if (this.passportListener) {
          this.passportListener.unsubscribe();
        }
      } else {
        if (!this.isVoterRequired) {
          return;
        }
        const passport = dedupe.get('passportNumber').value;

        dedupe.get('voterIdNumber').clearValidators();
        dedupe.get('voterIdNumber').updateValueAndValidity();
        this.isPassportRequired = true;
        setTimeout(() => {
          dedupe.get('passportNumber').setValidators([Validators.required]);
          dedupe.get('passportNumber').updateValueAndValidity()
        })

        this.isVoterRequired = false;

        if (!this.passportListener) {
          this.passportListener = this.listenerPassport();
        }
      }
      const passportNumber = dedupe.get('passportNumber').value || null;
      // setTimeout(() => {
      if (this.isVoterFirst) {
        return;
      }
      dedupe.get('passportNumber').setValue(passportNumber);
      dedupe.get('passportNumber').updateValueAndValidity()
      // });
    });
  }

  listenerPassport() {
    // let isFirst = true;
    const dedupe = this.coApplicantForm.get('dedupe');
    return dedupe.get('passportNumber').valueChanges.subscribe((value) => {
      if (this.isPanDisabled) {
        return;
      }
      if (value === undefined) {
        return;
      }
      if (value) {
        this.isVoterRequired = false;
        this.isPassportFirst = false;

        if (this.voterIdListener) {
          this.voterIdListener.unsubscribe();
        }
      } else {
        if (!this.isPassportRequired) {
          return;
        }
        this.isVoterRequired = true;
        this.isPassportRequired = false;
        //dedupe.get('passportNumber').setValue(null)
        dedupe.get('passportNumber').clearValidators();
        dedupe.get('passportNumber').updateValueAndValidity();
        dedupe.get('voterIdNumber').setValidators([Validators.required]);
        dedupe.get('voterIdNumber').updateValueAndValidity();

        if (!this.voterIdListener) {
          this.voterIdListener = this.listenerVoterId();
        }
      }
      const voterId = dedupe.get('voterIdNumber').value || null;
      if (this.isPassportFirst) {
        return;
      }
      dedupe.get('voterIdNumber').setValue(voterId);
    });
  }

  onDrvingLisenseChange() {
    if (
      this.coApplicantForm.get('dedupe').get('drivingLicenseNumber').status ===
      'VALID' && this.coApplicantForm.get('dedupe').get('drivingLicenseNumber').value

    ) {
      this.disabledDrivingDates = false;
      this.coApplicantForm.get('dedupe').get('drivingLicenseIssueDate').setValidators([Validators.required]);
      this.coApplicantForm.get('dedupe').get('drivingLicenseIssueDate').updateValueAndValidity();

      this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').setValidators([Validators.required]);
      this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').updateValueAndValidity();
      //this.coApplicantForm.get('dedupe').updateValueAndValidity();
      this.mandatory['drivingLicenseIssueDate'] = true;
      this.mandatory['drivingLicenseExpiryDate'] = true;
    } else {
      //this.disabledDrivingDates = true;
      // if (this.coApplicantForm.get('dedupe').get('drivingLicenseNumber').value == ''
      // ) {
      this.showMessage['drivingLicenseExpiry'] = false;
      this.showMessage['drivingLicenseIssue'] = false;
      this.disabledDrivingDates = true;
      this.coApplicantForm.get('dedupe').get('drivingLicenseIssueDate').setValue(null);
      this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').setValue(null);
      // }


      this.coApplicantForm.get('dedupe').get('drivingLicenseIssueDate').clearValidators();
      this.coApplicantForm.get('dedupe').get('drivingLicenseIssueDate').updateValueAndValidity();

      this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').clearValidators();
      this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').updateValueAndValidity();
      //this.coApplicantForm.get('dedupe').updateValueAndValidity();

      this.mandatory['drivingLicenseIssueDate'] = false;
      this.mandatory['drivingLicenseExpiryDate'] = false;
    }
  }

  voterIdChange(event) {
    const dedupe = this.coApplicantForm.get('dedupe');
    if (dedupe.get('voterIdNumber').valid && dedupe.get('voterIdNumber').value) {
      this.isPassportRequired = false;
      setTimeout(() => {
        const passport = dedupe.get('passportNumber').value;
        dedupe.get('passportNumber').setValue(passport || null);
      });
    } else {
      if (!this.isPanDisabled) {
        this.isPassportRequired = true;
        setTimeout(() => {
          const passport = dedupe.get('passportNumber').value;
          dedupe.get('passportNumber').setValue(passport || null);
        });
      }
    }
  }



  onPassportNumberChange() {
    if (
      this.coApplicantForm.get('dedupe').get('passportNumber').status ===
      'VALID' && this.coApplicantForm.get('dedupe').get('passportNumber').value
    ) {
      this.disabledPassportDates = false;
      this.coApplicantForm.get('dedupe').get('passportIssueDate').setValidators([Validators.required]);
      this.coApplicantForm.get('dedupe').get('passportIssueDate').updateValueAndValidity();

      this.coApplicantForm.get('dedupe').get('passportExpiryDate').setValidators([Validators.required]);
      this.coApplicantForm.get('dedupe').get('passportExpiryDate').updateValueAndValidity();
      //this.coApplicantForm.get('dedupe').updateValueAndValidity();

      this.passportMandatory['passportIssueDate'] = true;
      this.passportMandatory['passportExpiryDate'] = true;

      this.isVoterRequired = false;
      setTimeout(() => {
        const voter = this.coApplicantForm.get('dedupe').get('voterIdNumber').value;
        this.coApplicantForm
          .get('dedupe')
          .get('voterIdNumber')
          .setValue(voter || null);
      });
    } else {

      if (this.coApplicantForm.get('dedupe').get('passportNumber').value == ''
      ) {
        this.disabledPassportDates = true;

        this.showMessage['passportExpiry'] = false;
        this.showMessage['passportIssue'] = false;
        this.coApplicantForm.get('dedupe').get('passportIssueDate').setValue(null);
        this.coApplicantForm.get('dedupe').get('passportExpiryDate').setValue(null);
      }
      this.coApplicantForm.get('dedupe').get('passportIssueDate').clearValidators();
      this.coApplicantForm.get('dedupe').get('passportIssueDate').updateValueAndValidity();

      this.coApplicantForm.get('dedupe').get('passportExpiryDate').clearValidators();
      this.coApplicantForm.get('dedupe').get('passportExpiryDate').updateValueAndValidity();
      //this.coApplicantForm.get('dedupe').updateValueAndValidity();
      this.passportMandatory['passportIssueDate'] = false;
      this.passportMandatory['passportExpiryDate'] = false;
      if (!this.isPanDisabled) {
        this.isVoterRequired = true;
        setTimeout(() => {
          this.coApplicantForm.get('dedupe').get('voterIdNumber').updateValueAndValidity();
        });
      }
    }

  }


  getPincode(pincode) {
    const id = pincode.id;
    const pincodeValue = pincode.value;
    if (pincodeValue.length === 6) {
      const pincodeNumber = Number(pincodeValue);
      this.getPincodeResult(pincodeNumber, id);
    }
  }

  getPincodeResult(pincodeNumber: number, id: string) {
    this.applicantService
      .getGeoMasterValue({
        pincode: pincodeNumber,
      })
      .pipe(
        map((value: any) => {
          const processVariables = value.ProcessVariables;
          const addressList: any[] = processVariables.GeoMasterView;
          if (!addressList) {
            this.toasterService.showError('Invalid pincode', '');
            if (id == 'permanentPincode') {
              this.setNullValues('permentAddress');
              this.permanentPincode = {}
            }
            if (id == 'currentPincode') {
              this.setNullValues('currentAddress');
              this.currentPincode = {}
            }
            if (id == 'registerPincode') {
              this.setNullValues('registeredAddress');
              this.registerPincode = {}
            }
            if (id == 'communicationPincode') {
              this.setNullValues('communicationAddress');
              this.communicationPincode = {}
            }

            return;
          }
          const first = addressList[0];
          const obj = {
            state: [
              {
                key: first.stateId,
                value: first.stateName,
              },
            ],
            district: [
              {
                key: first.districtId,
                value: first.districtName,
              },
            ],
            country: [
              {
                key: first.countryId,
                value: first.country,
              },
            ],
          };
          const city = addressList.map((val) => {
            return {
              key: val.cityId,
              value: val.cityName,
            };
          });
          return {
            ...obj,
            city,
          };
        })
      )
      .subscribe((value) => {
        if (!value) {
          return;
        }
        let formGroupName = '';

        if (id === 'permanentPincode') {
          this.coApplicantForm.get('permentAddress').get('city').setValue('')
          this.permanentPincode = value;
          formGroupName = 'permentAddress';
          this.setDefaultValueForAddress(value, formGroupName)
        }
        if (id === 'currentPincode') {
          this.coApplicantForm.get('currentAddress').get('city').setValue('')
          this.currentPincode = value;
          formGroupName = 'currentAddress';
          this.setDefaultValueForAddress(value, formGroupName)
        }
        if (id === 'registerPincode') {
          this.coApplicantForm.get('registeredAddress').get('city').setValue('')
          this.registerPincode = value;
          formGroupName = 'registeredAddress';
          this.setDefaultValueForAddress(value, formGroupName)
        }
        if (id === 'communicationPincode') {
          this.coApplicantForm.get('communicationAddress').get('city').setValue('')
          this.communicationPincode = value;
          formGroupName = 'communicationAddress';
          this.setDefaultValueForAddress(value, formGroupName)
        }

        setTimeout(() => {
          // this.setDefaultValueForAddress(value, formGroupName);
        });
      });
  }

  setDefaultValueForAddress(value, formGroupName: string) {
    const country = value.country;
    const state = value.state;
    const district = value.district;

    if (country && country.length === 1) {
      this.coApplicantForm.get(formGroupName).patchValue({
        country: country[0].key,
      });
    }

    if (district && district.length === 1) {
      this.coApplicantForm.get(formGroupName).patchValue({
        district: district[0].key,
      });
    }

    if (state && state.length === 1) {
      this.coApplicantForm.get(formGroupName).patchValue({
        state: state[0].key,
      });
    }
  }

  setNullValues(control) {
    this.coApplicantForm.get(control).patchValue({
      state: null || '',
      country: null || '',
      district: null || '',
      city: null || ''
    })
  }

  getLeadId() {
    return new Promise((resolve) => {
      this.activatedRoute.parent.params.subscribe((value: any) => {
        if (!value.leadId) {
          resolve(null);
        }
        resolve(Number(value.leadId));
      });
    });
  }

  getLeadIdAndApplicantId() {
    return new Promise((resolve) => {
      this.activatedRoute.params.subscribe((value: any) => {
        resolve({
          leadId: Number(value.leadId),
          applicantId: Number(value.applicantId),
        });
      });
    });
  }

  createAddressObject(address: AddressDetails) {
    if (!address) {
      return null;
    }
    const city = address.city ? Number(address.city) : null;
    const district = address.district ? Number(address.district) : null;
    const state = address.state ? Number(address.state) : null;
    const pincode = address.pincode ? Number(address.pincode) : null;
    return {
      pincode,
      city,
      district,
      state,
      addressLineOne: address.addressLineOne,
      addressLineTwo: address.addressLineTwo,
      addressLineThree: address.addressLineThree,
      country: address.country || address.countryId,
      landlineNumber: address.landlineNumber,
      nearestLandmark: address.nearestLandmark
    };
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

      if (processVariables.ucic) {
        this.isPermanantAddressSame = true;
        this.isDisabledCheckbox = true;
        this.isRegAddressSame = true;
        this.addDisabledCheckBox = true;

        //if(processVariables.addressDetails){
        this.disablePermanentAddress();
        this.disableCurrentAddress();

        this.disableRegisteredAddress();
        this.disableCommunicationAddress();
        //}
        this.showModifyCurrCheckBox = true;
        const applicantDetails = processVariables.applicantDetails;
        const indivIdentityInfoDetails = processVariables.indivIdentityInfoDetails;
        const corporateProspectDetails = processVariables.corporateProspectDetails;

        if (processVariables.applicantDetails.entityTypeKey == "INDIVENTTYP") {
          this.lastName = processVariables.applicantDetails.name3
          this.gender = processVariables.aboutIndivProspectDetails.gender;
          //this.disableUCICIndividualDetails(indivIdentityInfoDetails)
          this.coApplicantForm.get('dedupe').disable();
          this.enableUsedCarFields(applicantDetails);
        } else {
          //this.disableUCICNonIndividualDetails(corporateProspectDetails)
          this.coApplicantForm.get('dedupe').disable();
          this.enableUsedCarFields(applicantDetails)
        }
      }
      this.ekycDone = processVariables.ekycDone;
      if (!processVariables.ucic) {
        if (this.ekycDone == '1') {
          if (processVariables.applicantDetails.entityTypeKey == "INDIVENTTYP") {
            this.disablePermanentAddress();
            this.disableEKYCDetails();
            this.showEkycbutton = false;
            this.addDisabledCheckBox = true;
          }

        }
        else if (this.ekycDone == "0") {
          this.showEkycbutton = true;
        }
      }
      if (processVariables.applicantDetails.entityTypeKey == "INDIVENTTYP") {
        const datas = {
          ...processVariables.applicantDetails,
          ...processVariables.aboutIndivProspectDetails,
          ...processVariables.indivIdentityInfoDetails
        }
        this.individualDatas.push(datas)

      } else {
        const datas = {
          ...processVariables.applicantDetails,
          ...processVariables.corporateProspectDetails
        }
        this.nonIndividualDatas.push(datas)
      }


      this.applicantDataService.setApplicant(applicant);
      this.applicant = this.applicantDataService.getApplicant();

      this.applicantType = this.applicant.applicantDetails.entityTypeKey;
      if (this.applicantType == 'INDIVENTTYP') {
        this.coApplicantForm
          .get('dedupe')
          .get('name3')
          .setValidators([Validators.required]);
        this.coApplicantForm
          .get('dedupe')
          .get('name3')
          .updateValueAndValidity();
      }

      // if( this.applicant.addressDetails){
      //   this.isAddressSame = this.applicant.addressDetails[0].isCurrAddSameAsPermAdd === '1' ? true :  false;
      // }
      setTimeout(() => {
        this.setFormValue(this.applicant);
      });
    });
  }



  getLOV() {
    this.commomLovService.getLovData().subscribe((lov: any) => {
      this.LOV = lov;

      // this.ownerPropertyRelation =relation.splice(0,2)
      this.ownerPropertyRelation = this.LOV.LOVS.applicantRelationshipWithLead.filter(
        (data) => data.value !== 'Guarantor'
      );

    });

  }

  disableEKYCDetails() {
    const dedupe = this.coApplicantForm.get('dedupe');
    dedupe.get('name1').disable();
    dedupe.get('name2').disable();
    dedupe.get('name3').disable();
    dedupe.get('dob').disable();
  }

  disableUCICIndividualDetails(indivIdentityInfoDetails) {
    const dedupe = this.coApplicantForm.get('dedupe');
    dedupe.get('name1').disable();
    dedupe.get('name2').disable();
    this.lastName ? dedupe.get('name3').disable() : null;
    dedupe.get('dob').disable();
    dedupe.get('mobilePhone').disable();
    this.gender ? dedupe.get('gender').disable() : null;
    indivIdentityInfoDetails.aadhar ? dedupe.get('aadhar').disable() : null;
    indivIdentityInfoDetails.pan ? dedupe.get('pan').disable() : null;
    indivIdentityInfoDetails.panType ? dedupe.get('panType').disable() : null;
    indivIdentityInfoDetails.drivingLicenseNumber ? dedupe.get('drivingLicenseNumber').disable() : null;
    indivIdentityInfoDetails.drivingLicenseIssueDate ? dedupe.get('drivingLicenseIssueDate').disable() : null;
    indivIdentityInfoDetails.drivingLicenseExpiryDate ? dedupe.get('drivingLicenseExpiryDate').disable() : null;
    indivIdentityInfoDetails.passportNumber ? dedupe.get('passportNumber').disable() : null;
    indivIdentityInfoDetails.passportIssueDate ? dedupe.get('passportIssueDate').disable() : null;
    indivIdentityInfoDetails.passportExpiryDate ? dedupe.get('passportExpiryDate').disable() : null;
    indivIdentityInfoDetails.voterIdNumber ? dedupe.get('voterIdNumber').disable() : null;
  }

  disableUCICNonIndividualDetails(corporateProspectDetails) {
    const dedupe = this.coApplicantForm.get('dedupe');
    dedupe.get('name1').disable();
    dedupe.get('name2').disable();
    dedupe.get('name3').disable();
    dedupe.get('dateOfIncorporation').disable();
    dedupe.get('companyPhoneNumber').disable();
    corporateProspectDetails.aadhar ? dedupe.get('aadhar').disable() : null;
    corporateProspectDetails.panType ? dedupe.get('panType').disable() : null;
    corporateProspectDetails.panNumber ? dedupe.get('pan').disable() : null;
    corporateProspectDetails.corporateIdentificationNumber ? dedupe.get('corporateIdentificationNumber').disable() : null;
    corporateProspectDetails.cstVatNumber ? dedupe.get('cstVatNumber').disable() : null;
    corporateProspectDetails.gstNumber ? dedupe.get('gstNumber').disable() : null;
    corporateProspectDetails.tanNumber ? dedupe.get('tanNumber').disable() : null;

  }

  enableUsedCarFields(applicantDetails) {

    const dedupe = this.coApplicantForm.get('dedupe');
    if (applicantDetails.entityTypeKey == "INDIVENTTYP") {
      dedupe.get('custSegment').enable();
    } else {
      dedupe.get('bussinessEntityType').enable();
    }
    dedupe.get('loanApplicationRelation').enable();
    dedupe.get('monthlyIncomeAmount').enable();
    dedupe.get('ownHouseProofAvail').enable();
    dedupe.get('houseOwnerProperty').enable();
    dedupe.get('ownHouseAppRelationship').enable();
    dedupe.get('averageBankBalance').enable();
    dedupe.get('rtrType').enable();
    dedupe.get('prevLoanAmount').enable();
    dedupe.get('loanTenorServiced').enable();
    dedupe.get('currentEMILoan').enable();
    dedupe.get('agriNoOfAcres').enable();
    dedupe.get('agriOwnerProperty').enable();
    dedupe.get('agriAppRelationship').enable();
    dedupe.get('grossReceipt').enable();


  }

  disablePermanentAddress() {
    this.coApplicantForm.get('permentAddress').disable();
  }

  disableCurrentAddress() {
    this.coApplicantForm.get('currentAddress').disable();
  }

  disableCommunicationAddress() {
    this.coApplicantForm.get('communicationAddress').disable();
  }

  disableRegisteredAddress() {
    this.coApplicantForm.get('registeredAddress').disable();
  }


  calculateIncome(value) {
    const annualIncome = 12 * value;
    this.coApplicantForm.get('dedupe').patchValue({
      annualIncomeAmount: annualIncome,
    });
  }

  onOwnHouseAvailable(event) {
    this.isChecked = event.target.checked;
    if (this.isChecked === true) {
      this.hideMsgForOwner = true;
      this.coApplicantForm.get('dedupe').get('houseOwnerProperty').setValidators([Validators.required]);
      this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').setValidators([Validators.required]);
      this.coApplicantForm.get('dedupe').get('houseOwnerProperty').updateValueAndValidity();
      this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').updateValueAndValidity();


      const houseOwner = this.coApplicantForm.get('dedupe').get('houseOwnerProperty').value;
      const ownHouseAppRelationship = this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').value
      this.coApplicantForm.get('dedupe').patchValue({
        houseOwnerProperty: houseOwner,
        ownHouseAppRelationship: ownHouseAppRelationship
      })
      this.enableOwnerProperty()

    } else {
      this.hideMsgForOwner = false;
      this.coApplicantForm.get('dedupe').get('houseOwnerProperty').clearValidators();
      this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').clearValidators();
      this.coApplicantForm.get('dedupe').get('houseOwnerProperty').updateValueAndValidity();
      this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').updateValueAndValidity();

      this.coApplicantForm.get('dedupe').patchValue({
        houseOwnerProperty: '',
        ownHouseAppRelationship: ''
      })
      this.disableOwnerProperty()
    }
  }
  enableOwnerProperty(){
    this.coApplicantForm.get('dedupe').get('houseOwnerProperty').enable();
    this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').enable();
  }

  disableOwnerProperty(){
    this.coApplicantForm.get('dedupe').get('houseOwnerProperty').disable();
    this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').disable();

  }
  

  getDedupeFormControls() {
    return {
      loanApplicationRelation: new FormControl('', Validators.required),
      entityType: new FormControl('', Validators.required),
      bussinessEntityType: new FormControl('', Validators.required),
      fullName: new FormControl({ value: '', disabled: true }),
      name1: new FormControl('', Validators.required),
      name2: new FormControl(''),
      name3: new FormControl(''),
      mobilePhone: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      voterIdNumber: new FormControl(null),
      aadhar: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      panType: new FormControl('', Validators.required),
      pan: new FormControl(''),

      drivingLicenseNumber: new FormControl(''),
      drivingLicenseIssueDate: new FormControl(''),
      drivingLicenseExpiryDate: new FormControl(''),
      passportNumber: new FormControl(null),
      passportIssueDate: new FormControl(''),
      passportExpiryDate: new FormControl(''),

      custSegment: new FormControl('', Validators.required),
      monthlyIncomeAmount: new FormControl(''),
      annualIncomeAmount: new FormControl(''),
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

      title: new FormControl(''),
      dateOfIncorporation: new FormControl('', Validators.required),
      contactPerson: new FormControl('', Validators.required),
      corporateIdentificationNumber: new FormControl('', Validators.required),
      cstVatNumber: new FormControl(''),
      gstNumber: new FormControl(''),
      tanNumber: new FormControl(''),
      companyPhoneNumber: new FormControl('', Validators.required),
    };
  }

  initForm() {
    this.coApplicantForm = new FormGroup({
      dedupe: new FormGroup(this.getDedupeFormControls()),
      permentAddress: new FormGroup(this.getAddressFormControls()),
      srNumber: new FormControl(''),
      currentAddress: new FormGroup(this.getAddressFormControls()),
      registeredAddress: new FormGroup(this.getAddressFormControls()),
      communicationAddress: new FormGroup({
        ...this.getAddressFormControls(),
        pobox: new FormControl('')
      }),
    });
    // this.addIndFormControls();
    // this.removeNonIndFormControls();
    this.enableDedupeButton();

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData;
      },
      (error) => {
        console.log(error);
      }
    );

  }

  getAddressFormControls() {
    return {
      addressLineOne: new FormControl('', Validators.required),
      addressLineTwo: new FormControl(''),
      addressLineThree: new FormControl(''),
      pincode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      landlineNumber: new FormControl(''),
      nearestLandmark: new FormControl('')
    };
  }

  getFormateDate(date: string) {
    if (!date) {
      return '';
    }
    date = date.split('/').reverse().join('/');
    return new Date(date);
  }

  getDetails() {
    const details: any = {};

    if (this.applicantType === Constant.ENTITY_INDIVIDUAL_TYPE) {
      const indivIdentityInfoDetails = this.applicant.indivIdentityInfoDetails
        ? this.applicant.indivIdentityInfoDetails
        : {};
      const aboutIndivProspectDetails = this.applicant.aboutIndivProspectDetails
        ? this.applicant.aboutIndivProspectDetails
        : {};
      if (indivIdentityInfoDetails.panType === '1PANTYPE') {
        //this.panPattern = this.panFormPattern;
        this.isPanDisabled = true;
      }
      details.pan = indivIdentityInfoDetails.pan;
      details.aadhar = indivIdentityInfoDetails.aadhar;
      details.mobile = aboutIndivProspectDetails.mobilePhone;


      details.panType = indivIdentityInfoDetails.panType;
      details.voterIdNumber = indivIdentityInfoDetails.voterIdNumber;
      if (aboutIndivProspectDetails.dob) {
        //const dob =aboutIndivProspectDetails.dob.split('/').reverse().join('/');
        details.dob = this.getFormateDate(aboutIndivProspectDetails.dob)

      }
      details.gender = aboutIndivProspectDetails.gender,
        details.passportNumber = indivIdentityInfoDetails.passportNumber;
      details.passportIssueDate = this.getFormateDate(
        indivIdentityInfoDetails.passportIssueDate
      );

      details.passportExpiryDate = this.getFormateDate(
        indivIdentityInfoDetails.passportExpiryDate
      );
      details.drivingLicenseNumber =
        indivIdentityInfoDetails.drivingLicenseNumber;
      details.drivingLicenseIssueDate = this.getFormateDate(
        indivIdentityInfoDetails.drivingLicenseIssueDate
      );
      details.drivingLicenseExpiryDate = this.getFormateDate(
        indivIdentityInfoDetails.drivingLicenseExpiryDate
      );
    } else {
      const corporateProspectDetails = this.applicant.corporateProspectDetails
        ? this.applicant.corporateProspectDetails
        : {};
      if (corporateProspectDetails.panType === '1PANTYPE') {
        //this.panPattern = this.panFormPattern;
        this.isPanDisabled = true;
      }
      details.tanNumber = corporateProspectDetails.tanNumber;
      details.gstNumber = corporateProspectDetails.gstNumber;
      details.cstVatNumber = corporateProspectDetails.cstVatNumber;
      details.pan = corporateProspectDetails.panNumber;
      details.aadhar = corporateProspectDetails.aadhar;
      details.companyPhoneNumber = corporateProspectDetails.companyPhoneNumber;
      details.panType = corporateProspectDetails.panType;
      details.corporateIdentificationNumber =
        corporateProspectDetails.corporateIdentificationNumber;
      details.contactPerson = corporateProspectDetails.contactPerson;

      if (corporateProspectDetails.dateOfIncorporation) {
        details.dateOfIncorporation =
          corporateProspectDetails.dateOfIncorporation;
        details.dateOfIncorporation =
          this.getFormateDate(details.dateOfIncorporation);
      }
    }

    return details;

  }

  setFormValue(applicantValue) {
    if (!applicantValue) {
      return;

    } else {
      const details = this.getDetails();
      this.firstName = applicantValue.applicantDetails.name1 || '';
      this.aadhar = details.aadhar || '';
      this.gender = applicantValue.aboutIndivProspectDetails.gender
      this.drivingLicenseNumber = details.drivingLicenseNumber || '';
      this.passportNumber = details.passportNumber || '';
      this.voterIdNumber = details.voterIdNumber || '';
      this.pan = details.pan || '';

      this.tanNumber = details.tanNumber || '';
      this.corporateIdentificationNumber = details.corporateIdentificationNumber || '';
      this.gstNumber = details.gstNumber || '';
      this.cstVatNumber = details.cstVatNumber || '';




      this.setValueForFormControl('pan', details.pan);
      if (applicantValue.applicantDetails.ownHouseProofAvail == '1') {
        this.checkedBoxHouse = true;
        this.isChecked = true;
        this.hideMsgForOwner = true;
        this.enableOwnerProperty()
      } else {
        this.checkedBoxHouse = false;
        this.isChecked = false;
        this.hideMsgForOwner = false;
        this.disableOwnerProperty()
        
      }


      const applicantType = applicantValue.applicantDetails.applicantTypeKey;
      this.showApplicantAddCheckBox = applicantType !== "APPAPPRELLEAD" ? true : false;
      this.apiAddressLeadCheckBox = applicantValue.applicantDetails.isAddrSameAsApplicant
      this.checkedAddressLead = this.apiAddressLeadCheckBox;


      const dedupe = this.coApplicantForm.get('dedupe');

      dedupe.patchValue({
        title: 'M/SSALUTATION',
        entityType: applicantValue.applicantDetails.entityTypeKey || applicantValue.applicantDetails.entityType,
        loanApplicationRelation:
          applicantValue.applicantDetails.applicantTypeKey || applicantValue.applicantDetails.loanApplicationRelation,
        // fullName : applicantValue.applicantDetails.name1+' '+
        //            applicantValue.applicantDetails.name2+' '+
        //            applicantValue.applicantDetails.name3,
        name1: applicantValue.applicantDetails.name1 || '',
        name2: applicantValue.applicantDetails.name2 || '',
        name3: applicantValue.applicantDetails.name3 || '',
        panType: details.panType || '',
        aadhar: details.aadhar || '',
        bussinessEntityType:
          applicantValue.applicantDetails.bussinessEntityType || '',
        monthlyIncomeAmount:
          applicantValue.applicantDetails.monthlyIncomeAmount || '',
        annualIncomeAmount:
          applicantValue.applicantDetails.annualIncomeAmount || '',
        houseOwnerProperty:
          applicantValue.applicantDetails.houseOwnerProperty || '',
        ownHouseAppRelationship:
          applicantValue.applicantDetails.ownHouseAppRelationship || '',
        averageBankBalance:
          applicantValue.applicantDetails.averageBankBalance || '',
        rtrType: applicantValue.applicantDetails.rtrType || '',
        prevLoanAmount: applicantValue.applicantDetails.prevLoanAmount || '',
        loanTenorServiced:
          applicantValue.applicantDetails.loanTenorServiced || '',
        currentEMILoan: applicantValue.applicantDetails.currentEMILoan || '',
        agriNoOfAcres: applicantValue.applicantDetails.agriNoOfAcres || '',
        agriOwnerProperty:
          applicantValue.applicantDetails.agriOwnerProperty || '',
        agriAppRelationship:
          applicantValue.applicantDetails.agriAppRelationship || '',
        grossReceipt: applicantValue.applicantDetails.grossReceipt || '',
        custSegment: applicantValue.applicantDetails.custSegment || '',
      });
      if (details.panType === '2PANTYPE') {
        this.coApplicantForm.get('dedupe').get('pan').disable();
      } else {
        dedupe.patchValue({
          pan: details.pan || '',
        });
      }

      if (
        this.applicant.applicantDetails.entityTypeKey ===
        Constant.ENTITY_INDIVIDUAL_TYPE
      ) {
        this.setIndividualFormValues();


      } else {
        this.setNonIndividualFormValues();

      }
    }
    const panFlag = this.applicantDataService.getPanValidate()
    if (panFlag) {
      this.panValidate = true;
    }
    setTimeout(() => {
      this.listenerForUnique();
      this.setDedupeValidators();

    });

    const formValue = this.coApplicantForm.getRawValue();
    if (this.applicantType == Constant.ENTITY_INDIVIDUAL_TYPE) {
      this.apiValue = {
        dedupe: formValue.dedupe,
        permentAddress: formValue.permentAddress,
        currentAddress: formValue.currentAddress
      }
      const dob = this.coApplicantForm.getRawValue().dedupe.dob
      const passportIssueDate = this.coApplicantForm.getRawValue().dedupe.passportIssueDate
      const passportExpiryDate = this.coApplicantForm.getRawValue().dedupe.passportExpiryDate
      const drivingLicenseIssueDate = this.coApplicantForm.getRawValue().dedupe.drivingLicenseIssueDate
      const drivingLicenseExpiryDate = this.coApplicantForm.getRawValue().dedupe.drivingLicenseExpiryDate

      this.apiValue.dedupe.dob = this.utilityService.getDateFormat(dob)
      this.apiValue.dedupe.passportIssueDate = this.utilityService.getDateFormat(passportIssueDate)
      this.apiValue.dedupe.passportExpiryDate = this.utilityService.getDateFormat(passportExpiryDate)
      this.apiValue.dedupe.drivingLicenseIssueDate = this.utilityService.getDateFormat(drivingLicenseIssueDate)
      this.apiValue.dedupe.drivingLicenseExpiryDate = this.utilityService.getDateFormat(drivingLicenseExpiryDate)
    } else {
      this.apiValue = {
        dedupe: formValue.dedupe,
        registeredAddress: formValue.registeredAddress,
        communicationAddress: formValue.communicationAddress
      }
      const doc = this.coApplicantForm.getRawValue().dedupe.dateOfIncorporation
      this.apiValue.dedupe.dateOfIncorporation = this.utilityService.getDateFormat(doc)
    }
  }

  setIndividualFormValues() {
    const dedupe = this.coApplicantForm.get('dedupe');
    const details = this.getDetails();
    const applicantValue = this.applicant;
    this.addIndFormControls();
    this.removeNonIndFormControls();
    dedupe.get('bussinessEntityType').clearValidators()
    dedupe.get('bussinessEntityType').updateValueAndValidity();

    const modifyaddress = applicantValue.applicantDetails.modifyCurrentAddress
    this.checkedModifyCurrent = modifyaddress == "1" ? true : false;
    this.showSrField = modifyaddress == "1" ? true : false;
    let mobile = details.mobile ? details.mobile : '';
    if (mobile && mobile.length === 12) {
      mobile = mobile.slice(2, 12);
    }
    this.mobileNumber = mobile;
    const dedupeValues = this.applicantDataService.getDedupeValues();
    console.log('dedupeValues', dedupeValues)
    if (dedupeValues) {
      if (dedupeValues['entityType'] === "INDIVENTTYP" && dedupeValues['mobileNumber'] !== mobile) {
        this.dedupeMobile = true;
      } else {
        this.dedupeMobile = false;
      }
    } else {
      this.dedupeMobile = false;
    }

    if (details.drivingLicenseIssueDate) {
      this.drivingIssueDateShowError(details.drivingLicenseIssueDate)
    }
    if (details.passportIssueDate) {
      // this.maxPassportExpiryDate = new Date(details.passportIssueDate) ;
      // this.maxPassportExpiryDate.setFullYear(this.maxPassportExpiryDate.getFullYear() + 10)
      this.passportIssueDateShowError(details.passportIssueDate)
    }


    this.successSrValue = applicantValue.applicantDetails.srNumber;
    this.validateSrBoolean = this.storeSRNumber ? true : false;
    this.coApplicantForm.patchValue({ srNumber: applicantValue.applicantDetails.srNumber })
    dedupe.patchValue({
      mobilePhone: mobile || '',
      dob: details.dob || '',
      gender: details.gender || '',
      voterIdNumber: details.voterIdNumber,
      drivingLicenseNumber: details.drivingLicenseNumber || '',
      drivingLicenseIssueDate: details.drivingLicenseIssueDate || '',
      drivingLicenseExpiryDate: details.drivingLicenseExpiryDate || '',
      passportNumber: details.passportNumber || '',
      passportIssueDate: details.passportIssueDate || '',
      passportExpiryDate: details.passportExpiryDate || '',
    });



    if (details.passportExpiryDate) {
      this.passportExpiryShowError(details.passportExpiryDate)
    }

    if (details.drivingLicenseExpiryDate) {
      this.drivingLicenceExpiryShowError(details.drivingLicenseExpiryDate)
    }

    if (this.applicant.ucic) {
      this.disabledPassportDates = true;
      this.disabledDrivingDates = true;
    } else {
      this.disabledPassportDates = details.passportNumber ? false : true;
      this.disabledDrivingDates = details.drivingLicenseNumber ? false : true;
    }
    if (!this.applicant.ucic && applicantValue.indivIdentityInfoDetails.panType == "2PANTYPE") {
      this.getPanValue(applicantValue.indivIdentityInfoDetails.panType);
    }

    setTimeout(() => {
      this.listenerForPermenantAddress();
    })


    const permentAddress = this.coApplicantForm.get('permentAddress');
    const currentAddress = this.coApplicantForm.get('currentAddress');
    if (this.checkedAddressLead == '1') {
      permentAddress.disable();
      currentAddress.disable();
      this.isDisabledCheckbox = true;
    }
    const address = this.applicant.addressDetails
    const addressObj = this.getAddressObj(address);
    const permenantAddressObj = addressObj[Constant.PERMANENT_ADDRESS];
    const currentAddressObj = addressObj[Constant.CURRENT_ADDRESS];


    if (!!permenantAddressObj) {
      //this.permenantAddDatas.push(permenantAddressObj)
      this.isPermanantAddressSame =
        permenantAddressObj.isCurrAddSameAsPermAdd === '1';
      this.apiCurrentCheckBox = permenantAddressObj.isCurrAddSameAsPermAdd == '1' ? '1' : '0';
    }
    // if (!!currentAddressObj) {
    //   this.currentAddDatas.push(currentAddressObj)
    // }

    this.permanentPincode = this.formatPincodeData(permenantAddressObj);

    if (!!this.createAddressObject(permenantAddressObj)) {
      permentAddress.patchValue(
        this.createAddressObject(permenantAddressObj)
      );
    }

    if (this.isPermanantAddressSame) {
      this.currentPincode = this.permanentPincode;
      //this.currentAddDatas.push(permenantAddressObj)

      this.isCurrAddSameAsPermAdd = '1';

      currentAddress.patchValue(
        this.createAddressObject(permenantAddressObj)
      );
      currentAddress.disable();
    } else {
      this.isCurrAddSameAsPermAdd = '0';



      this.currentPincode = this.formatPincodeData(currentAddressObj);

      if (!!this.createAddressObject(currentAddressObj)) {
        currentAddress.patchValue(
          this.createAddressObject(currentAddressObj)
        );
      }
    }
    if (this.checkedModifyCurrent) {
      this.isDisabledCheckbox = false;
      this.isPermanantAddressSame = false;
      this.coApplicantForm.get('currentAddress').enable();
    }
  }

  setNonIndividualFormValues() {
    const dedupe = this.coApplicantForm.get('dedupe');
    const details = this.getDetails()
    dedupe.get('aadhar').clearValidators();
    dedupe.get('aadhar').updateValueAndValidity();
    dedupe.get('bussinessEntityType').setValidators([Validators.required]);
    dedupe.get('bussinessEntityType').updateValueAndValidity();

    this.addNonIndFormControls();
    this.removeIndFormControls();
    // if (mobile && mobile.length === 12) {
    //   mobile = mobile.slice(2, 12);
    // }
    let companyPhoneNumber = details.companyPhoneNumber || '';
    if (companyPhoneNumber && companyPhoneNumber.length === 12) {
      companyPhoneNumber = companyPhoneNumber.slice(2, 12);
    }
    this.contactNumber = companyPhoneNumber;
    const dedupeValues = this.applicantDataService.getDedupeValues();
    console.log('dedupeValues', dedupeValues)
    if (dedupeValues) {
      if (dedupeValues['entityType'] === "NONINDIVENTTYP" && dedupeValues['companyPhoneNumber'] !== companyPhoneNumber) {
        this.dedupeMobile = true;
      } else {
        this.dedupeMobile = false;
      }
    } else {
      this.dedupeMobile = false;
    }
    dedupe.patchValue({
      //aadhar : details.aadhar,
      companyPhoneNumber: companyPhoneNumber,
      dateOfIncorporation: details.dateOfIncorporation,
      contactPerson: details.contactPerson,
      corporateIdentificationNumber: details.corporateIdentificationNumber,
      cstVatNumber: details.cstVatNumber,
      gstNumber: details.gstNumber,
      tanNumber: details.tanNumber,
    });

    setTimeout(() => {
      this.listenerForRegisterAddress();
    })
    const address = this.applicant.addressDetails
    const addressObj = this.getAddressObj(address);
    const registeredAddress = this.coApplicantForm.get('registeredAddress');
    const communicationAddress = this.coApplicantForm.get(
      'communicationAddress'
    );
    const registeredAddressObj = addressObj[Constant.REGISTER_ADDRESS];
    const communicationAddressObj =
      addressObj[Constant.CURRENT_ADDRESS] ||
      addressObj[Constant.COMMUNICATION_ADDRESS];
    if (!!registeredAddressObj) {
      //this.regiesterAddDatas.push(registeredAddressObj)
      this.isRegAddressSame =
        registeredAddressObj.isCurrAddSameAsPermAdd === '1';
      this.apiCurrentCheckBox = registeredAddressObj.isCurrAddSameAsPermAdd == '1' ? '1' : '0';
    }
    //  if (!!communicationAddressObj) {
    //   this.communicationAddDatas.push(communicationAddressObj)
    // }


    this.registerPincode = this.formatPincodeData(registeredAddressObj);
    if (!!this.createAddressObject(registeredAddressObj)) {
      registeredAddress.patchValue(
        this.createAddressObject(registeredAddressObj)
      );
    }
    if (this.isRegAddressSame) {
      //this.communicationAddDatas.push(registeredAddressObj)
      this.communicationPincode = this.registerPincode;
      this.isCommAddSameAsRegAdd = '1';
      if (registeredAddressObj) {

        communicationAddress.patchValue(
          this.createAddressObject(registeredAddressObj)
        );
        communicationAddress.patchValue({
          pobox: communicationAddressObj.pobox
        })
      }

      communicationAddress.disable();
      communicationAddress.get('pobox').enable();
    } else {
      this.isCommAddSameAsRegAdd = '0';
      const communicationAddressObj =
        addressObj[Constant.CURRENT_ADDRESS] ||
        addressObj[Constant.COMMUNICATION_ADDRESS];

      this.communicationPincode = this.formatPincodeData(
        communicationAddressObj
      );

      if (!!this.createAddressObject(communicationAddressObj)) {
        communicationAddress.patchValue(
          this.createAddressObject(communicationAddressObj)
        );
        communicationAddress.patchValue({
          pobox: communicationAddressObj.pobox
        })
      }
    }
  }

  listenerForPermenantAddress() {
    const permanatAddress = this.coApplicantForm.get('permentAddress');
    const currentAddress = this.coApplicantForm.get('currentAddress');

    const permAddressLineOne = permanatAddress.get('addressLineOne');
    const permAddressLineTwo = permanatAddress.get('addressLineTwo');
    const permAddressLineThree = permanatAddress.get('addressLineThree');
    const permPincode = permanatAddress.get('pincode');
    const permLandmark = permanatAddress.get('nearestLandmark');
    const permLandlineNumber = permanatAddress.get('landlineNumber');

    const curAddressLineOne = currentAddress.get('addressLineOne');
    const curAddressLineTwo = currentAddress.get('addressLineTwo');
    const curAddressLineThree = currentAddress.get('addressLineThree');
    const curPincode = currentAddress.get('pincode');
    const curLandmark = currentAddress.get('nearestLandmark');
    const curLandlineNumber = currentAddress.get('landlineNumber');

    this.addListenerForPerAdd(permAddressLineOne, curAddressLineOne);
    this.addListenerForPerAdd(permAddressLineTwo, curAddressLineTwo);
    this.addListenerForPerAdd(permAddressLineThree, curAddressLineThree);
    this.addListenerForPerAdd(permPincode, curPincode);
    this.addListenerForPerAdd(permLandmark, curLandmark);
    this.addListenerForPerAdd(permLandlineNumber, curLandlineNumber);

  }

  listenerForRegisterAddress() {
    const registerAddress = this.coApplicantForm.get('registeredAddress');
    const communicationAddress = this.coApplicantForm.get('communicationAddress');

    const regAddressLineOne = registerAddress.get('addressLineOne');
    const regAddressLineTwo = registerAddress.get('addressLineTwo');
    const regAddressLineThree = registerAddress.get('addressLineThree');
    const regPincode = registerAddress.get('pincode');
    const regLandmark = registerAddress.get('nearestLandmark');
    const regLandlineNumber = registerAddress.get('landlineNumber');

    const commAddressLineOne = communicationAddress.get('addressLineOne');
    const commAddressLineTwo = communicationAddress.get('addressLineTwo');
    const commAddressLineThree = communicationAddress.get('addressLineThree');
    const commPincode = communicationAddress.get('pincode');
    const commLandmark = communicationAddress.get('nearestLandmark');
    const commLandlineNumber = communicationAddress.get('landlineNumber');

    this.addListenerForPerAdd(regAddressLineOne, commAddressLineOne);
    this.addListenerForPerAdd(regAddressLineTwo, commAddressLineTwo);
    this.addListenerForPerAdd(regAddressLineThree, commAddressLineThree);
    this.addListenerForPerAdd(regPincode, commPincode);
    this.addListenerForPerAdd(regLandmark, commLandmark);
    this.addListenerForPerAdd(regLandlineNumber, commLandlineNumber);
  }


  addListenerForPerAdd(mainControl, subControl) {
    //let val = mainControl.value
    mainControl.valueChanges.subscribe((value) => {

      if (this.applicantType == 'INDIVENTTYP') {
        if (this.isCurrAddSameAsPermAdd == '1' && this.isPermanantAddressSame) {
          subControl.setValue(value || null)
        }

      } else {
        if (this.isCommAddSameAsRegAdd == '1' && this.isRegAddressSame) {
          subControl.setValue(value || null)
        }
      }
    })

  }

  cityChange(event) {
    const value = event.target.value;
    if (this.applicantType == 'INDIVENTTYP') {
      if (this.isCurrAddSameAsPermAdd == '1' && this.isPermanantAddressSame) {
        const formValue: AddressDetails = this.coApplicantForm.get('permentAddress').value;
        const currentAddress = this.coApplicantForm.get('currentAddress');
        this.currentPincode = this.permanentPincode;
        currentAddress.patchValue({
          ...formValue,
        });
      }
    } else {
      if (this.isCommAddSameAsRegAdd == '1' && this.isRegAddressSame) {
        const formValue: AddressDetails = this.coApplicantForm.get('registeredAddress').value;
        const communicationAddress = this.coApplicantForm.get('communicationAddress');
        this.communicationPincode = this.registerPincode;
        communicationAddress.patchValue({
          ...formValue,
        });
      }

    }

  }

  formatPincodeData(data) {
    if (!data) {
      return;
    }
    return {
      city: [
        {
          key: data.city,
          value: data.cityValue,
        },
      ],
      district: [
        {
          key: data.district,
          value: data.districtValue,
        },
      ],
      state: [
        {
          key: data.state,
          value: data.stateValue,
        },
      ],
      country: [
        {
          key: data.country || data.countryId,
          value: data.countryValue,
        },
      ],
    };
  }

  setValueForFormControl(contorlName: string, value) {
    if (!value) {
      return;
    }
    this.coApplicantForm.patchValue({
      [contorlName]: value,
    });
  }
  getAddressObj(address) {
    //const address = this.applicant.addressDetails;
    const addressObj = {};
    if (address) {
      address.forEach((value) => {
        if (value.addressType === Constant.PERMANENT_ADDRESS) {
          addressObj[Constant.PERMANENT_ADDRESS] = value;
        } else if (value.addressType === Constant.COMMUNICATION_ADDRESS) {
          addressObj[Constant.COMMUNICATION_ADDRESS] = value;
        } else if (value.addressType === Constant.CURRENT_ADDRESS) {
          addressObj[Constant.CURRENT_ADDRESS] = value;
        } else if (value.addressType === Constant.REGISTER_ADDRESS) {
          addressObj[Constant.REGISTER_ADDRESS] = value;
        }
      });
    }
    return addressObj;
  }


  drivingIssueDateShowError(event) {
    //console.log('drivingIssueDateShowError  event', event)
    this.drivingLicenseIssueDate = new Date(event)
    this.showMessage['drivinglicenseExpiry'] = false;
    this.mandatory['drivingLicenseIssueDate'] = false;
    const valueChecked = this.drivingLicenseIssueDate > this.maxDate;
    if (valueChecked) {
      this.showMessage['drivinglicenseIssue'] = true;
      this.drivingIssueInvalidMsg = "Invalid date- Should be Past date"
    } else {
      this.showMessage['drivinglicenseIssue'] = false;
      this.drivingIssueInvalidMsg = ""
    }
    //this.showMessage['drivinglicenseIssue'] = valueChecked ? true : false;
    this.clearDrivingLicenceExpiry()


  }

  passportIssueDateShowError(event) {
    this.passportIssueDate = new Date(event)
    //console.log('event', event)
    this.passportMandatory['passportIssueDate'] = false;
    this.showMessage['passportExpiry'] = false;

    if (this.passportIssueDate < this.minPassportIssueDate) {
      this.showMessage['passportIssue'] = true;
      this.passportIssueInvalidMsg = "Passport Issuance date prior to 10 years will not be accepted"
    } else if (this.passportIssueDate >= this.toDayDate) {
      this.showMessage['passportIssue'] = true;
      this.passportIssueInvalidMsg = "Invalid date- Should be Past date"
    } else {
      this.showMessage['passportIssue'] = false;
      this.passportIssueInvalidMsg = "";
      //console.log('date', this.coApplicantForm.get('dedupe').get('passportIssueDate').value)

      this.maxPassportExpiryDate = this.passportIssueDate;
      this.maxPassportExpiryDate.setFullYear(this.maxPassportExpiryDate.getFullYear() + 10)
      this.maxPassportExpiryDate.setDate(this.maxPassportExpiryDate.getDate() - 1)

      console.log('date', this.maxPassportExpiryDate)
      // 

    }

    this.clearPassportExpiry()

  }

  clearPassportExpiry() {
    this.coApplicantForm.get('dedupe').get('passportExpiryDate').setValue(null);
    this.coApplicantForm.get('dedupe').get('passportExpiryDate').setValidators(Validators.required)
    this.coApplicantForm.get('dedupe').get('passportExpiryDate').updateValueAndValidity();
    this.passportMandatory['passportExpiryDate'] = true;
  }

  clearDrivingLicenceExpiry() {
    //console.log('drivinglicesEXpiry', this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').value)
    this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').setValue(null);
    this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').setValidators(Validators.required)
    this.coApplicantForm.get('dedupe').get('drivingLicenseExpiryDate').updateValueAndValidity();
  }

  drivingLicenceExpiryShowError(event) {
    this.drivingLicenseExpiryDate = new Date(event)
    this.mandatory['drivingLicenseExpiryDate'] = false;

    if (this.drivingLicenseExpiryDate < this.toDayDate) {
      this.showMessage['drivingLicenseExpiry'] = true;
      this.drivingExpiryInvalidMsg = "Invalid date- Should be Future Date"
    } else {
      this.showMessage['drivingLicenseExpiry'] = false;
      this.drivingExpiryInvalidMsg = ""
    }

  }
  passportExpiryShowError(event) {
    this.passportExpiryDate = new Date(event)
    this.passportMandatory['passportExpiryDate'] = false;
    //console.log('COAPPLICANT FORM ',this.coApplicantForm)

    if (this.passportExpiryDate <= this.maxDate) {
      this.showMessage['passportExpiry'] = true;
      this.passportExpiryInvalidMsg = "Invalid date- Should be Future date"
    } else if (this.passportExpiryDate > this.maxPassportExpiryDate) {
      this.showMessage['passportExpiry'] = true;
      this.passportExpiryInvalidMsg = "Passport expiry date should be 10 years from Issuance date"
    } else {
      this.showMessage['passportExpiry'] = false;
      this.passportExpiryInvalidMsg = "";
    }
    //  console.log(this.toDayDate,'maxPassportExpiryDate', this.maxPassportExpiryDate)
    //  console.log('eroor', this.coApplicantForm.get('dedupe').get('passportExpiryDate').errors)


  }

  onAddrSameAsApplicant(event) {
    const checked = event.target.checked;
    if (checked) {
      this.checkedAddressLead = '1';
      const data = {
        leadId: this.leadId
      }
      this.applicantService.getAddressDetails(data).subscribe((res) => {
        if (res['ProcessVariables'].error.code == '0') {
          this.leadAddressDetails = res['ProcessVariables'].addressDetails;
          if (this.leadAddressDetails !== null) {
            this.setLeadAddressDetails();
          } else {
            this.toasterService.showInfo(
              'There is no main applicant address datas', ''
            );
            this.checkedAddressLead = '0';
          }
        } else {
          this.toasterService.showError(
            res['ProcessVariables'].error.message,
            'Dedupe'
          );
        }

      })
    } else if (!checked) {
      this.checkedAddressLead = '0';
      const currentAddress = this.coApplicantForm.get('currentAddress');
      const permenantAddress = this.coApplicantForm.get('permentAddress');
      this.isDisabledCheckbox = false;
      currentAddress.enable();
      permenantAddress.enable();
      currentAddress.reset();
      permenantAddress.reset();
    }
  }

  getLeadAddress() {
    const address = this.leadAddressDetails;
    const addressObj = {};
    if (address) {
      address.forEach((value) => {
        if (value.addressType === Constant.PERMANENT_ADDRESS) {
          addressObj[Constant.PERMANENT_ADDRESS] = value;
        } else if (value.addressType === Constant.CURRENT_ADDRESS) {
          addressObj[Constant.CURRENT_ADDRESS] = value;
        }
      });
    }
    return addressObj;
  }

  setLeadAddressDetails() {
    const permentAddress = this.coApplicantForm.get('permentAddress');
    const currentAddress = this.coApplicantForm.get('currentAddress');
    const addressObj = this.getLeadAddress();

    const permenantAddressObj = addressObj[Constant.PERMANENT_ADDRESS];

    this.permanentPincode = this.formatPincodeData(permenantAddressObj);

    if (!!this.createAddressObject(permenantAddressObj)) {
      permentAddress.patchValue(
        this.createAddressObject(permenantAddressObj)
      );
    }


    const currentAddressObj = addressObj[Constant.CURRENT_ADDRESS];
    this.currentPincode = this.formatPincodeData(currentAddressObj);
    if (!!this.createAddressObject(currentAddressObj)) {
      currentAddress.patchValue(
        this.createAddressObject(currentAddressObj)
      );
    }
    this.isDisabledCheckbox = true
    this.isPermanantAddressSame = false;
    permentAddress.disable();
    currentAddress.disable();

  }

  checkUcic() {
    if (this.applicant) {
      return !this.applicant.ucic ? true : false;
    } else {
      return true;
    }
  }

  onNext() {
    const formValue = this.coApplicantForm.getRawValue();


    if (this.applicantType === 'INDIVENTTYP') {
      this.nextForIndividual(formValue)
    } else {
      this.nextForNonIndividual(formValue)
    }
  }

  nextForIndividual(formValue) {
    this.finalValue = {
      dedupe: formValue.dedupe,
      permentAddress: formValue.permentAddress,
      currentAddress: formValue.currentAddress
    }
    const dob = this.coApplicantForm.getRawValue().dedupe.dob
    const passportIssueDate = this.coApplicantForm.getRawValue().dedupe.passportIssueDate
    const passportExpiryDate = this.coApplicantForm.getRawValue().dedupe.passportExpiryDate
    const drivingLicenseIssueDate = this.coApplicantForm.getRawValue().dedupe.drivingLicenseIssueDate
    const drivingLicenseExpiryDate = this.coApplicantForm.getRawValue().dedupe.drivingLicenseExpiryDate

    this.finalValue.dedupe.dob = this.utilityService.getDateFormat(dob)
    this.finalValue.dedupe.passportIssueDate = this.utilityService.getDateFormat(passportIssueDate)
    this.finalValue.dedupe.passportExpiryDate = this.utilityService.getDateFormat(passportExpiryDate)
    this.finalValue.dedupe.drivingLicenseIssueDate = this.utilityService.getDateFormat(drivingLicenseIssueDate)
    this.finalValue.dedupe.drivingLicenseExpiryDate = this.utilityService.getDateFormat(drivingLicenseExpiryDate)

    // console.log(JSON.stringify(this.apiValue));
    //  console.log(JSON.stringify(this.finalValue));
    // console.log(this.objectComparisonService.compare(this.apiValue, this.finalValue));
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue);
    let isCheckboxChange: boolean
    if (this.checkedAddressLead !== this.apiAddressLeadCheckBox ||
      this.isCurrAddSameAsPermAdd !== this.apiCurrentCheckBox) {
      isCheckboxChange = false;
    } else {
      isCheckboxChange = true;
    }
    if (this.checkUcic()) {
      if (
        this.coApplicantForm.get('dedupe').invalid ||
        !formValue.permentAddress.addressLineOne ||
        !formValue.permentAddress.pincode ||
        !formValue.permentAddress.city ||
        !formValue.currentAddress.addressLineOne ||
        !formValue.currentAddress.pincode ||
        !formValue.currentAddress.city
      ) {
        this.toasterService.showInfo(
          'Please SAVE details before proceeding',
          ''
        );
        return;
      }
    } else {
      const isValidateNonUcic = this.validateUcicBasedIndFields();
      if (isValidateNonUcic ||
        !formValue.currentAddress.addressLineOne ||
        !formValue.currentAddress.pincode ||
        !formValue.currentAddress.city ||
        !this.SRNumberValidate) {
        this.toasterService.showInfo(
          'Please SAVE details before proceeding',
          ''
        );
        return;
      }
    }

    if (!isValueCheck || !isCheckboxChange || this.isExtCustValueChange) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }


    if (this.dedupeMobile || !this.applicant.otpVerified) {
      const currentUrl = this.location.path();
      if (currentUrl.includes('sales')) {
        this.applicantDataService.setNavigateForDedupe(true)
      } else {
        this.applicantDataService.setNavigateForDedupe(false)
      }
      this.applicantDataService.setUrl(currentUrl);
      this.router.navigateByUrl(
        `/pages/lead-section/${this.leadId}/otp-section/${this.applicantId}`
      );
    } else {
      // console.log("GO NEXT")
      this.navigateToApplicantList();
    }
    // }
  }

  nextForNonIndividual(formValue) {
    this.finalValue = {
      dedupe: formValue.dedupe,
      registeredAddress: formValue.registeredAddress,
      communicationAddress: formValue.communicationAddress
    }
    const doc = this.coApplicantForm.getRawValue().dedupe.dateOfIncorporation
    this.finalValue.dedupe.dateOfIncorporation = this.utilityService.getDateFormat(doc)
    // console.log(JSON.stringify(this.apiValue));
    //  console.log(JSON.stringify(this.finalValue));
    // console.log(this.objectComparisonService.compare(this.apiValue, this.finalValue));
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue);
    let isCheckboxChange: boolean
    if (this.isCommAddSameAsRegAdd !== this.apiCurrentCheckBox) {
      isCheckboxChange = false;
    } else {
      isCheckboxChange = true;
    }
    if (this.checkUcic()) {
      if (
        this.coApplicantForm.get('dedupe').invalid ||
        !formValue.registeredAddress.addressLineOne ||
        !formValue.registeredAddress.pincode ||
        !formValue.registeredAddress.city ||
        !formValue.communicationAddress.addressLineOne ||
        !formValue.communicationAddress.pincode ||
        !formValue.communicationAddress.city
      ) {
        this.toasterService.showInfo(
          'Please SAVE details before proceeding',
          ''
        );
        return;
      }
    } else {
      const isValidateNonUcic = this.validateUcicBasedNonIndFields()
      if (isValidateNonUcic) {
        this.toasterService.showInfo(
          'Please SAVE details before proceeding',
          ''
        );
        return;
      }
    }

    if (!isValueCheck || !isCheckboxChange || this.isExtCustValueChange) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    if (this.dedupeMobile || !this.applicant.otpVerified) {
      const currentUrl = this.location.path();
      if (currentUrl.includes('sales')) {
        this.applicantDataService.setNavigateForDedupe(true)
      } else {
        this.applicantDataService.setNavigateForDedupe(false)
      }
      this.applicantDataService.setUrl(currentUrl);
      this.router.navigateByUrl(
        `/pages/lead-section/${this.leadId}/otp-section/${this.applicantId}`
      );
    } else {
      this.navigateToApplicantList();
      //console.log("GO NEXT")
    }
    // }
  }


  onRetreiveAdhar() {
    const referenceNo = this.coApplicantForm.get('dedupe').get('aadhar').value || this.apiReferenceNo;
    this.backupRefNo = this.coApplicantForm.get('dedupe').get('aadhar').value;
    //const referenceNo="100006010628"
    this.applicantService.retreiveAdhar(referenceNo).subscribe((res) => {
      if (res['ProcessVariables'].error.code == "0") {
        const uid = res['ProcessVariables'].uid
        this.coApplicantForm.get('dedupe').get('aadhar').setValue(uid)
        this.isAadharChanged = false;
        //this.isEnableDedupe = false;
      }
      else {
        this.toasterService.showError(res['ProcessVariables'].error.message, '')
      }
    })
  }

  storeAdhar(event) {
    this.storeAdharFlag = true;
    this.storeAdharValue = event.target.value;
    const dedupe = this.coApplicantForm.get('dedupe');

    if (!dedupe.get('aadhar').invalid) {
      this.enableDedupeBasedOnChanges(this.storeAdharValue !== this.aadhar);
      this.isAadharChanged = this.storeAdharValue !== this.aadhar;
      if (this.storeAdharValue !== this.aadhar) {
        this.ekycBuutonAdharBased = true;
      }
    }
    else {
      this.isAadharChanged = true;
    }

  }

  onRelieve() {
    if (this.applicantType == 'INDIVENTTYP') {

      if (!this.applicant) {
        const adhar = this.coApplicantForm.get('dedupe').get('aadhar').value;
        this.coApplicantForm.get('dedupe').get('aadhar').setValue(adhar);
        const dedupeFlag = this.applicantDataService.getDedupeFlag();
        if (dedupeFlag) {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(this.backupRefNo || adhar);
        }
      }
      else {
        const referenceNo = this.apiReferenceNo || this.applicant.indivIdentityInfoDetails.aadhar;
        const storeData = this.storeAdharValue || ''
        if (storeData) {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(storeData)
        }
        else if (storeData == '' && this.storeAdharFlag) {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(storeData)
        } else if (referenceNo && referenceNo.length == 12) {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(referenceNo)
        } else {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(referenceNo)
        }


      }

    } else {
      if (this.applicant == undefined) {
        const adhar = this.coApplicantForm.get('dedupe').get('aadhar').value;
        this.coApplicantForm.get('dedupe').get('aadhar').setValue(adhar);
        const dedupeFlag = this.applicantDataService.getDedupeFlag();

        if (dedupeFlag) {                                        //when come from review applicant button, storing adhar no
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(this.backupRefNo || adhar);
        }
      }
      else {
        const referenceNo = this.applicant.corporateProspectDetails.aadhar || '';
        const storeData = this.storeAdharValue || ''
        if (storeData) {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(storeData)
        }
        else if (storeData == '' && this.storeAdharFlag) {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(storeData)
        } else if (referenceNo && referenceNo.length == 12) {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(referenceNo)
        } else {
          this.coApplicantForm.get('dedupe').get('aadhar').setValue(referenceNo)
        }

      }
    }


  }




  validateSrNumber(event) {
    // this.SRNumberValidate = true;
    const value = event.target.value;
    if (value.length === 15 && (!this.successSR || !this.failureSR)) {
      if (!this.successSrValue) {
        this.getSRNumberValidation(value);
        return;
      }
      if (value !== this.storeSRNumber) {
        if (this.successSrValue && value !== this.successSrValue) {
          this.getSRNumberValidation(value);
        }

      } else {
        this.SRNumberValidate = !this.validateSrBoolean ? true : false

      }

    }
    else {
      this.SRNumberValidate = true;
    }
  }

  getSRNumberValidation(value) {
    this.applicantService.validateSRNumberModification({
      srNo: value
    }).subscribe((res) => {
      const responce = res['ProcessVariables']
      this.SRNumberValidate = responce.isSrValid ? true : false

      if (responce.error.code == '0') {
        this.successSrValue = value;
        this.successSR = true;
        this.failureSR = false;
        this.toasterService.showSuccess(responce.error.message, 'SR Number validation successful')
      } else {
        this.failureSR = true;
        this.successSR = false;
        this.toasterService.showError('', responce.error.message)
      }
      this.storeSRNumber = value
    })
  }

  getEntityObject(key: string) {
    return this.values.entity.find((value) => value.key === Number(key));
  }

  formatGivenDate(date) {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-us') : '';
  }
  storeIndividualValueInService(coApplicantModel) {
    const dedupe = coApplicantModel.dedupe;

    if (this.dedupeVaribales) {
      if (this.dedupeVaribales.referenceNo !== '') {
        this.referenceAdharNo = this.dedupeVaribales.referenceNo
      } else {
        this.referenceAdharNo = dedupe.aadhar
      }
    }
    else {
      this.referenceAdharNo = dedupe.aadhar
    }
    if (dedupe.dob) {
      //const date = new Date(dedupe.dob);
      dedupe.dob = this.utilityService.getDateFormat(dedupe.dob);
    }
    // if (dedupe.passportIssueDate) {
    //   const date = dedupe.passportIssueDate
    //   date.setFullYear(date.getFullYear() - 10)
    //   dedupe.passportIssueDate = date

    // }
    let mobileNumber = dedupe.mobilePhone;
    if (mobileNumber.length === 12) {
      mobileNumber = mobileNumber.slice(2, 12);
    }
    this.gender = dedupe.gender
    this.aboutIndivProspectDetails = {
      dob: dedupe.dob,
      mobilePhone: mobileNumber,
      gender: this.gender
    };

    this.indivIdentityInfoDetails = {
      panType: dedupe.panType,
      pan: String(dedupe.pan || '').toUpperCase(),
      aadhar: this.referenceAdharNo,
      passportNumber: String(dedupe.passportNumber || '').toUpperCase(),
      passportIssueDate: this.formatGivenDate(dedupe.passportIssueDate),
      passportExpiryDate: this.formatGivenDate(dedupe.passportExpiryDate),
      drivingLicenseNumber: String(
        dedupe.drivingLicenseNumber || ''
      ).toUpperCase(),
      drivingLicenseIssueDate: this.formatGivenDate(
        dedupe.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.formatGivenDate(
        dedupe.drivingLicenseExpiryDate
      ),
      voterIdNumber: String(dedupe.voterIdNumber || '').toUpperCase(),
    };

    this.addressDetails = [];
    this.isCurrAddSameAsPermAdd = this.isPermanantAddressSame ? '1' : '0'
    const permanentAddress = coApplicantModel.permentAddress;
    if (permanentAddress) {
      const addressObject = this.createAddressObject(permanentAddress);
      this.addressDetails.push({
        ...addressObject,
        addressType: Constant.PERMANENT_ADDRESS,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
      });
    }
    const currentAddress = coApplicantModel.currentAddress;
    if (currentAddress) {
      const addressObject = this.createAddressObject(currentAddress);
      this.addressDetails.push({
        ...addressObject,
        addressType: Constant.CURRENT_ADDRESS,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
      });
    }
  }

  storeNonIndividualValueInService(coApplicantModel) {
    const dedupe = coApplicantModel.dedupe;
    if (this.dedupeVaribales) {
      if (this.dedupeVaribales.referenceNo !== '') {
        this.referenceAdharNo = this.dedupeVaribales.referenceNo
      } else {
        this.referenceAdharNo = dedupe.aadhar
      }
    }
    else {
      this.referenceAdharNo = dedupe.aadhar
    }

    this.applicantDetails = {
      title: dedupe.title,
      bussinessEntityType: dedupe.bussinessEntityType,
    };
    this.corporateProspectDetails = {
      aadhar: this.referenceAdharNo,
      gstNumber: dedupe.gstNumber,
      tanNumber: dedupe.tanNumber,
      cstVatNumber: dedupe.cstVatNumber,
      companyPhoneNumber: dedupe.companyPhoneNumber,
      dateOfIncorporation: this.formatGivenDate(dedupe.dateOfIncorporation),
      panNumber: String(dedupe.pan || '').toUpperCase(),
      panType: dedupe.panType,
      corporateIdentificationNumber: dedupe.corporateIdentificationNumber,
      contactPerson: dedupe.contactPerson,
    };

    const registerAddress = coApplicantModel.registeredAddress;
    if (registerAddress) {
      this.addressDetails = [];
      const addressObject = this.createAddressObject(registerAddress);
      this.addressDetails.push({
        ...addressObject,
        addressType: Constant.REGISTER_ADDRESS,
        isCurrAddSameAsPermAdd: this.isCommAddSameAsRegAdd,
      });
    }
    const communicationAddress = coApplicantModel.communicationAddress;
    if (communicationAddress) {
      const addressObject = this.createAddressObject(communicationAddress);
      this.addressDetails.push({
        ...addressObject,
        addressType: Constant.COMMUNICATION_ADDRESS,
        isCurrAddSameAsPermAdd: this.isCommAddSameAsRegAdd,
        pobox: communicationAddress.pobox
      });
    }
  }
  onFormSubmit() {
    console.log('Form', this.coApplicantForm);
    const formValue = this.coApplicantForm.getRawValue();

    const coApplicantModel = {
      ...formValue,
      entity: this.getEntityObject(formValue.entity),
    };


    if (this.applicantType === 'INDIVENTTYP') {

      if (this.checkUcic()) {
        if (
          this.coApplicantForm.get('dedupe').invalid ||
          // this.coApplicantForm.get('permentAddress').invalid ||
          // this.coApplicantForm.get('currentAddress').invalid ||
          !formValue.permentAddress.addressLineOne ||
          !formValue.permentAddress.pincode ||
          !formValue.permentAddress.city ||
          !formValue.currentAddress.addressLineOne ||
          !formValue.currentAddress.pincode ||
          !formValue.currentAddress.city ||
          this.coApplicantForm.get('srNumber').invalid ||
          this.panValidate ||
          !this.SRNumberValidate ||
          this.showMessage['drivinglicenseIssue'] ||
          this.showMessage['passportIssue'] ||
          this.showMessage['drivingLicenseExpiry'] ||
          this.showMessage['passportExpiry']
        ) {
          this.isDirty = true;
          this.isDirtyUcic = true;
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
      } else {
        const isValidateNonUcic = this.validateUcicBasedIndFields()
        if (isValidateNonUcic ||
          !formValue.currentAddress.addressLineOne ||
          !formValue.currentAddress.pincode ||
          !formValue.currentAddress.city ||
          !this.SRNumberValidate) {
          this.isDirtyUcic = true;
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

      }

      this.storeIndividualValueInService(coApplicantModel);
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
      if (this.checkUcic()) {
        if (
          this.coApplicantForm.get('dedupe').invalid ||
          !formValue.registeredAddress.addressLineOne ||
          !formValue.registeredAddress.pincode ||
          !formValue.registeredAddress.city ||
          !formValue.communicationAddress.addressLineOne ||
          !formValue.communicationAddress.pincode ||
          !formValue.communicationAddress.city ||
          this.panValidate
        ) {
          this.isDirty = true;
          this.isDirtyUcic = true;
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

      } else {
        const isValidateNonUcic = this.validateUcicBasedNonIndFields()
        if (isValidateNonUcic) {
          this.isDirtyUcic = true;
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
      }

      this.storeNonIndividualValueInService(coApplicantModel);
      this.applicantDataService.setIndividualProspectDetails(null);
      this.applicantDataService.setIndivIdentityInfoDetails(null);
    }
    if (this.selectedApplicant !== undefined) {
      this.leadStoreService.updateApplicant(
        this.selectedApplicant,
        coApplicantModel
      );
      return;
    }

    this.leadStoreService.setCoApplicantDetails(coApplicantModel);
    this.applicantDetails = {
      entityType: coApplicantModel.dedupe.entityType,
      name1: coApplicantModel.dedupe.name1,
      name2: coApplicantModel.dedupe.name2,
      name3: coApplicantModel.dedupe.name3,
      loanApplicationRelation: coApplicantModel.dedupe.loanApplicationRelation,
      bussinessEntityType: coApplicantModel.dedupe.bussinessEntityType,
      custSegment: coApplicantModel.dedupe.custSegment,
      monthlyIncomeAmount: coApplicantModel.dedupe.monthlyIncomeAmount,
      annualIncomeAmount: coApplicantModel.dedupe.annualIncomeAmount,
      ownHouseProofAvail: this.isChecked == true ? '1' : '0',
      houseOwnerProperty: coApplicantModel.dedupe.houseOwnerProperty,
      ownHouseAppRelationship: coApplicantModel.dedupe.ownHouseAppRelationship,
      averageBankBalance: coApplicantModel.dedupe.averageBankBalance,
      rtrType: coApplicantModel.dedupe.rtrType,
      prevLoanAmount: coApplicantModel.dedupe.prevLoanAmount,
      loanTenorServiced: Number(coApplicantModel.dedupe.loanTenorServiced),
      currentEMILoan: coApplicantModel.dedupe.currentEMILoan,
      agriNoOfAcres: Number(coApplicantModel.dedupe.agriNoOfAcres),
      agriOwnerProperty: coApplicantModel.dedupe.agriOwnerProperty,
      agriAppRelationship: coApplicantModel.dedupe.agriAppRelationship,
      grossReceipt: coApplicantModel.dedupe.grossReceipt,
      isAddrSameAsApplicant: this.checkedAddressLead,
      modifyCurrentAddress: this.checkedModifyCurrent == true ? '1' : '0',
      srNumber: coApplicantModel.srNumber

      //customerCategory: 'SALCUSTCAT',
    };
    const DOB = this.utilityService.getDateFormat(coApplicantModel.dedupe.dob);


    const data = {
      applicantDetails: this.applicantDetails,
      aboutIndivProspectDetails: this.aboutIndivProspectDetails,
      indivIdentityInfoDetails: this.indivIdentityInfoDetails,
      indivProspectProfileDetails: this.indivProspectProfileDetails,
      corporateProspectDetails: this.corporateProspectDetails,
      addressDetails: this.addressDetails,
      directorDetails: this.directorDetails,
      applicantId: this.applicantId,
      leadId: this.leadId,
      isMobileNumberChanged: this.isMobileChanged,
      ekycDone: this.ekycDone == '1' ? '1' : '0'
    };

    this.applicantService.saveApplicant(data).subscribe((res: any) => {
      const response = res;
      const message = response.ProcessVariables.error.message;
      if (response.ProcessVariables.error.code === '0') {
        this.isExtCustValueChange = false
        if (data.applicantDetails.entityType == 'INDIVENTTYP') {
          //this.storeSuccessIndivaidualValues(data)

          this.apiValue = {
            dedupe: formValue.dedupe,
            permentAddress: formValue.permentAddress,
            currentAddress: formValue.currentAddress
          }
          const dob = this.coApplicantForm.getRawValue().dedupe.dob
          const passportIssueDate = this.coApplicantForm.getRawValue().dedupe.passportIssueDate
          const passportExpiryDate = this.coApplicantForm.getRawValue().dedupe.passportExpiryDate
          const drivingLicenseIssueDate = this.coApplicantForm.getRawValue().dedupe.drivingLicenseIssueDate
          const drivingLicenseExpiryDate = this.coApplicantForm.getRawValue().dedupe.drivingLicenseExpiryDate

          this.apiValue.dedupe.dob = this.utilityService.getDateFormat(dob)
          this.apiValue.dedupe.passportIssueDate = this.utilityService.getDateFormat(passportIssueDate)
          this.apiValue.dedupe.passportExpiryDate = this.utilityService.getDateFormat(passportExpiryDate)
          this.apiValue.dedupe.drivingLicenseIssueDate = this.utilityService.getDateFormat(drivingLicenseIssueDate)
          this.apiValue.dedupe.drivingLicenseExpiryDate = this.utilityService.getDateFormat(drivingLicenseExpiryDate)
          this.apiCurrentCheckBox = this.isCurrAddSameAsPermAdd;
          this.apiAddressLeadCheckBox = this.checkedAddressLead;

        } else {
          //this.storeSuccessNonIndValues(data)
          this.apiValue = {
            dedupe: formValue.dedupe,
            registeredAddress: formValue.registeredAddress,
            communicationAddress: formValue.communicationAddress
          }
          const doc = this.coApplicantForm.getRawValue().dedupe.dateOfIncorporation
          this.apiValue.dedupe.dateOfIncorporation = this.utilityService.getDateFormat(doc)
          this.apiCurrentCheckBox = this.isCommAddSameAsRegAdd;
        }
        this.toasterService.showSuccess('Record Saved Successfully', '');
      } else {
        this.toasterService.showError('Applicant Details', message)
      }
    })
  }

  validateUcicBasedIndFields() {

    let isValidateNonUcic: boolean
    const dedupe = this.coApplicantForm.get('dedupe')

    if (this.coApplicantForm.get('srNumber').invalid ||
      dedupe.get('loanApplicationRelation').invalid ||
      dedupe.get('custSegment').invalid ||
      dedupe.get('monthlyIncomeAmount').invalid ||
      dedupe.get('ownHouseProofAvail').invalid ||
      dedupe.get('houseOwnerProperty').invalid ||
      dedupe.get('ownHouseAppRelationship').invalid ||
      dedupe.get('averageBankBalance').invalid ||
      dedupe.get('rtrType').invalid ||
      dedupe.get('prevLoanAmount').invalid ||
      dedupe.get('loanTenorServiced').invalid ||
      dedupe.get('currentEMILoan').invalid ||
      dedupe.get('agriNoOfAcres').invalid ||
      dedupe.get('agriOwnerProperty').invalid ||
      dedupe.get('agriAppRelationship').invalid ||
      dedupe.get('grossReceipt').invalid) {

      return isValidateNonUcic = true;
    } else {
      return isValidateNonUcic = false;
    }
  }

  validateUcicBasedNonIndFields() {
    let isValidateNonUcic: boolean
    const dedupe = this.coApplicantForm.get('dedupe')
    if (
      dedupe.get('loanApplicationRelation').invalid ||
      dedupe.get('bussinessEntityType').invalid ||
      dedupe.get('monthlyIncomeAmount').invalid ||
      dedupe.get('ownHouseProofAvail').invalid ||
      dedupe.get('houseOwnerProperty').invalid ||
      dedupe.get('ownHouseAppRelationship').invalid ||
      dedupe.get('averageBankBalance').invalid ||
      dedupe.get('rtrType').invalid ||
      dedupe.get('prevLoanAmount').invalid ||
      dedupe.get('loanTenorServiced').invalid ||
      dedupe.get('currentEMILoan').invalid ||
      dedupe.get('agriNoOfAcres').invalid ||
      dedupe.get('agriOwnerProperty').invalid ||
      dedupe.get('agriAppRelationship').invalid ||
      dedupe.get('grossReceipt').invalid) {

      return isValidateNonUcic = true;
    } else {
      return isValidateNonUcic = false;
    }
  }



  onModCurrAddress(event) {
    const eventClicked = event.target.checked;
    if (eventClicked) {
      this.showSrField = true;
      this.checkedModifyCurrent = true;
      this.coApplicantForm.get('srNumber').setValue(null);
      this.coApplicantForm.get('srNumber').setValidators([Validators.required]);
      this.coApplicantForm.get('srNumber').updateValueAndValidity();

      const currentAddress = this.coApplicantForm.get('currentAddress');
      currentAddress.enable();
      this.isPermanantAddressSame = false;
      this.isDisabledCheckbox = false;

    } else {
      this.showSrField = false;
      this.checkedModifyCurrent = false;
      this.coApplicantForm.get('srNumber').setValue(null);
      this.coApplicantForm.get('srNumber').clearValidators();
      this.coApplicantForm.get('srNumber').updateValueAndValidity();

      const address = this.applicant.addressDetails
      const addressObj = this.getAddressObj(address);
      const currentAddressObj = addressObj[Constant.CURRENT_ADDRESS];
      const currentAddress = this.coApplicantForm.get('currentAddress');
      this.currentPincode = this.formatPincodeData(currentAddressObj);

      if (!!this.createAddressObject(currentAddressObj)) {
        currentAddress.patchValue(
          this.createAddressObject(currentAddressObj)
        );
      }
      currentAddress.disable();
      this.isPermanantAddressSame = true;
      this.isDisabledCheckbox = true;
      this.SRNumberValidate = true;
    }
  }

  onAddress(event) {
    const eventClicked = event.target.checked;
    this.isCurrAddSameAsPermAdd = eventClicked ? '1' : '0';
    const currentAddress = this.coApplicantForm.get('currentAddress');
    if (eventClicked) {
      const formValue: AddressDetails = this.coApplicantForm.get('permentAddress').value;
      this.isPermanantAddressSame = true;
      this.currentPincode = this.permanentPincode;
      //const permanentAddress = this.coApplicantForm.get('currentAddress');
      currentAddress.patchValue({
        ...formValue,
      });
      currentAddress.disable();
    } else if (!eventClicked) {
      this.isPermanantAddressSame = false

      currentAddress.enable();
      currentAddress.reset()
    }
  }
  onAddressCommunication(event) {
    const eventClicked = event.target.checked;
    this.isCommAddSameAsRegAdd = eventClicked ? '1' : '0';
    const communicationAddress = this.coApplicantForm.get(
      'communicationAddress'
    );
    if (eventClicked) {
      this.isRegAddressSame = true;
      const formValue: AddressDetails = this.coApplicantForm.value
        .registeredAddress;
      this.communicationPincode = this.registerPincode;
      communicationAddress.patchValue({
        ...formValue,
      });
      communicationAddress.disable();
      communicationAddress.get('pobox').enable();
    } else if (!eventClicked) {
      this.isRegAddressSame = false;
      communicationAddress.enable();
      communicationAddress.reset();
    }
  }


  enableDedupeButton() {
    const dedupe = this.coApplicantForm.get('dedupe');
    dedupe.get('name1').valueChanges.subscribe((value) => {
      const status = this.getValidStatus('name1');
      if (status === 'VALID') {
      } else {
      }
    });
  }

  getValidStatus(controlName: string) {
    return this.coApplicantForm.get('dedupe').get(controlName).status;
  }
  setDedupeValidators() {
    const dedupe = this.coApplicantForm.get('dedupe');
    if (
      this.productCategory == '1003' &&
      (this.fundingProgram == '25' || this.fundingProgram == '24')
    ) {
      dedupe.get('monthlyIncomeAmount').setValidators([Validators.required]);
      dedupe.get('monthlyIncomeAmount').updateValueAndValidity();
      // dedupe.get('annualIncomeAmount').setValidators([Validators.required]);
      // dedupe.get('annualIncomeAmount').updateValueAndValidity();
    }

    if (this.productCategory == '1003' && this.fundingProgram == '27') {
      dedupe.get('rtrType').setValidators([Validators.required]);
      dedupe.get('rtrType').updateValueAndValidity();
      dedupe.get('prevLoanAmount').setValidators([Validators.required]);
      dedupe.get('prevLoanAmount').updateValueAndValidity();
      dedupe.get('loanTenorServiced').setValidators([Validators.required]);
      dedupe.get('loanTenorServiced').updateValueAndValidity();
      dedupe.get('currentEMILoan').setValidators([Validators.required]);
      dedupe.get('currentEMILoan').updateValueAndValidity();
    }
    if (this.productCategory == '1003' && this.fundingProgram == '29') {
      dedupe.get('agriNoOfAcres').setValidators([Validators.required]);
      dedupe.get('agriNoOfAcres').updateValueAndValidity();
      dedupe.get('agriOwnerProperty').setValidators([Validators.required]);
      dedupe.get('agriOwnerProperty').updateValueAndValidity();
      dedupe.get('agriAppRelationship').setValidators([Validators.required]);
      dedupe.get('agriAppRelationship').updateValueAndValidity();
    }
    if (this.productCategory == '1003' && this.fundingProgram == '30') {
      dedupe.get('grossReceipt').setValidators([Validators.required]);
      dedupe.get('grossReceipt').updateValueAndValidity();
    }
  }

  // setDrivingLicenceValidator() {
  //   const dedupe = this.coApplicantForm.get('dedupe');

  //   if (
  //     (this.drivingLicenseIssueDate !== '' &&
  //       this.drivingLicenseIssueDate !== undefined) ||
  //     (this.drivingLicenseExpiryDate !== undefined &&
  //       this.drivingLicenseExpiryDate !== '')
  //   ) {
  //     dedupe.get('drivingLicenseNumber').setValidators(Validators.required);
  //     dedupe.get('drivingLicenseNumber').updateValueAndValidity();
  //   }
  // }

  checkDedupe() {
    console.log('dedupe', this.coApplicantForm.get('dedupe'));

    if (this.hideMsgForOwner) {
      const houseOwner = this.coApplicantForm.get('dedupe').get('houseOwnerProperty').value;
      const ownHouseAppRelationship = this.coApplicantForm.get('dedupe').get('ownHouseAppRelationship').value
      this.coApplicantForm.get('dedupe').patchValue({
        houseOwnerProperty: houseOwner,
        ownHouseAppRelationship: ownHouseAppRelationship
      })
    }
    this.applicantDataService.setDedupeFlag(false);
    this.storeAdharFlag = false;
    const dedupe = this.coApplicantForm.get('dedupe');
    if (this.applicantType == 'NONINDIVENTTYP') {
      this.addNonIndFormControls();
      this.removeIndFormControls();

      if (dedupe.invalid) {
        this.isDirty = true;
        this.isDirtyUcic = true;
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

      this.storeNonIndividualDedupeValue();
    } else {

      if (dedupe.invalid ||
        this.showMessage['drivinglicenseIssue'] ||
        this.showMessage['passportIssue'] ||
        this.showMessage['drivingLicenseExpiry'] ||
        this.showMessage['passportExpiry']) {
        this.isDirty = true;
        this.isDirtyUcic = true;
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
      this.storeIndividualDedupeValues();


    }
  }

  storeNonIndividualDedupeValue() {
    const values = this.coApplicantForm.getRawValue();
    const applicantDetails = values.dedupe;

    let companyPhoneNumber = applicantDetails.companyPhoneNumber;
    this.contactNumber = companyPhoneNumber;
    // if (this.mobileNumber.length == 10) {
    this.contactNumber = this.contactNumber;
    // }

    if (applicantDetails.dateOfIncorporation) {
      const date = new Date(applicantDetails.dateOfIncorporation);
      applicantDetails.dateOfIncorporation = this.utilityService.getDateFormat(
        applicantDetails.dateOfIncorporation
      );
    }

    const data = {
      leadId: this.leadId,
      entityType: applicantDetails.entityType || '',
      bussinessEntityType: applicantDetails.bussinessEntityType || '',
      ignoreProbablematch: 'false',
      firstName: applicantDetails.name1,
      middleName: applicantDetails.name2,
      lastName: applicantDetails.name3,
      companyPhoneNumber,
      contactPerson: applicantDetails.contactPerson,
      loanApplicationRelation: applicantDetails.loanApplicationRelation,
      aadhar: applicantDetails.aadhar,
      dateOfIncorporation: applicantDetails.dateOfIncorporation,
      voterIdNumber: String(
        applicantDetails.voterIdNumber || ''
      ).toUpperCase(),
      drivingLicenseNumber: String(
        applicantDetails.drivingLicenseNumber || ''
      ).toUpperCase(),
      passportNumber: applicantDetails.passportNumber,
      pan: String(applicantDetails.pan || '').toUpperCase(),
      panType: applicantDetails.panType,
      gstNumber: String(applicantDetails.gstNumber || '').toUpperCase(),
      tanNumber: String(applicantDetails.tanNumber || '').toUpperCase(),
      corporateIdentificationNumber: String(
        applicantDetails.corporateIdentificationNumber || ''
      ).toUpperCase(),
      cstVatNumber: String(applicantDetails.cstVatNumber || '').toUpperCase(),
      applicantId: 0,
      custSegment: applicantDetails.custSegment || '',
      monthlyIncomeAmount: applicantDetails.monthlyIncomeAmount || '',
      annualIncomeAmount: applicantDetails.annualIncomeAmount || '',
      ownHouseProofAvail: this.isChecked == true ? '1' : '0',
      houseOwnerProperty: applicantDetails.houseOwnerProperty || '',
      ownHouseAppRelationship: applicantDetails.ownHouseAppRelationship || '',
      averageBankBalance: applicantDetails.averageBankBalance || '',
      rtrType: applicantDetails.rtrType || '',
      prevLoanAmount: applicantDetails.prevLoanAmount || '',
      loanTenorServiced: applicantDetails.loanTenorServiced
        ? Number(applicantDetails.loanTenorServiced)
        : 0,
      currentEMILoan: applicantDetails.currentEMILoan || '',
      agriNoOfAcres: applicantDetails.agriNoOfAcres
        ? Number(applicantDetails.agriNoOfAcres)
        : 0,
      agriOwnerProperty: applicantDetails.agriOwnerProperty || '',
      agriAppRelationship: applicantDetails.agriAppRelationship || '',
      grossReceipt: applicantDetails.grossReceipt || '',
      isMobileNumberChanged: this.dedupeMobile,
    };
    if (this.applicantId) {
      data.applicantId = this.applicantId;
    }
    this.applicantDataService.setDedupeValues(data)
    this.onDedupeApiCall(data);
  }

  storeIndividualDedupeValues() {
    const values = this.coApplicantForm.getRawValue();
    const applicantDetails = values.dedupe;

    let mobileNumber = applicantDetails.mobilePhone;
    this.mobileNumber = mobileNumber;
    //this.mobileNumber = this.mobileNumber;

    if (applicantDetails.dob) {
      const date = new Date(applicantDetails.dob);
      applicantDetails.dob = this.utilityService.getDateFormat(
        applicantDetails.dob
      );
    }
    // if (applicantDetails.passportIssueDate) {
    //   const date = applicantDetails.passportIssueDate;
    //   date.setFullYear(date.getFullYear() - 10)
    //   applicantDetails.passportIssueDate = date;
    // }

    const data = {
      leadId: this.leadId,
      entityType: applicantDetails.entityType,
      ignoreProbablematch: 'false',
      firstName: applicantDetails.name1,
      middleName: applicantDetails.name2,
      lastName: applicantDetails.name3,
      gender: applicantDetails.gender,
      mobileNumber,
      loanApplicationRelation: applicantDetails.loanApplicationRelation,
      aadhar: applicantDetails.aadhar,
      dob: applicantDetails.dob,
      pan: String(applicantDetails.pan || '').toUpperCase(),
      panType: applicantDetails.panType,
      voterIdNumber: String(
        applicantDetails.voterIdNumber || ''
      ).toUpperCase(),
      drivingLicenseNumber: String(
        applicantDetails.drivingLicenseNumber || ''
      ).toUpperCase(),
      drivingLicenseIssueDate: this.utilityService.getDateFormat(
        applicantDetails.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.utilityService.getDateFormat(
        applicantDetails.drivingLicenseExpiryDate
      ),
      passportNumber: String(
        applicantDetails.passportNumber || ''
      ).toUpperCase(),
      passportIssueDate: this.utilityService.getDateFormat(
        applicantDetails.passportIssueDate
      ),
      passportExpiryDate: this.utilityService.getDateFormat(
        applicantDetails.passportExpiryDate
      ),
      applicantId: 0,
      custSegment: applicantDetails.custSegment || '',
      monthlyIncomeAmount: applicantDetails.monthlyIncomeAmount || '',
      annualIncomeAmount: applicantDetails.annualIncomeAmount || '',
      ownHouseProofAvail: this.isChecked == true ? '1' : '0',
      houseOwnerProperty: applicantDetails.houseOwnerProperty || '',
      ownHouseAppRelationship: applicantDetails.ownHouseAppRelationship || '',
      averageBankBalance: applicantDetails.averageBankBalance || '',
      rtrType: applicantDetails.rtrType || '',
      prevLoanAmount: applicantDetails.prevLoanAmount || '',
      loanTenorServiced: applicantDetails.loanTenorServiced
        ? Number(applicantDetails.loanTenorServiced)
        : 0,
      currentEMILoan: applicantDetails.currentEMILoan || '',
      agriNoOfAcres: applicantDetails.agriNoOfAcres
        ? Number(applicantDetails.agriNoOfAcres)
        : 0,
      agriOwnerProperty: applicantDetails.agriOwnerProperty || '',
      agriAppRelationship: applicantDetails.agriAppRelationship || '',
      grossReceipt: applicantDetails.grossReceipt || '',
      isMobileNumberChanged: this.dedupeMobile,
      ekycDone: this.ekycDone == '1' ? '1' : '0'
    };
    if (this.applicantId) {
      data.applicantId = this.applicantId;
    }
    this.applicantDataService.setDedupeValues(data)
    this.onDedupeApiCall(data);
  }

  onDedupeApiCall(data) {
    this.applicantDataService.setDedupeFlag(false);
    this.applicantDataService.setPanValidate(false);
    this.applicantService
      .checkSalesApplicantDedupe(data)
      .subscribe((value: any) => {
        if (value.Error === '0' && value.ProcessVariables.error.code == '0') {
          const processVariables = value.ProcessVariables;
          this.dedupeVaribales = value.ProcessVariables
          if (!processVariables.dedupeFound) {
            this.applicantId = processVariables.applicantId;
            this.showNegativeListModal = true;
            let nlRemarks = '';
            let nlTrRemarks = '';
            if (processVariables.isNLFound) {
              nlRemarks = processVariables.dedupeCustomerNL.remarks;
            }
            if (processVariables.isNLTRFound) {
              nlTrRemarks = processVariables.dedupeCustomerNLTR.remarks;
            }

            this.negativeModalInput = {
              isNLFound: processVariables.isNLFound,
              isNLTRFound: processVariables.isNLTRFound,
              nlRemarks,
              nlTrRemarks,
            };
            // this.showDedupeModal = true;
            return;
          }
          this.salesDedupeService.setDedupeParameter(data);
          this.salesDedupeService.setDedupeDetails(value.ProcessVariables);
          const currentUrl = this.location.path();
          if (currentUrl.includes('sales')) {
            this.applicantDataService.setNavigateForDedupe(true)
            this.router.navigateByUrl(
              `/pages/lead-section/${this.leadId}/sales-exact-match`
            );
          } else {
            this.applicantDataService.setNavigateForDedupe(false)
            this.router.navigateByUrl(
              `/pages/lead-section/${this.leadId}/sales-exact-match`
            );
          }



        } else {
          this.toasterService.showError(
            value.ProcessVariables.error.message,
            'Dedupe'
          );
        }
      });
  }

  removeErrorMsg() {
    this.panValidate = false;
  }

  navigateToSamePage() {

    if (this.isPanDisabled) {
      const data = {
        applicantId: this.applicantId
      }
      this.applicantService.wrapperPanValidaion(data).subscribe((responce) => {
        if (responce['ProcessVariables'].error.code == '0') {
          this.toasterService.showSuccess(responce['ProcessVariables'].error.message,
            'PAN Validation Successful');
          if (this.ekycDone == '0' || !this.ekycDone) {
            this.showEkycbutton = true;
          } else if (this.ekycBuutonAdharBased) {
            this.showEkycbutton = true;
          } else {
            this.showEkycbutton = false;
          }
          //this.showEkycbutton = true;
          this.applicantDataService.setPanValidate(false);

        } else {
          this.panValidate = true;
          this.applicantDataService.setPanValidate(true);

          //this.panValidate = this.applicantDataService.getPanValidate()
          this.toasterService.showError(
            responce['ProcessVariables'].error.message,
            'PAN Validation Error'
          );
        }
      })
    }
    else {
      if (this.ekycDone == '0' || !this.ekycDone) {
        this.showEkycbutton = true;
      } else if (this.ekycBuutonAdharBased) {
        this.showEkycbutton = true;
      } else {
        this.showEkycbutton = false;
      }
    }


    this.showDedupeModal = false;
    const currentUrl = this.location.path();
    if (currentUrl.includes('sales')) {

      this.router.navigateByUrl(
        `/pages/sales-applicant-details/${this.leadId}/add-applicant/${this.applicantId}`
      );
    } else {
      this.applicantDataService.setNavigateForDedupe(false)
      this.router.navigateByUrl(
        `/pages/lead-section/${this.leadId}/co-applicant/${this.applicantId}`
      );
    }
    // this.router.navigateByUrl(
    //   `/pages/lead-section/${this.leadId}/co-applicant/${this.applicantId}`
    // );



    //this.isEnableDedupe = false;
    this.isMobileChanged = false;
    this.isName1Changed = false;
    this.isPanChanged = false;
    this.isAadharChanged = false;
    this.isPassportChanged = false;
    this.isDrivingLicenseChanged = false;
    this.isVoterIdChanged = false;
    this.isContactNumberChanged = false;
    this.isCstNumberChanged = false;
    this.isCinNumberChanged = false;
    this.isGstNumberChanged = false;
    this.isTanNumberChanged = false;


    this.restoreDatas();
    this.storeAdharValue = '';
  }

  restoreDatas() {
    const data = {
      applicantId: this.applicantId,
    };
    this.applicantService.getApplicantDetail(data).subscribe((res) => {
      const applicant = res['ProcessVariables'];
      if (this.applicantType == 'INDIVENTTYP') {
        const adhar = res['ProcessVariables'].indivIdentityInfoDetails.aadhar;
        this.coApplicantForm.get('dedupe').get('aadhar').setValue(adhar);
        this.apiReferenceNo = this.coApplicantForm.get('dedupe').get('aadhar').value;

        this.firstName = applicant.applicantDetails.name1 || '';
        this.aadhar = applicant.indivIdentityInfoDetails.aadhar || '';
        this.drivingLicenseNumber = applicant.indivIdentityInfoDetails.drivingLicenseNumber || '';
        this.passportNumber = applicant.indivIdentityInfoDetails.passportNumber || '';
        this.voterIdNumber = applicant.indivIdentityInfoDetails.voterIdNumber || '';

        this.pan = applicant.indivIdentityInfoDetails.pan || '';
        let mobile = applicant.indivIdentityInfoDetails.mobile || '';
        if (mobile && mobile.length === 12) {
          mobile = mobile.slice(2, 12);
        }
        this.mobileNumber = mobile;


      } else {
        const adhar = res['ProcessVariables'].corporateProspectDetails.aadhar;
        this.coApplicantForm.get('dedupe').get('aadhar').setValue(adhar);
        this.apiReferenceNo = this.coApplicantForm.get('dedupe').get('aadhar').value;


        this.firstName = applicant.applicantDetails.name1 || '';
        this.aadhar = applicant.corporateProspectDetails.aadhar || '';
        this.pan = applicant.corporateProspectDetails.panNumber || '';
        this.tanNumber = applicant.corporateProspectDetails.tanNumber || '';
        this.corporateIdentificationNumber = applicant.corporateProspectDetails.corporateIdentificationNumber || '';
        this.gstNumber = applicant.corporateProspectDetails.gstNumber || '';
        this.cstVatNumber = applicant.corporateProspectDetails.cstVatNumber || '';
        let companyPhoneNumber = applicant.corporateProspectDetails.companyPhoneNumber || '';
        if (companyPhoneNumber && companyPhoneNumber.length === 12) {
          companyPhoneNumber = companyPhoneNumber.slice(2, 12);
        }
        this.contactNumber = companyPhoneNumber;

      }

    });

  }

  calleKYC() {
    // this.showEkycbutton= false ;
    // this.eKYCChecked= true;
    // return

    let that = this;

    let applicantId = this.applicantId;
    let aadhar = this.coApplicantForm.get('dedupe').get('aadhar').value;

    this.applicantService.retreiveAdhar(aadhar).subscribe((res: any) => {
      let result = res;
      let processVariables = result.ProcessVariables;
      if (processVariables.error.code == "0") {
        aadhar = processVariables.uid;
        //this.ekycDone = '1'
      }

      setTimeout(function () {
        that.ngxService.start();
      }, 1000);

      that.biometricService.initIdenti5(aadhar, applicantId, function (result) {

        that.ngxService.stop();
        let res = JSON.parse(result);

        if (res.pidErr) {
          that.pTag.nativeElement.click();
          that.ngxService.stop();
          return;
        }
        let processVariables = res.ProcessVariables;
        // value = JSON.parse(value).ProcessVariables;

        //console.log("KYC result&&&&@@@" + processVariables);

        if (processVariables.error.code == '0') {


          // that.isAlertSuccess = false;
          // setTimeout(() => {
          //   that.isAlertSuccess = true;
          // }, 1500);

          // alert("e-KYC successful");

          that.setBiometricValues(that, processVariables);
          that.showEkycbutton = false;
          that.ekycDone = '1'

          let alertRet = Modals.alert({
            title: 'e-KYC Success',
            message: "You have successfully verified your KYC"
          });

          that.toasterService.showSuccess(
            "You have successfully verified your KYC",
            'e-KYC Success'
          );

        }
        else {
          // that.isAlertDanger = false;
          // setTimeout(() => {
          //   that.isAlertDanger = true;
          // }, 1500);
          // alert(processVariables.error.message);
          that.ekycDone = '0'
          let alertRet = Modals.alert({
            title: 'e-KYC Failed',
            message: processVariables.error.message
          });

          that.toasterService.showError(
            processVariables.error.message,
            'e-KYC Failed'
          );

          return;
        }
        that.showEkycbutton = false;
        //that.isEnableDedupe = false;
        that.isMobileChanged = false;
        that.isName1Changed = false;
        that.isPanChanged = false;
        that.isAadharChanged = false;
        that.isPassportChanged = false;
        that.isDrivingLicenseChanged = false;
        that.isVoterIdChanged = false;
        that.isContactNumberChanged = false;
        that.isCstNumberChanged = false;
        that.isCinNumberChanged = false;
        that.isGstNumberChanged = false;
        that.isTanNumberChanged = false;
      });
    });

  }

  setBiometricValues(ctx, value) {

    const dedupe = ctx.coApplicantForm.get('dedupe');
    const dob = value.dobFromResponse;
    ctx.gender = value.genderFromResponse;
    value.dobFromResponse = dob.split('-').join('/');

    dedupe.get('name1').setValue(value.firstName);

    dedupe.patchValue({
      name1: value.firstName,
      name2: value.middleName,
      name3: value.lastName,
      dob: new Date(ctx.utilityService.getDateFromString(value.dobFromResponse))
    })

    dedupe.get('name1').disable();
    dedupe.get('name2').disable();
    dedupe.get('name3').disable();
    dedupe.get('dob').disable();


    const currentAddress = ctx.coApplicantForm.get('currentAddress');
    const permanantAddress = ctx.coApplicantForm.get('permentAddress');

    const cityId = value.cityId;
    const geoMasterData = value.geoMasterData;


    let datas = geoMasterData.find((data) => {
      return cityId === data.cityId;
    })
    console.log('cityDatas', datas)


    this.permanentPincode = {
      city: [
        {
          key: value.cityId,
          value: datas.cityName || value.villageTownOrCity
        },
      ],
      district: [
        {
          key: value.districtId,
          value: datas.districtName || value.district
        },
      ],
      state: [
        {
          key: value.stateId,
          value: datas.stateName || value.state
        },
      ],
      country: [
        {
          key: value.countryId,
          value: datas.country || value.country
        },
      ],
    };

    permanantAddress.patchValue({
      addressLineOne: value.addressLineOne,
      addressLineTwo: value.addressLineTwo,
      addressLineThree: value.addressLineThree,
      pincode: value.resultPincode,
      city: value.cityId,
      state: value.stateId,
      country: value.countryId,
      district: value.districtId,
      nearestLandmark: value.landmark
    })
    value.disableAddrData == '0' ? permanantAddress.enable() : permanantAddress.disable();

    currentAddress.reset();
    currentAddress.enable();
    ctx.addDisabledCheckBox = true;
    ctx.isPermanantAddressSame = false

    ctx.pTag.nativeElement.click();

  }

  listenerForUnique() {
    const dedupe = this.coApplicantForm.get('dedupe');
    if (this.applicantType == 'INDIVENTTYP') {
      this.listenForIndividual(dedupe)
    } else {
      this.listenForNonIndividual(dedupe)
    }
  }

  listenForIndividual(dedupe) {
    dedupe.get('mobilePhone').valueChanges.subscribe((value) => {

      if (!dedupe.get('mobilePhone').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.mobileNumber)
        if (value !== this.mobileNumber) {
          this.isMobileChanged = true;
          this.dedupeMobile = true;

        } else {
          this.isMobileChanged = false;
          this.dedupeMobile = false;
        }
      } else {
        this.isMobileChanged = true;
      }

    });
    dedupe.get('name1').valueChanges.subscribe((value) => {
      if (!dedupe.get('name1').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.firstName);
        this.isName1Changed = value !== this.firstName;
      } else {
        this.isName1Changed = true;
      }
    });
    dedupe.get('pan').valueChanges.subscribe((value) => {
      this.panValidate = false
      value = value || '';
      if (!dedupe.get('pan').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        if (upperCaseValue) {
          this.enableDedupeBasedOnChanges(upperCaseValue !== this.pan);
        }

        this.isPanChanged = upperCaseValue !== this.pan;
      } else {
        this.isPanChanged = true;
      }
    });
    dedupe.get('passportNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('passportNumber').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        this.enableDedupeBasedOnChanges(upperCaseValue !== this.passportNumber);
        this.isPassportChanged = upperCaseValue !== this.passportNumber;
        // if (!this.isPanDisabled) {
        //   this.isVoterRequired = false;
        //   dedupe.get('voterIdNumber').clearValidators();
        //   dedupe.get('voterIdNumber').updateValueAndValidity()
        // }
      } else {
        this.isPassportChanged = true;
      }
    });
    dedupe.get('drivingLicenseNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('drivingLicenseNumber').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        this.enableDedupeBasedOnChanges(upperCaseValue !== this.drivingLicenseNumber);
        this.isDrivingLicenseChanged = upperCaseValue !== this.drivingLicenseNumber;
      } else {
        this.isDrivingLicenseChanged = true;

      }
    });
    dedupe.get('voterIdNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('voterIdNumber').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        this.enableDedupeBasedOnChanges(upperCaseValue !== this.voterIdNumber);

        this.isVoterIdChanged = upperCaseValue !== this.voterIdNumber;
      } else {
        this.isVoterIdChanged = true;

      }
    });
  }

  listenForNonIndividual(dedupe) {
    dedupe.get('companyPhoneNumber').valueChanges.subscribe((value) => {
      //this.dedupeMobile= true;
      if (!dedupe.get('companyPhoneNumber').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.contactNumber)
        if (value !== this.contactNumber) {
          this.isContactNumberChanged = true;
          this.dedupeMobile = true;
        } else {

          this.isContactNumberChanged = false;
          this.dedupeMobile = false;
        }
      } else {
        this.isContactNumberChanged = true;
      }
    });
    dedupe.get('pan').valueChanges.subscribe((value) => {
      this.panValidate = false;
      value = value || '';
      if (!dedupe.get('pan').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        this.enableDedupeBasedOnChanges(upperCaseValue !== this.pan);
        this.isPanChanged = upperCaseValue !== this.pan;
      } else {
        this.isPanChanged = true;
      }
    });
    dedupe.get('name1').valueChanges.subscribe((value) => {
      if (!dedupe.get('name1').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.firstName);
        this.isName1Changed = value !== this.firstName;
      } else {
        this.isName1Changed = true;
      }
    });
    dedupe
      .get('corporateIdentificationNumber')
      .valueChanges.subscribe((value) => {
        if (!dedupe.get('corporateIdentificationNumber').invalid) {
          const upperCaseValue = value ? value.toUpperCase() : value;
          this.enableDedupeBasedOnChanges(
            upperCaseValue !== this.corporateIdentificationNumber
          );
          this.isCinNumberChanged =
            upperCaseValue !== this.corporateIdentificationNumber;
        } else {
          this.isCinNumberChanged = true;
        }
      });
    dedupe.get('cstVatNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('cstVatNumber').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        this.enableDedupeBasedOnChanges(upperCaseValue !== this.cstVatNumber);
        this.isCstNumberChanged = upperCaseValue !== this.cstVatNumber;
      } else {
        this.isCstNumberChanged = true;
      }
    });
    dedupe.get('gstNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('gstNumber').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        this.enableDedupeBasedOnChanges(upperCaseValue !== this.gstNumber);
        this.isGstNumberChanged = upperCaseValue !== this.gstNumber;
      } else {
        this.isGstNumberChanged = true;
      }
    });
    dedupe.get('tanNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('tanNumber').invalid) {
        const upperCaseValue = value ? value.toUpperCase() : value;
        this.enableDedupeBasedOnChanges(upperCaseValue !== this.tanNumber);
        this.isTanNumberChanged = upperCaseValue !== this.tanNumber;
      } else {
        this.isTanNumberChanged = true;
      }
    });
  }

  enableDedupeBasedOnChanges(condition: boolean) {
    if (condition) {
      //this.isEnableDedupe = true;
      this.showEkycbutton = false;


    } else {
      //this.isEnableDedupe = false;
      if (this.applicantType == 'INDIVENTTYP') {
        if (this.ekycDone == '1') {
          this.showEkycbutton = false;
        } else {
          this.showEkycbutton = true;
        }
      }
    }

  }

  navigateToApplicantList() {
    const url = this.location.path();
    if (url.includes('lead-section')) {
      this.router.navigateByUrl(
        `/pages/lead-section/${this.leadId}/applicant-details`
      );
      return;
    }
    this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
    this.applicantDataService.setDedupeFlag(false);
  }

  negativeListModalListener(event) {
    if (event.name === 'next') {
      this.showDedupeModal = true;
      this.showNegativeListModal = false;
      return;
    }

    const isProceed = event.name === 'proceed';

    const data = {
      applicantId: this.applicantId,
      isProceed,
      remarks: event.remarks,
    };

    this.applicantService
      .applicantNLUpdatingRemarks(data)
      .subscribe((value) => {
        this.showNegativeListModal = false;
        if (isProceed) {
          this.showDedupeModal = true;
        } else {
          //
          const applicantRelation = this.coApplicantForm
            .get('dedupe')
            .get('loanApplicationRelation').value;
          if (applicantRelation === 'APPAPPRELLEAD') {
            this.router.navigateByUrl('/pages/dashboard');
          } else {
            this.navigateToApplicantList();
          }
        }
      });

    //console.log('negativeListModalListener', event);
  }

}
