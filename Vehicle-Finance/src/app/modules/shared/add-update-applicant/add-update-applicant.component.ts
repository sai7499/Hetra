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
    rule: '[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}',
    msg: 'Pan is invalid',
  };
  namePattern = {
    // rule: '^[A-Z]*[a-z]*$',
    // msg: 'Invalid Name'
  };
  namePatternIdv = {
    rule: '^[A-Z]*[a-z]*$',
    msg: 'Invalid Name',
  };
  namePatternNonIdv = {
    rule: '^[0-9A-Za-z, _&*#/\\-@]{0,99}$',
    msg: 'Invalid  Name',
  };
  maxlength30 = {
    rule: 30,
    msg: '',
  };
  maxlength9 = {
    rule: 9,
    msg: '',
  };

  drivingLicensePattern = {
    rule: '[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}',
    msg: 'Invalid',
  };

  panRequired = '';

  mobileNumberPattern = {
    rule: '^[1-9][0-9]*$',
    msg: 'Numbers Only Required',
  };

  maxlength10 = {
    rule: 10,
    msg: 'Max Required Length 10',
  };

  adharNumberPattern = {
    rule: '^[0-9]{12}',
    msg: 'Invalid Aadhaar Number',
  };

  maxlength12 = {
    rule: 12,
    msg: '',
  };

  passportPattern = {
    rule: '[A-Z]{1}[0-9]{7}',
    msg: 'Invalid Passport Number',
  };

  voterIdPattern = {
    rule: '[A-Z]{3}[0-9]{6}',
    msg: 'Invalid VoterId Number',
  };

  // addressLineOnePattern = {
  //   rule: '^[0-9A-Za-z, _&*#/\\-]{0,99}$' ,
  //   msg: 'Invalid Address'
  // };

  maxlength40 = {
    rule: 40,
    msg: '',
  };

  pincodePattern = {
    rule: '[1-9]{1}[0-9]{5}',
    msg: 'Invalid pincode Number',
  };

  landlLinePattern = {
    // rule: '^[0-9]\d{2,4}-\d{6,8}$' ,
    // msg: 'Invalid Landline Number'
    rule: '^[0-9]{6,15}',
    msg: 'Invalid Landline Number',
  };

  maxlength15 = {
    rule: 15,
    msg: '',
  };
  maxlength8 = {
    rule: 8,
    msg: '',
  };
  maxlength6 = {
    rule: 6,
    msg: '',
  };

  isMobileChanged = false;
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
  isAddressSame: boolean;
  showDedupeModal: boolean;
  isDirty: boolean;

  toDayDate: Date = new Date();

  mandatory: any = {};
  expiryMandatory: any = {};

  values: any = [];
  labels: any = {};
  LOV: any = [];
  coApplicantForm: FormGroup;
  isCurrAddSameAsPermAdd: any = '0';
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

  aboutIndivProspectDetails: IndividualProspectDetails;

  indivIdentityInfoDetails: IndivIdentityInfoDetails;

  indivProspectProfileDetails: IndivProspectProfileDetails;

  corporateProspectDetails: CorporateProspectDetails;

  addressDetails: AddressDetails[];
  isPanDisabled: boolean;
  Licensemessage: string;
  passportMandatory: any = {};

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
    this.coApplicantForm.patchValue({ entity: 'Non-individual' });
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
        this.listenerForUnique();
      } else {
        this.isEnableDedupe = true;
        this.coApplicantForm.get('dedupe').get('pan').disable();
      }
    }
  }

  selectApplicantType(event: any) {
    this.applicantType = event.target.value;
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;
    if (this.applicantType !== 'INDIVENTTYP') {
      this.namePattern = this.namePatternNonIdv;
      dedupe.addControl('dateOfIncorporation', new FormControl(''));
      this.removeIndFormControls();
    } else {
      this.namePattern = { ...this.namePatternIdv };
      dedupe.addControl('aadhar', new FormControl(''));
      dedupe.addControl('dob', new FormControl(''));
      this.removeNonIndFormControls();
    }
  }

  removeIndFormControls() {
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;
    dedupe.removeControl('aadhar');
    dedupe.removeControl('dob');
  }
  removeNonIndFormControls() {
    const dedupe = this.coApplicantForm.get('dedupe') as FormGroup;
    dedupe.removeControl('dateOfIncorporation');
  }

  getPanValue(event: any) {
    this.panValue = event.target.value;
    this.isPanDisabled = this.panValue === '1PANTYPE';
    const dedupe = this.coApplicantForm.get('dedupe');
    if (!this.isPanDisabled) {
      dedupe.patchValue({
        pan: '',
      });
      setTimeout(() => {
        dedupe.get('pan').disable();
      });
      this.panPattern = {};
      // this.panRequired = null;
      this.panRequired = null;
    } else {
      dedupe.patchValue({
        pan: '',
      });
      dedupe.get('pan').enable();
      this.panPattern = this.panFormPattern;
      this.panRequired = 'Pan is required';
    }
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
        if (id === 'permanentPincode') {
          this.permanentPincode = value;
          return;
        }
        if (id === 'currentPincode') {
          this.currentPincode = value;
          return;
        }
        if (id === 'registerPincode') {
          this.registerPincode = value;
        }
      });
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
      return {};
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

      if (processVariables.ucic) {
        this.disablePermanentAddress();
        this.disableRegisteredAddress();
        this.disableCommunicationAddress();
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
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  getDedupeFormControls() {
    return {
      loanApplicationRelation: new FormControl('', Validators.required),
      entityType: new FormControl('', Validators.required),
      name1: new FormControl('', Validators.required),
      name2: new FormControl(''),
      name3: new FormControl(''),
      mobilePhone: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      dateOfIncorporation: new FormControl('', Validators.required),
      voterIdNumber: new FormControl(''),
      aadhar: new FormControl('', Validators.required),
      panType: new FormControl(''),
      pan: new FormControl(''),
      passportNumber: new FormControl(''),
      drivingLicenseNumber: new FormControl(''),
      drivingLicenseIssueDate: new FormControl(''),
      drivingLicenseExpiryDate: new FormControl(''),
      passportIssueDate: new FormControl(''),
      passportExpiryDate: new FormControl(''),
    };
  }

  initForm() {
    this.coApplicantForm = new FormGroup({
      dedupe: new FormGroup(this.getDedupeFormControls()),
      permentAddress: new FormGroup(this.getAddressFormControls()),
      communicationAddress: new FormGroup(this.getAddressFormControls()),
      registeredAddress: new FormGroup(this.getAddressFormControls()),
    });
    this.removeNonIndFormControls();
    this.enableDedupeButton();

    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAddressFormControls() {
    return {
      addressLineOne: new FormControl(''),
      addressLineTwo: new FormControl(''),
      addressLineThree: new FormControl(''),
      pincode: new FormControl(''),
      city: new FormControl(''),
      district: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
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
        details.dob = aboutIndivProspectDetails.dob
          .split('/')
          .reverse()
          .join('-');
        details.dob = new Date(details.dob);
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
      details.pan = corporateProspectDetails.panNumber;
      details.aadhar = corporateProspectDetails.aadhar;
      details.mobile = corporateProspectDetails.companyPhoneNumber;
      details.panType = corporateProspectDetails.panType;

      if (corporateProspectDetails.dateOfIncorporation) {
        details.dateOfIncorporation = corporateProspectDetails.dateOfIncorporation
          .split('/')
          .reverse()
          .join('-');
        details.dateOfIncorporation = new Date(details.dateOfIncorporation);
      }

      details.passportNumber = corporateProspectDetails.passportNumber;
      details.passportIssueDate = this.getFormateDate(
        corporateProspectDetails.passportIssueDate
      );
      details.passportExpiryDate = this.getFormateDate(
        corporateProspectDetails.passportExpiryDate
      );
      details.drivingLicenseNumber =
        corporateProspectDetails.drivingLicenseNumber;
      details.drivingLicenseIssueDate = this.getFormateDate(
        corporateProspectDetails.drivingLicenseIssueDate
      );
      details.drivingLicenseExpiryDate = this.getFormateDate(
        corporateProspectDetails.drivingLicenseExpiryDate
      );
      details.voterIdNumber = corporateProspectDetails.voterIdNumber;
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
      this.drivingLicenseNumber = details.drivingLicenseNumber || '';
      this.passportNumber = details.passportNumber || '';
      this.pan = details.pan || '';
      let mobile = details.mobile;
      if (mobile && mobile.length === 12) {
        mobile = mobile.slice(2, 12);
      }
      this.mobileNumber = mobile;

      this.setValueForFormControl('pan', details.pan);

      const dedupe = this.coApplicantForm.get('dedupe');

      if (details.panType === '2PANTYPE') {
        this.coApplicantForm.get('dedupe').get('pan').disable();
      }

      dedupe.patchValue({
        entityType: applicantValue.applicantDetails.entityTypeKey || '',
        loanApplicationRelation:
          applicantValue.applicantDetails.applicantTypeKey || '',
        name1: applicantValue.applicantDetails.name1 || '',
        name2: applicantValue.applicantDetails.name2 || '',
        name3: applicantValue.applicantDetails.name3 || '',
        mobilePhone: mobile || '',
        dob: details.dob || '',
        dateOfIncorporation: details.dateOfIncorporation || '',
        identity_type: applicantValue.identity_type || '',
        panType: details.panType || '',
        pan: details.pan ||  '',
        aadhar: details.aadhar || '',
        voterIdNumber: details.voterIdNumber,
        drivingLicenseNumber: details.drivingLicenseNumber || '',
        drivingLicenseIssueDate: details.drivingLicenseIssueDate || '',
        drivingLicenseExpiryDate: details.drivingLicenseExpiryDate || '',
        passportNumber: details.passportNumber || '',
        passportIssueDate: details.passportIssueDate || '',
        passportExpiryDate: details.passportExpiryDate || '',
      });

      if (
        this.applicant.applicantDetails.entityTypeKey ===
        Constant.ENTITY_INDIVIDUAL_TYPE
      ) {
        const permentAddress = this.coApplicantForm.get('permentAddress');
        const cummunicationAddress = this.coApplicantForm.get(
          'communicationAddress'
        );
        const addressObj = this.getAddressObj();
        const permenantAddressObj =
          addressObj[Constant.PERMANENT_ADDRESS] || {};
        this.isAddressSame = permenantAddressObj.isCurrAddSameAsPermAdd === '1';
        if (this.isAddressSame) {
          cummunicationAddress.disable();
        }
        this.permanentPincode = this.formatPincodeData(permenantAddressObj);
        permentAddress.patchValue(
          this.createAddressObject(permenantAddressObj)
        );

        const cummunicationAddressObj =
          addressObj[Constant.COMMUNICATION_ADDRESS];
        this.currentPincode = this.formatPincodeData(cummunicationAddressObj);
        cummunicationAddress.patchValue(
          this.createAddressObject(cummunicationAddressObj)
        );
      } else {
        const addressObj = this.getAddressObj();
        const registeredAddress = this.coApplicantForm.get('registeredAddress');
        const registeredAddressObj = addressObj[Constant.REGISTER_ADDRESS];
        this.registerPincode = this.formatPincodeData(registeredAddressObj);
        registeredAddress.patchValue(
          this.createAddressObject(registeredAddressObj)
        );
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
      drivingLicenseNumber: String(dedupe.drivingLicenseNumber || '').toUpperCase(),
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
    const communicationAddress = coApplicantModel.communicationAddress;
    if (communicationAddress) {
      const addressObject = this.createAddressObject(communicationAddress);
      this.addressDetails.push({
        ...addressObject,
        addressType: Constant.COMMUNICATION_ADDRESS,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
      });
    }
  }

  storeNonIndividualValueInService(coApplicantModel) {
    const dedupe = coApplicantModel.dedupe;
    this.corporateProspectDetails = {
      dateOfIncorporation: this.formatGivenDate(dedupe.dateOfIncorporation),
      panNumber: String(dedupe.pan || '').toUpperCase(),
      passportNumber: String(dedupe.passportNumber || '').toUpperCase(),
      passportIssueDate: this.formatGivenDate(dedupe.passportIssueDate),
      passportExpiryDate: this.formatGivenDate(dedupe.passportExpiryDate),
      drivingLicenseNumber: String(dedupe.drivingLicenseNumber || '').toUpperCase(),
      drivingLicenseIssueDate: this.formatGivenDate(
        dedupe.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.formatGivenDate(
        dedupe.drivingLicenseExpiryDate
      ),
      voterIdNumber: String(dedupe.voterIdNumber || '').toUpperCase(),
      companyPhoneNumber: dedupe.mobilePhone,
      panType: dedupe.panType,
    };

    const registerAddress = coApplicantModel.registeredAddress;
    if (registerAddress) {
      this.addressDetails = [];
      const addressObject = this.createAddressObject(registerAddress);
      this.addressDetails = [
        {
          ...addressObject,
          addressType: Constant.REGISTER_ADDRESS,
          isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
        },
      ];
    }
  }
  onFormSubmit() {
    const formValue = this.coApplicantForm.value;
    const coApplicantModel = {
      ...formValue,
      entity: this.getEntityObject(formValue.entity),
    };

    const rawValue = this.coApplicantForm.getRawValue();
    if (this.applicantType === 'INDIVENTTYP') {
      this.storeIndividualValueInService(coApplicantModel);
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
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
      customerCategory: 'SALCUSTCAT',
      title: 'MRSALUTATION',
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
    this.isCurrAddSameAsPermAdd = eventClicked === true ? '1' : '0';
    const communicationAddress = this.coApplicantForm.get(
      'communicationAddress'
    );
    if (eventClicked) {
      const formValue: AddressDetails = this.coApplicantForm.value
        .permentAddress;
      this.currentPincode = this.permanentPincode;
      communicationAddress.patchValue(this.createAddressObject(formValue));
      communicationAddress.disable();
    } else {
      communicationAddress.enable();
    }
  }

  disablePermanentAddress() {
    this.coApplicantForm.get('permentAddress').disable();
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
    this.isDirty = true;
    if (dedupe.invalid) {
      return;
    }

    console.log('dedupe', dedupe);

    const applicantDetails = dedupe.value;
    let mobileNumber = applicantDetails.mobilePhone;
    if (mobileNumber.length === 10) {
      mobileNumber = '91' + mobileNumber;
    }

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
      voterIdNumber: String(applicantDetails.voterIdNumber || '').toUpperCase(),
      drivingLicenseNumber: String(
        applicantDetails.drivingLicenseNumber || ''
      ).toUpperCase(),
      drivingLicenseIssueDate: this.utilityService.getDateFormat(
        applicantDetails.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.utilityService.getDateFormat(
        applicantDetails.drivingLicenseExpiryDate 
      ),
      passportNumber: String(applicantDetails.passportNumber || '').toUpperCase(),
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
        if (value.Error === '0') {
          const processVariables = value.ProcessVariables;
          if (!processVariables.dedupeFound) {
            this.applicantId = processVariables.applicantId;
            this.showDedupeModal = true;
            return;
          }
          this.salesDedupeService.setDedupeParameter(data);
          this.salesDedupeService.setDedupeDetails(value.ProcessVariables);
          this.router.navigateByUrl(
            `/pages/lead-section/${this.leadId}/sales-exact-match`
          );
        }
      });
  }

  navigateToSamePage() {
    this.showDedupeModal = false;
    this.router.navigateByUrl(
      `/pages/lead-section/${this.leadId}/co-applicant/${this.applicantId}`
    );
    this.isEnableDedupe = false;
  }

  listenerForUnique() {
    const dedupe = this.coApplicantForm.get('dedupe');
    dedupe.get('mobilePhone').valueChanges.subscribe((value) => {
      if (value !== this.mobileNumber) {
        this.isMobileChanged = true;
        this.isEnableDedupe = true;
      } else {
        this.isEnableDedupe = false;
        this.isMobileChanged = false;
      }
    });
    dedupe.get('name1').valueChanges.subscribe((value) => {
      this.enableDedupeBasedOnChanges(value !== this.firstName);
    });
    dedupe.get('pan').valueChanges.subscribe((value) => {
      this.enableDedupeBasedOnChanges(value !== this.pan);
    });
    dedupe.get('aadhar').valueChanges.subscribe((value) => {
      this.enableDedupeBasedOnChanges(value !== this.aadhar);
    });
    dedupe.get('passportNumber').valueChanges.subscribe((value) => {
      this.enableDedupeBasedOnChanges(value !== this.passportNumber);
    });
    dedupe.get('drivingLicenseNumber').valueChanges.subscribe((value) => {
      this.enableDedupeBasedOnChanges(value !== this.drivingLicenseNumber);
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
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }
}
