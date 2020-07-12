import { Component, OnInit } from '@angular/core';
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
import {
  Applicant,
  ApplicantDetails,
  AddressDetails,
  IndivIdentityInfoDetails,
  IndivProspectProfileDetails,
  CorporateProspectDetails,
  IndividualProspectDetails,
} from '@model/applicant.model';
import { Constant } from '@assets/constants/constant';
import { map } from 'rxjs/operators';
import { ToasterService } from '@services/toaster.service';
import { Subscription } from 'rxjs';
import { ready } from 'jquery';

@Component({
  selector: 'app-add-update-applicant',
  templateUrl: './add-update-applicant.component.html',
  styleUrls: ['./add-update-applicant.component.css'],
})
export class AddOrUpdateApplicantComponent implements OnInit {
  isEnableDedupe: boolean;

  panPattern = {
    // rule: '[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}',
    // msg: 'Invalid Pan',
  };
  panFormPattern = {
    // rule: '[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}',
    rule: '[A-Z]{5}[0-9]{4}[A-Z]{1}',
    msg: 'Pan is invalid',
  };

  panRequired: boolean;

  isMobileChanged: boolean = false;
  isName1Changed: boolean = false;
  isPanChanged: boolean = false;
  isAadharChanged: boolean = false;
  isPassportChanged: boolean = false;
  isDrivingLicenseChanged: boolean = false;
  isVoterIdChanged: boolean;

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
  drivingLicenseIssueDate: string;
  drivingLicenseExpiryDate: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  voterIdNumber: string;
  isPermanantAddressSame: boolean;
  isRegAddressSame: boolean;
  showDedupeModal: boolean;
  isDirty: boolean;

  tanNumber: string;
  contactNumber: string;
  corporateIdentificationNumber : string;
  cstVatNumber : string;
  gstNumber : string;

  toDayDate: Date = new Date();

  mandatory: any = {};
  expiryMandatory: any = {};

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
  isRelationApplicant: string;

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
    private toasterService: ToasterService
  ) {}

  async ngOnInit() {
    this.initForm();
    this.isRelationApplicant = this.applicantDataService.getApplicantRelation();
    this.getLOV();
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
      if (this.applicantId) {
        this.isEnableDedupe = false;
        this.getApplicantDetails();
      } else {
        this.isMobileChanged = true; // for enable check dedupe button
        this.isContactNumberChanged = true;
        this.coApplicantForm.get('dedupe').get('pan').disable();
      }
    }
  }

  selectApplicantType(event: any) {
    this.applicantType = event.target.value;
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;
    if (this.applicantType == 'INDIVENTTYP') {
      //this.namePattern = this.namePatternNonIdv;
      this.addIndFormControls();
      this.removeNonIndFormControls();
    } else {
      const dedupe = this.coApplicantForm.get('dedupe');

      dedupe.patchValue({
        title: 'M/SSALUTATION'
      });
      this.coApplicantForm.get('dedupe').get('aadhar').clearValidators()
      //this.namePattern = { ...this.namePatternIdv };
      this.addNonIndFormControls();
      this.removeIndFormControls();
    }
  }
  addIndFormControls() {
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;

    dedupe.addControl('dob', new FormControl(''));
    dedupe.addControl('mobilePhone', new FormControl(''));
    dedupe.addControl('drivingLicenseNumber', new FormControl(''));
    dedupe.addControl('drivingLicenseIssueDate', new FormControl(''));
    dedupe.addControl('drivingLicenseExpiryDate', new FormControl(''));
    dedupe.addControl('passportNumber', new FormControl(''));
    dedupe.addControl('passportIssueDate', new FormControl(''));
    dedupe.addControl('passportExpiryDate', new FormControl(''));
    dedupe.addControl('voterIdNumber', new FormControl(''));
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
    dedupe.removeControl('drivingLicenseNumber');
    dedupe.removeControl('drivingLicenseIssueDate');
    dedupe.removeControl('drivingLicenseExpiryDate');
    dedupe.removeControl('passportNumber');
    dedupe.removeControl('passportIssueDate');
    dedupe.removeControl('passportExpiryDate');
    dedupe.removeControl('voterIdNumber');
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

  getPanValue(event: any) {
    this.panValue = event.target.value;
    this.isPanDisabled = this.panValue === '1PANTYPE';
    const dedupe = this.coApplicantForm.get('dedupe');
    if (this.applicantType == 'NONINDIVENTTYP') {
      if (!this.isPanDisabled) {
        this.panPattern = {};
        this.panRequired = false;
        dedupe.patchValue({
          pan: null,
        });
        dedupe.get('pan').disable();
      } else {
        dedupe.get('pan').enable();
        this.panPattern = this.panFormPattern;
        this.panRequired = true;
        setTimeout(() => {
          dedupe.patchValue({
            pan: null,
          });
        });
      }
    } else {
      const passportValue = dedupe.get('passportNumber').value;
      const voterId = dedupe.get('voterIdNumber').value;

      this.isVoterFirst = true;
      this.isPassportFirst = true;
      if (!this.isPanDisabled) {
        this.panPattern = {};
        this.panRequired = false;
        dedupe.get('pan').disable();
        if (!voterId) {
          this.isPassportRequired = true;
        }
        if (!passportValue) {
          this.isVoterRequired = true;
        }
        this.toasterService.showInfo(
          'You should enter either passport or voter id',
          ''
        );

        this.voterIdListener = this.listenerVoterId();
        this.passportListener = this.listenerPassport();

        // dedupe.get('passportNumber').setValue(passportValue || null);
      } else {
        dedupe.get('pan').enable();
        this.panPattern = this.panFormPattern;
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
        this.isPassportRequired = true;
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
        this.isVoterRequired = true;
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

  onDrvingLisenseChange(formCtrl) {
    if (
      this.coApplicantForm.get('dedupe').get('drivingLicenseNumber').status ===
      'VALID'
    ) {
      this.mandatory['drivingLicenseIssueDate'] = true;
      this.mandatory['drivingLicenseExpiryDate'] = true;
    } else {
      this.mandatory['drivingLicenseIssueDate'] = false;
      this.mandatory['drivingLicenseExpiryDate'] = false;
    }
  }

  dateSelected() {
    this.mandatory['drivingLicenseIssueDate'] = false;
  }

  expiryDateSelected() {
    this.mandatory['drivingLicenseExpiryDate'] = false;
  }

  onPassportNumberChange($formCtrl) {
    if (
      this.coApplicantForm.get('dedupe').get('passportNumber').status ===
      'VALID'
    ) {
      this.passportMandatory['passportIssueDate'] = true;
      this.passportMandatory['passportExpiryDate'] = true;
    } else {
      this.passportMandatory['passportIssueDate'] = false;
    }
  }

  passportDateSelected() {
    this.passportMandatory['passportIssueDate'] = false;
  }

  passportExpiryDateSelected() {
    this.passportMandatory['passportExpiryDate'] = false;
  }

  drvingLisenseValidation(event) {
    const licenseNumber = event.target.value;
    const value = event.target.value;
    if (
      this.coApplicantForm.get('dedupe').get('drivingLicenseNumber').status ===
      'VALID'
    ) {
      this.isMandatory = true;
    }
  }

  onBack() {
    this.location.back();
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
                key: first.threeAlphaCode,
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
          this.permanentPincode = value;
          formGroupName = 'permentAddress';
        }
        if (id === 'currentPincode') {
          this.currentPincode = value;
          formGroupName = 'currentAddress';
        }
        if (id === 'registerPincode') {
          this.registerPincode = value;
          formGroupName = 'registeredAddress';
        }
        if (id === 'communicationPincode') {
          this.communicationPincode = value;
          formGroupName = 'communicationAddress';
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
        country: country[0].value,
      });
    }

    if (district && district.length === 1) {
      this.coApplicantForm.get(formGroupName).patchValue({
        district: district[0].value,
      });
    }

    if (state && state.length === 1) {
      this.coApplicantForm.get(formGroupName).patchValue({
        state: state[0].value,
      });
    }
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
      country: address.country,
      landlineNumber: address.landlineNumber,
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

      const addressDetails: Array<any> = processVariables.addressDetails || [];
      console.log('addressDetails', addressDetails);
      const addressStatus = addressDetails.find(
        (val) => val.addressType === 'PERMADDADDTYP'
      );

      // if (processVariables.ucic) {isCurrAddSameAsPermAdd: "0"
      if (
        addressStatus &&
        addressDetails.length > 0 &&
        addressStatus.isCurrAddSameAsPermAdd == '1'
      ) {
        this.isPermanantAddressSame = true;
        this.isDisabledCheckbox = true;

        this.disablePermanentAddress();
        this.disableCurrentAddress();

        //this.disableRegisteredAddress();
        //this.disableCommunicationAddress();
      }

      this.applicantDataService.setApplicant(applicant);
      this.applicant = this.applicantDataService.getApplicant();

      this.applicantType = this.applicant.applicantDetails.entityTypeKey;

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
    });
  }

  getDedupeFormControls() {
    return {
      loanApplicationRelation: new FormControl('', Validators.required),
      entityType: new FormControl('', Validators.required),
      bussinessEntityType: new FormControl(''),
      name1: new FormControl('', Validators.required),
      name2: new FormControl(''),
      name3: new FormControl(''),
      mobilePhone: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      voterIdNumber: new FormControl(null),
      aadhar: new FormControl('', Validators.required),
      panType: new FormControl('', Validators.required),
      pan: new FormControl(''),
      passportNumber: new FormControl(null),
      drivingLicenseNumber: new FormControl(''),
      drivingLicenseIssueDate: new FormControl(''),
      drivingLicenseExpiryDate: new FormControl(''),
      passportIssueDate: new FormControl(''),
      passportExpiryDate: new FormControl(''),

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
      currentAddress: new FormGroup(this.getAddressFormControls()),
      registeredAddress: new FormGroup(this.getAddressFormControls()),
      communicationAddress: new FormGroup(this.getAddressFormControls()),
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
    };
  }

  getFormateDate(date: string) {
    if (!date) {
      return '';
    }
    date = date.split('/').reverse().join('-');
    return date;
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
        this.panPattern = this.panFormPattern;
      }
      details.pan = indivIdentityInfoDetails.pan;
      details.aadhar = indivIdentityInfoDetails.aadhar;
      details.mobile = aboutIndivProspectDetails.mobilePhone;
      details.panType = indivIdentityInfoDetails.panType;
      details.voterIdNumber = indivIdentityInfoDetails.voterIdNumber;
      if (aboutIndivProspectDetails.dob) {
        details.dob = aboutIndivProspectDetails.dob;
        // .split('/')
        // .reverse()
        // .join('-');
        details.dob = new Date(
          this.utilityService.getDateFromString(details.dob)
        );
      }
      details.passportNumber = indivIdentityInfoDetails.passportNumber;
      details.passportIssueDate = this.utilityService.getDateFromString(
        indivIdentityInfoDetails.passportIssueDate
      );
      details.passportExpiryDate = this.utilityService.getDateFromString(
        indivIdentityInfoDetails.passportExpiryDate
      );
      details.drivingLicenseNumber =
        indivIdentityInfoDetails.drivingLicenseNumber;
      details.drivingLicenseIssueDate = this.utilityService.getDateFromString(
        indivIdentityInfoDetails.drivingLicenseIssueDate
      );
      details.drivingLicenseExpiryDate = this.utilityService.getDateFromString(
        indivIdentityInfoDetails.drivingLicenseExpiryDate
      );
    } else {
      const corporateProspectDetails = this.applicant.corporateProspectDetails
        ? this.applicant.corporateProspectDetails
        : {};
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
        details.dateOfIncorporation = new Date(
          this.utilityService.getDateFromString(details.dateOfIncorporation)
        );
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
      this.drivingLicenseNumber = details.drivingLicenseNumber
        ? details.drivingLicenseNumber
        : '';
      this.passportNumber = details.passportNumber
        ? details.passportNumber
        : '';
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
        companyPhoneNumber = companyPhoneNumber.slice(2, 12);
      }
      //this.contactNumber = companyPhoneNumber;
      this.setValueForFormControl('pan', details.pan);

      const dedupe = this.coApplicantForm.get('dedupe');

      dedupe.patchValue({
        title: 'M/SSALUTATION',
        entityType: applicantValue.applicantDetails.entityTypeKey || '',
        loanApplicationRelation:
          applicantValue.applicantDetails.applicantTypeKey || '',
        name1: applicantValue.applicantDetails.name1 || '',
        name2: applicantValue.applicantDetails.name2 || '',
        name3: applicantValue.applicantDetails.name3 || '',
        panType: details.panType || '',
        aadhar: details.aadhar || '',
      bussinessEntityType: applicantValue.applicantDetails.bussinessEntityType || '',


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
        this.addIndFormControls();
        this.removeNonIndFormControls();

        dedupe.patchValue({
          mobilePhone: mobile || '',
          dob: details.dob || '',
          identity_type: applicantValue.identity_type || '',
          //aadhar: details.aadhar || '',
          voterIdNumber: details.voterIdNumber,
          drivingLicenseNumber: details.drivingLicenseNumber || '',
          drivingLicenseIssueDate: details.drivingLicenseIssueDate || '',
          drivingLicenseExpiryDate: details.drivingLicenseExpiryDate || '',
          passportNumber: details.passportNumber || '',
          passportIssueDate: details.passportIssueDate || '',
          passportExpiryDate: details.passportExpiryDate || '',
        });

        const permentAddress = this.coApplicantForm.get('permentAddress');
        const currentAddress = this.coApplicantForm.get('currentAddress');
        const addressObj = this.getAddressObj();
        const permenantAddressObj = addressObj[Constant.PERMANENT_ADDRESS];
        if (!!permenantAddressObj) {
          this.isPermanantAddressSame =
            permenantAddressObj.isCurrAddSameAsPermAdd === '1';
        }

        this.permanentPincode = this.formatPincodeData(permenantAddressObj);

        if (!!this.createAddressObject(permenantAddressObj)) {
          permentAddress.patchValue(
            this.createAddressObject(permenantAddressObj)
          );
        }

        if (this.isPermanantAddressSame) {
          this.currentPincode = this.permanentPincode;

          this.isCurrAddSameAsPermAdd = '1';

          currentAddress.patchValue(
            this.createAddressObject(permenantAddressObj)
          );
          currentAddress.disable();
        } else {
          this.isCurrAddSameAsPermAdd = '0';
          const currentAddressObj = addressObj[Constant.CURRENT_ADDRESS];
          this.currentPincode = this.formatPincodeData(currentAddressObj);

          if (!!this.createAddressObject(currentAddressObj)) {
            currentAddress.patchValue(
              this.createAddressObject(currentAddressObj)
            );
          }
        }
        // }
      }
      else {
        this.coApplicantForm.get('dedupe').get('aadhar').clearValidators()
        this.coApplicantForm.get('dedupe').get('aadhar').updateValueAndValidity()
        this.addNonIndFormControls();
        this.removeIndFormControls();
        if (mobile && mobile.length === 12) {
          mobile = mobile.slice(2, 12);
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
        const addressObj = this.getAddressObj();
        const registeredAddress = this.coApplicantForm.get('registeredAddress');
        const communicationAddress = this.coApplicantForm.get(
          'communicationAddress'
        );
        const registeredAddressObj = addressObj[Constant.REGISTER_ADDRESS];
        if (!!registeredAddressObj) {
          this.isRegAddressSame =
            registeredAddressObj.isCurrAddSameAsPermAdd === '1';
        }
        this.registerPincode = this.formatPincodeData(registeredAddressObj);
        if (!!this.createAddressObject(registeredAddressObj)) {
          registeredAddress.patchValue(
            this.createAddressObject(registeredAddressObj)
          );
        }
        if (this.isRegAddressSame) {
          this.communicationPincode = this.registerPincode;
          this.isCommAddSameAsRegAdd = '1';
          communicationAddress.patchValue(
            this.createAddressObject(registeredAddressObj)
          );
          communicationAddress.disable();
        } else {
          this.isCommAddSameAsRegAdd = '0';
          const communicationAddressObj =
            addressObj[Constant.COMMUNICATION_ADDRESS];
          this.communicationPincode = this.formatPincodeData(
            communicationAddressObj
          );

          if (!!this.createAddressObject(communicationAddressObj)) {
            communicationAddress.patchValue(
              this.createAddressObject(communicationAddressObj)
            );
          }
        }
      }
    }
    setTimeout(() => {
      this.listenerForUnique();
    });
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
          key: data.country,
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
  getAddressObj() {
    const address = this.applicant.addressDetails;
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

  onNext() {
    if (this.isMobileChanged || !this.applicant.otpVerified) {
      this.router.navigateByUrl(
        `/pages/lead-section/${this.leadId}/otp-section/${this.applicantId}`
      );
    } else {
      this.navigateToApplicantList();
    }
  }

  getEntityObject(key: string) {
    return this.values.entity.find((value) => value.key === Number(key));
  }

  formatGivenDate(date) {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-us') : '';
  }
  storeIndividualValueInService(coApplicantModel) {
    const dedupe = coApplicantModel.dedupe;
    if (dedupe.dob) {
      const date = new Date(dedupe.dob);
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDay();
      dedupe.dob = this.utilityService.getDateFormat(dedupe.dob);
    }
    let mobileNumber = dedupe.mobilePhone;
    if (mobileNumber.length === 12) {
      mobileNumber = mobileNumber.slice(2, 12);
    }
    this.aboutIndivProspectDetails = {
      dob: dedupe.dob,
      mobilePhone: mobileNumber,
    };

    this.indivIdentityInfoDetails = {
      panType: dedupe.panType,
      pan: String(dedupe.pan || '').toUpperCase(),
      aadhar: dedupe.aadhar,
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
    this.applicantDetails = {
      title: dedupe.title,
      bussinessEntityType: dedupe.bussinessEntityType,
    };
    this.corporateProspectDetails = {
      aadhar: dedupe.aadhar,
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
      console.log('addressObject', addressObject);
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
      });
    }
    console.log('addressDetails', this.addressDetails);
  }
  onFormSubmit() {
    const formValue = this.coApplicantForm.getRawValue();
    const coApplicantModel = {
      ...formValue,
      entity: this.getEntityObject(formValue.entity),
    };

    if (this.applicantType === 'INDIVENTTYP') {
      if (
        this.coApplicantForm.get('dedupe').invalid ||
        this.coApplicantForm.get('currentAddress').invalid ||
        this.coApplicantForm.get('permentAddress').invalid
      ) {
        this.isDirty = true;
        return;
      }
      this.storeIndividualValueInService(coApplicantModel);
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
      if (
        this.coApplicantForm.get('dedupe').invalid ||
        this.coApplicantForm.get('registeredAddress').invalid ||
        this.coApplicantForm.get('communicationAddress').invalid
      ) {
        this.isDirty = true;
        return;
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
      bussinessEntityType : coApplicantModel.dedupe.bussinessEntityType
      //customerCategory: 'SALCUSTCAT',
    };
    const DOB = this.utilityService.getDateFormat(coApplicantModel.dedupe.dob);

    // this.indivProspectProfileDetails = {
    //   employerType: 'test',
    //   employerName: 'Appiyo Technologies',
    //   workplaceAddress: 'test',
    // };
    const data = {
      applicantDetails: this.applicantDetails,
      aboutIndivProspectDetails: this.aboutIndivProspectDetails,
      indivIdentityInfoDetails: this.indivIdentityInfoDetails,
      indivProspectProfileDetails: this.indivProspectProfileDetails,
      corporateProspectDetails: this.corporateProspectDetails,
      addressDetails: this.addressDetails,
      applicantId: this.applicantId,
      leadId: this.leadId,
      isMobileNumberChanged: this.isMobileChanged,
    };

    this.applicantService.saveApplicant(data).subscribe((res: any) => {
      const response = res;
      if (response.Error === '0') {
        const message = response.ProcessVariables.error.message;
      }
      const url = this.location.path();
      this.toasterService.showSuccess(
        'Applicant details saved successfully',
        ''
      );
    });
  }

  onAddress(event) {
    const eventClicked = event.target.checked;
    this.isCurrAddSameAsPermAdd = eventClicked ? '1' : '0';
    const currentAddress = this.coApplicantForm.get('currentAddress');
    if (eventClicked) {
      const formValue: AddressDetails = this.coApplicantForm.value
        .permentAddress;
      this.currentPincode = this.permanentPincode;
      //const permanentAddress = this.coApplicantForm.get('currentAddress');
      currentAddress.patchValue({
        ...formValue,
      });
      currentAddress.disable();
    } else if (!eventClicked) {
      currentAddress.enable();
    }
  }
  onAddressCommunication(event) {
    const eventClicked = event.target.checked;
    this.isCommAddSameAsRegAdd = eventClicked ? '1' : '0';
    const communicationAddress = this.coApplicantForm.get(
      'communicationAddress'
    );
    if (eventClicked) {
      const formValue: AddressDetails = this.coApplicantForm.value
        .registeredAddress;
      this.communicationPincode = this.registerPincode;
      communicationAddress.patchValue({
        ...formValue,
      });
      communicationAddress.disable();
    } else if (!eventClicked) {
      communicationAddress.enable();
    }
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

  enableDedupeButton() {
    const dedupe = this.coApplicantForm.get('dedupe');
    dedupe.get('name1').valueChanges.subscribe((value) => {
      console.log('getValidStatus', this.getValidStatus('name1'));
      const status = this.getValidStatus('name1');
      if (status === 'VALID') {
      } else {
      }
    });
  }

  getValidStatus(controlName: string) {
    return this.coApplicantForm.get('dedupe').get(controlName).status;
  }

  checkDedupe() {
    const dedupe = this.coApplicantForm.get('dedupe');
    console.log('dedupe', dedupe);
    if (this.applicantType == 'NONINDIVENTTYP') {
      this.addNonIndFormControls();
      this.removeIndFormControls();
      this.isDirty = true;
      if (dedupe.invalid) {
        return;
      }
      const applicantDetails = dedupe.value;
      let companyPhoneNumber = applicantDetails.companyPhoneNumber;
      this.contactNumber = companyPhoneNumber;
      // if (this.mobileNumber.length == 10) {
      this.contactNumber = '91' + this.contactNumber;
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
        bussinessEntityType : applicantDetails.bussinessEntityType || '',
        ignoreProbablematch: 'false',
        firstName: applicantDetails.name1,
        middleName: applicantDetails.name2,
        lastName: applicantDetails.name3,
        companyPhoneNumber,
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
      };
      if (this.applicantId) {
        data.applicantId = this.applicantId;
      }
      this.applicantService
        .checkSalesApplicantDedupe(data)
        .subscribe((value: any) => {
          if (value.Error === '0' && value.ProcessVariables.error.code == 0) {
            const processVariables = value.ProcessVariables;
            console.log('Responce', processVariables);
            if (!processVariables.dedupeFound) {
              this.applicantId = processVariables.applicantId;
              console.log('dedeupe', this.coApplicantForm.get('dedupe'));
              this.showDedupeModal = true;
              return;
            }
            this.salesDedupeService.setDedupeParameter(data);
            this.salesDedupeService.setDedupeDetails(value.ProcessVariables);
            this.router.navigateByUrl(
              `/pages/lead-section/${this.leadId}/sales-exact-match`
            );
          } else {
            this.toasterService.showError(
              value.ProcessVariables.error.message,
              'Dedupe'
            );
          }
        });
    } else {
      this.isDirty = true;
      if (dedupe.invalid) {
        return;
      }

      if (
        this.passportMandatory['passportIssueDate'] &&
        !this.passportIssueDate &&
        !this.passportExpiryDate
      ) {
        return;
      }

      if (
        this.mandatory['drivingLicenseIssueDate'] &&
        !this.drivingLicenseIssueDate &&
        !this.drivingLicenseExpiryDate
      ) {
        return;
      }

      //console.log('dedupe', dedupe);

      const applicantDetails = dedupe.value;
      let mobileNumber = applicantDetails.mobilePhone;
      this.mobileNumber = mobileNumber;
      // if (this.mobileNumber.length == 10) {
      this.mobileNumber = '91' + this.mobileNumber;
      // }

      if (applicantDetails.dob) {
        const date = new Date(applicantDetails.dob);
        applicantDetails.dob = this.utilityService.getDateFormat(
          applicantDetails.dob
        );
      }

      const data = {
        leadId: this.leadId,
        entityType: applicantDetails.entityType,
        ignoreProbablematch: 'false',
        firstName: applicantDetails.name1,
        middleName: applicantDetails.name2,
        lastName: applicantDetails.name3,
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
      };
      if (this.applicantId) {
        data.applicantId = this.applicantId;
      }
      this.applicantService
        .checkSalesApplicantDedupe(data)
        .subscribe((value: any) => {
          if (value.Error === '0' && value.ProcessVariables.error.code == 0) {
            const processVariables = value.ProcessVariables;
            if (!processVariables.dedupeFound) {
              this.applicantId = processVariables.applicantId;
              console.log('dedeupe', this.coApplicantForm.get('dedupe'));
              this.showDedupeModal = true;
              return;
            }
            this.salesDedupeService.setDedupeParameter(data);
            this.salesDedupeService.setDedupeDetails(value.ProcessVariables);
            this.router.navigateByUrl(
              `/pages/lead-section/${this.leadId}/sales-exact-match`
            );
          } else {
            this.toasterService.showError(
              value.ProcessVariables.error.message,
              'Dedupe'
            );
          }
        });
    }
  }

  navigateToSamePage() {
    this.showDedupeModal = false;
    this.router.navigateByUrl(
      `/pages/lead-section/${this.leadId}/co-applicant/${this.applicantId}`
    );
    console.log('dedeupe', this.coApplicantForm.get('dedupe'));
    this.isEnableDedupe = false;
    this.isMobileChanged = false;
    this.isName1Changed = false;
    this.isPanChanged = false;
    this.isAadharChanged = false;
    this.isPassportChanged = false;
    this.isDrivingLicenseChanged = false;
    this.isVoterIdChanged = false;
    this.isContactNumberChanged = false;
    this.isCstNumberChanged= false;
    this.isCinNumberChanged= false;
    this.isGstNumberChanged= false;
    this.isTanNumberChanged= false;
  }

  listenerForUnique() {
    const dedupe = this.coApplicantForm.get('dedupe');
    if (this.applicantType == 'INDIVENTTYP') {
      dedupe.get('mobilePhone').valueChanges.subscribe((value) => {
        if (!dedupe.get('mobilePhone').invalid) {
          console.log('mobiel no', this.mobileNumber);
          if (value !== this.mobileNumber) {
            this.isMobileChanged = true;
            this.isEnableDedupe = true;
          } else {
            this.isEnableDedupe = false;
            this.isMobileChanged = false;
          }
        } else {
          this.isEnableDedupe = true;
          // this.isMobileChanged = false;
        }
      });
      dedupe.get('name1').valueChanges.subscribe((value) => {
        if (!dedupe.get('name1').invalid) {
          this.enableDedupeBasedOnChanges(value !== this.firstName);
          this.isName1Changed = value !== this.firstName;
        } else {
          this.isEnableDedupe = true;
        }
      });
      dedupe.get('pan').valueChanges.subscribe((value) => {
        value = value || '';
        if (!dedupe.get('pan').invalid) {
          this.enableDedupeBasedOnChanges(value != this.pan);
          this.isPanChanged = value != this.pan;
        } else {
          this.isEnableDedupe = true;
        }
      });
      dedupe.get('aadhar').valueChanges.subscribe((value) => {
        if (!dedupe.get('aadhar').invalid) {
          this.enableDedupeBasedOnChanges(value !== this.aadhar);
          this.isAadharChanged = value !== this.aadhar;
        } else {
          this.isEnableDedupe = true;
        }
      });
      dedupe.get('passportNumber').valueChanges.subscribe((value) => {
        if (!dedupe.get('passportNumber').invalid) {
          this.enableDedupeBasedOnChanges(value !== this.passportNumber);
          this.isPassportChanged = value !== this.passportNumber;
        } else {
          this.isEnableDedupe = true;
        }
      });
      dedupe.get('drivingLicenseNumber').valueChanges.subscribe((value) => {
        if (!dedupe.get('drivingLicenseNumber').invalid) {
          this.enableDedupeBasedOnChanges(value !== this.drivingLicenseNumber);
          this.isDrivingLicenseChanged = value !== this.drivingLicenseNumber;
        } else {
          this.isEnableDedupe = true;
        }
      });
      dedupe.get('voterIdNumber').valueChanges.subscribe((value) => {
        if (!dedupe.get('voterIdNumber').invalid) {
          this.enableDedupeBasedOnChanges(value !== this.voterIdNumber);
          this.isDrivingLicenseChanged = value !== this.voterIdNumber;
        } else {
          this.isEnableDedupe = true;
        }
      });
    } else if (this.applicantType == 'NONINDIVENTTYP') {
      dedupe.get('companyPhoneNumber').valueChanges.subscribe((value) => {
        if (!dedupe.get('companyPhoneNumber').invalid) {
          if (value !== this.contactNumber) {
            this.isContactNumberChanged = true;
            this.isEnableDedupe = true;
          } else {
            this.isEnableDedupe = false;
            this.isContactNumberChanged = false;
          }
        } else {
          this.isEnableDedupe = true;
        }
      });
    }
    dedupe.get('aadhar').valueChanges.subscribe((value) => {
      if (!dedupe.get('aadhar').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.aadhar);
        this.isAadharChanged = value !== this.aadhar;
      } else {
        this.isEnableDedupe = true;
      }
    });
    dedupe.get('pan').valueChanges.subscribe((value) => {
      value = value || '';
      if (!dedupe.get('pan').invalid) {
        this.enableDedupeBasedOnChanges(value != this.pan);
        this.isPanChanged = value != this.pan;
      } else {
        this.isEnableDedupe = true;
      }
    });
    dedupe.get('name1').valueChanges.subscribe((value) => {
      if (!dedupe.get('name1').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.firstName);
        this.isName1Changed = value !== this.firstName;
      } else {
        this.isEnableDedupe = true;
      }
    });
    dedupe.get('corporateIdentificationNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('corporateIdentificationNumber').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.corporateIdentificationNumber);
        this.isCinNumberChanged = value !== this.corporateIdentificationNumber;
      } else {
        this.isEnableDedupe = true;
      }
    });
    dedupe.get('cstVatNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('cstVatNumber').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.cstVatNumber);
        this.isCstNumberChanged = value !== this.cstVatNumber;
      } else {
        this.isEnableDedupe = true;
      }
    });
    dedupe.get('gstNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('gstNumber').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.gstNumber);
        this.isGstNumberChanged = value !== this.gstNumber;
      } else {
        this.isEnableDedupe = true;
      }
    });
    dedupe.get('tanNumber').valueChanges.subscribe((value) => {
      if (!dedupe.get('tanNumber').invalid) {
        this.enableDedupeBasedOnChanges(value !== this.tanNumber);
        this.isTanNumberChanged = value !== this.tanNumber;
      } else {
        this.isEnableDedupe = true;
      }
    });
  }
  

  enableDedupeBasedOnChanges(condition: boolean) {
    if (condition) {
      this.isEnableDedupe = true;
    } else {
      this.isEnableDedupe = false;
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
  }
}
