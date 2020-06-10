import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '../../../services/commom-lov-service';
import { LeadStoreService } from '@services/lead-store.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { ApplicantService } from '@services/applicant.service';
import { UtilityService } from '@services/utility.service';
import { formatDate, Location } from '@angular/common';
import { CreateLeadDataService } from '../../lead-creation/service/createLead-data.service';
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

@Component({
  selector: 'app-add-update-applicant',
  templateUrl: './add-update-applicant.component.html',
  styleUrls: ['./add-update-applicant.component.css'],
})
export class AddOrUpdateApplicantComponent implements OnInit {
  panPattern = {
    // rule: '[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}',
    // msg: 'Invalid Pan',
  };
  panFormPattern = {
    rule: '[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}',
    msg: 'Invalid Pan',
  };
  namePattern = {
    rule: '^[A-Z]*[a-z]*$',
    msg: 'Invalid Name'
  };
  Maxlength30 = {
    rule: 30,
    msg: ''
  };

  drivingLicensePattern = {
    rule: '[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}' ,
    msg: 'Invalid'
  };

  

  mobileNumberPattern = {
    rule: '^[1-9][0-9]*$' ,
    msg: 'Invalid Mobile'
  };

  Maxlength10 = {
    rule: 10,
    msg: ''
  };

  adharNumberPattern = {
    rule: '^[0-9]{12}' ,
    msg: 'Invalid Adhar Number'
  };

  Maxlength12 = {
    rule: 12,
    msg: ''
  };

  passportPattern = {
    rule: '[A-Z]{1}[0-9]{7}' ,
    msg: 'Invalid Passport Number'
  };

  voterIdPattern = {
    rule: '[A-Z]{3}[0-9]{6}' ,
    msg: 'Invalid VoterId Number'
  };

  // addressLineOnePattern = {
  //   rule: '^[0-9A-Za-z, _&*#/\\-]{0,99}$' ,
  //   msg: 'Invalid Address'
  // };

  Maxlength40 = {
    rule: 40,
    msg: ''
  };

  pincodePattern = {
    rule: '^[1-9][0-9]{6}$' ,
    msg: 'Invalid pincode Number'
  };

  values: any = [];
  labels: any = {};
  LOV: any = [];
  coApplicantForm: FormGroup;
  isCurrAddSameAsPermAdd: any = '0';
  applicantId: number;
  applicant: Applicant;
  selectedApplicant: number;

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
  selectApplicantType(event: any) {
    console.log(this.applicantType);
    this.applicantType = event.target.value;
  }

  getPanValue(event: any) {
    this.panValue = event.target.value;
    this.isPanDisabled = this.panValue === '1PANTYPE' ? false : true;
    if (this.isPanDisabled) {
      this.coApplicantForm.controls['pan'].disable();
      this.panPattern = {};
    } else {
      this.coApplicantForm.controls['pan'].enable();
      this.panPattern = this.panFormPattern;

    }
  }

  drvingLisenseValidation(event) {
    const licenseNumber = event.target.value;
    if (licenseNumber) {
      console.log('licenseNumber', licenseNumber);
      // const drivingLicenseIssuePattern = {
      //   //  rule: '[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}' ,
      //   msg: 'Mandatory Field'
      // };
      // const drivingLicenseExpiryPattern = {
      //   //  rule: '[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}' ,
      //   msg: 'Mandatory Field'
      // };
      this.Licensemessage = 'fields Are mandatory';
    }
  }

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
    private createLeadDataService: CreateLeadDataService,
    private location: Location
  ) {}

  onBack() {
    this.location.back();
  }

  getPincode(pincode) {
    const id = pincode.id;
    const pincodeValue = pincode.value;
    console.log('Pincode', pincodeValue);
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
        console.log('getLeadId', value);
        resolve({
          leadId: Number(value.leadId),
          applicantId: Number(value.applicantId),
        });
      });
    });
  }
  async ngOnInit() {
    if(this.panValue = '1PANTYPE') {

    }
    this.initForm();
    this.coApplicantForm.patchValue({ entity: 'Non-individual' });
    this.getLOV();
    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].addApplicant[0];
    });
    // this.activatedRoute.parent.params.subscribe((value) => {
    //   console.log('parent params', value);
    // });
    // this.activatedRoute.params.subscribe((value) => {
    //   console.log('params', value);
    //   // if (!value || !value.id) {
    //   //   this.applicantDataService.setApplicant({});
    //   //   return;
    //   // }
    //   // this.applicantId = Number(value.id);
    //   // this.getApplicantDetails();
    //   if (value && value.leadId) {
    //     this.leadId = Number(value.leadId);
    //   }
    //   if (value && value.applicantId) {
    //     this.applicantId = Number(value.applicantId);
    //     this.getApplicantDetails();
    //   }
    // });
    this.leadId = (await this.getLeadId()) as number;
    if (!this.leadId) {
      const id: any = await this.getLeadIdAndApplicantId();
      this.leadId = id.leadId;
      this.applicantId = id.applicantId;
      if (isNaN(this.applicantId)) {
        this.applicantId = null;
      }
      if (this.applicantId) {
        this.getApplicantDetails();
      }
    }
  }

  createAddressObject(address: AddressDetails) {
    if (!address) {
      return;
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
      this.applicantDataService.setApplicant(applicant);
      this.applicant = this.applicantDataService.getApplicant();
      this.applicantType = this.applicant.applicantDetails.entityTypeKey;
      setTimeout(() => {
        this.setFormValue(this.applicant);
      });
    });
  }
  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  initForm() {
    this.coApplicantForm = new FormGroup({
      loanApplicationRelation: new FormControl(''),
      entityType: new FormControl(''),
      name1: new FormControl(''),
      name2: new FormControl(''),
      name3: new FormControl(''),
      company_name1: new FormControl(''),
      company_name2: new FormControl(''),
      company_name3: new FormControl(''),
      mobilePhone: new FormControl(''),
      dob: new FormControl(''),
      dateOfIncorporation: new FormControl(''),
      voterIdNumber: new FormControl(''),
      identity_type: new FormControl(''),
      aadhar: new FormControl(''),
      form60: new FormControl(''),
      panType: new FormControl(''),
      pan: new FormControl(''),
      passportNumber: new FormControl(''),
      identityNumber: new FormControl(''),
      identity_copy: new FormControl(''),
      permentAddress: new FormGroup(this.getAddressFormControls()),
      communicationAddress: new FormGroup(this.getAddressFormControls()),
      registeredAddress: new FormGroup(this.getAddressFormControls()),
      drivingLicenseNumber: new FormControl(''),
      drivingLicenseIssueDate: new FormControl(''),
      drivingLicenseExpiryDate: new FormControl(''),
      passportIssueDate: new FormControl(''),
      passportExpiryDate: new FormControl(''),
    });

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
      console.log(
        'Entity TYPE IN APPLICANT Get DETAILS CALL',
        this.applicantType
      );
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
      details.dob = this.getFormateDate(aboutIndivProspectDetails.dob);
      console.log('PantYPE Format While patching pancard', details.panType);
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
      details.pan = corporateProspectDetails.panNumber;
      details.aadhar = corporateProspectDetails.aadhar;
      details.mobile = corporateProspectDetails.companyPhoneNumber;
      details.panType = corporateProspectDetails.panType;
      details.dateOfIncorporation = this.getFormateDate(
        corporateProspectDetails.dateOfIncorporation
      );
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
    console.log('applicant value', applicantValue);
    if (!applicantValue) {
      console.log('applicant value -1', applicantValue);
      return;
    } else {
      console.log('applicant 2', applicantValue);
      const details = this.getDetails();
      this.coApplicantForm.patchValue({
        entityType: applicantValue.applicantDetails.entityTypeKey || '',
        loanApplicationRelation:
          applicantValue.applicantDetails.applicantTypeKey || '',
        name1: applicantValue.applicantDetails.name1 || '',
        name2: applicantValue.applicantDetails.name2 || '',
        name3: applicantValue.applicantDetails.name3 || '',
        mobilePhone: details.mobile || '',
        dob: details.dob || '',
        dateOfIncorporation: details.dateOfIncorporation || '',
        identity_type: applicantValue.identity_type || '',
        panType: details.panType,
        aadhar: details.aadhar || '',
        voterIdNumber: details.voterIdNumber,
        pan: details.pan || '',
        drivingLicenseNumber: details.drivingLicenseNumber || '',
        drivingLicenseIssueDate: details.drivingLicenseIssueDate || '',
        drivingLicenseExpiryDate: details.drivingLicenseExpiryDate || '',
        passportNumber: details.passportNumber || '',
        passportIssueDate: details.passportIssueDate || '',
        passportExpiryDate: details.passportExpiryDate || '',
        identity_number: applicantValue.identity_number || '',
        identity_copy: applicantValue.identity_copy || '',
        address1: applicantValue.address1 || '',
        address2: applicantValue.address2 || '',
        address3: applicantValue.address3 || '',
        permanent_address_city: applicantValue.permanent_address_city || '',
        permanent_address_district:
          applicantValue.permanent_address_district || '',
        permanent_address_state: applicantValue.permanent_address_state || '',
        permanent_address_country:
          applicantValue.permanent_address_country || '',
        line1: applicantValue.line1 || '',
        line2: applicantValue.line2 || '',
        line3: applicantValue.line3 || '',
        current_address_city: applicantValue.current_address_city || '',
        current_address_district: applicantValue.current_address_district || '',
        current_address_state: applicantValue.current_address_state || '',
        current_address_country: applicantValue.current_address_country || '',
        registered_line1: applicantValue.registered_line1 || '',
        registered_line2: applicantValue.registered_line2 || '',
        registered_line3: applicantValue.registered_line3 || '',
        registered_address_city: applicantValue.registered_address_city || '',
        registered_address_district:
          applicantValue.registered_address_district || '',
        registered_address_state: applicantValue.registered_address_state || '',
        registered_address_country:
          applicantValue.registered_address_country || '',
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
        const permenantAddressObj = addressObj[Constant.PERMANENT_ADDRESS];
        this.permanentPincode = {
          city: [
            {
              key: permenantAddressObj.city,
              value: permenantAddressObj.cityValue,
            },
          ],
          district: [
            {
              key: permenantAddressObj.district,
              value: permenantAddressObj.districtValue,
            },
          ],
          state: [
            {
              key: permenantAddressObj.state,
              value: permenantAddressObj.stateValue,
            },
          ],
          country: [
            {
              key: permenantAddressObj.country,
              value: permenantAddressObj.countryValue,
            },
          ],
        };
        permentAddress.patchValue(
          this.createAddressObject(permenantAddressObj)
        );
        const cummunicationAddressObj =
          addressObj[Constant.COMMUNICATION_ADDRESS];
        this.currentPincode = {
          city: [
            {
              key: cummunicationAddressObj.city,
              value: cummunicationAddressObj.cityValue,
            },
          ],
          district: [
            {
              key: cummunicationAddressObj.district,
              value: cummunicationAddressObj.districtValue,
            },
          ],
          state: [
            {
              key: cummunicationAddressObj.state,
              value: cummunicationAddressObj.stateValue,
            },
          ],
          country: [
            {
              key: cummunicationAddressObj.country,
              value: cummunicationAddressObj.countryValue,
            },
          ],
        };
        cummunicationAddress.patchValue(
          this.createAddressObject(cummunicationAddressObj)
        );
      } else {
        const addressObj = this.getAddressObj();
        const registeredAddress = this.coApplicantForm.get('registeredAddress');
        const registeredAddressObj = addressObj[Constant.REGISTER_ADDRESS];
        this.registerPincode = {
          city: [
            {
              key: registeredAddressObj.city,
              value: registeredAddressObj.cityValue,
            },
          ],
          district: [
            {
              key: registeredAddressObj.district,
              value: registeredAddressObj.districtValue,
            },
          ],
          state: [
            {
              key: registeredAddressObj.state,
              value: registeredAddressObj.stateValue,
            },
          ],
          country: [
            {
              key: registeredAddressObj.country,
              value: registeredAddressObj.countryValue,
            },
          ],
        };
        registeredAddress.patchValue(
          this.createAddressObject(registeredAddressObj)
        );
      }
    }
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
    // this.leadSectionService.setCurrentPage(1);
  }

  getEntityObject(key: string) {
    console.log(this.values.entity, 'entity', key);
    return this.values.entity.find((value) => value.key === Number(key));
  }

  formatGivenDate(date) {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-us') : '';
  }
  storeIndividualValueInService(coApplicantModel) {
    this.aboutIndivProspectDetails = {
      dob: this.formatGivenDate(coApplicantModel.dob),
      mobilePhone: coApplicantModel.mobilePhone,
    };

    this.indivIdentityInfoDetails = {
      form60: coApplicantModel.form60,
      panType: coApplicantModel.panType,
      pan: coApplicantModel.pan,
      aadhar: coApplicantModel.aadhar,
      passportNumber: coApplicantModel.passportNumber,
      passportIssueDate: this.formatGivenDate(
        coApplicantModel.passportIssueDate
      ),
      passportExpiryDate: this.formatGivenDate(
        coApplicantModel.passportExpiryDate
      ),
      drivingLicenseNumber: coApplicantModel.drivingLicenseNumber,
      drivingLicenseIssueDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseExpiryDate
      ),
      voterIdNumber: coApplicantModel.voterIdNumber,
    };

    this.addressDetails = [];
    const permanentAddress = coApplicantModel.permentAddress;
    if (permanentAddress) {
      const addressObject = this.createAddressObject(permanentAddress);
      console.log('permanant Address', addressObject);
      this.addressDetails.push({
        ...addressObject,
        addressType: Constant.PERMANENT_ADDRESS,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
        // pincode : 600002,
        // city : 114100,
        // state : 40,
        // country : 'IND',
        // district : 127
      });
    }
    const communicationAddress = coApplicantModel.communicationAddress;
    if (communicationAddress) {
      const addressObject = this.createAddressObject(communicationAddress);
      console.log('Communication Address', addressObject);
      this.addressDetails.push({
        ...addressObject,
        addressType: Constant.COMMUNICATION_ADDRESS,
        isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
        // pincode : 600002,
        // city : 114100,
        // state : 40,
        // country : 'IND',
        // district : 127
      });
    }
  }

  storeNonIndividualValueInService(coApplicantModel) {
    this.corporateProspectDetails = {
      dateOfIncorporation: this.formatGivenDate(
        coApplicantModel.dateOfIncorporation
      ),
      panNumber: coApplicantModel.pan,
      passportNumber: coApplicantModel.passportNumber,
      passportIssueDate: this.formatGivenDate(
        coApplicantModel.passportIssueDate
      ),
      passportExpiryDate: this.formatGivenDate(
        coApplicantModel.passportExpiryDate
      ),
      drivingLicenseNumber: coApplicantModel.drivingLicenseNumber,
      drivingLicenseIssueDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseIssueDate
      ),
      drivingLicenseExpiryDate: this.formatGivenDate(
        coApplicantModel.drivingLicenseExpiryDate
      ),
      voterIdNumber: coApplicantModel.voterIdNumber,
      companyPhoneNumber: coApplicantModel.mobilePhone,
      panType: coApplicantModel.panType,
    };

    const registerAddress = coApplicantModel.registeredAddress;
    if (registerAddress) {
      this.addressDetails = [];
      const addressObject = this.createAddressObject(registerAddress);
      console.log('Registred Address', addressObject);
      this.addressDetails = [
        {
          ...addressObject,
          addressType: Constant.REGISTER_ADDRESS,
          isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
          // pincode : 600002,
          // city : 114100,
          // state : 40,
          // country : 'IND',
          // district : 127
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

    console.log('coApplicantModel', coApplicantModel);
    return;
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
      entityType: coApplicantModel.entityType,
      name1: coApplicantModel.name1,
      name2: coApplicantModel.name2,
      name3: coApplicantModel.name3,
      loanApplicationRelation: coApplicantModel.loanApplicationRelation,
      customerCategory: 'SALCUSTCAT',
      title: 'MRSALUTATION',
    };
    const DOB = this.utilityService.getDateFormat(coApplicantModel.dob);
    console.log('Formatted DOB', DOB);

    this.indivProspectProfileDetails = {
      employerType: 'test',
      employerName: 'Appiyo Technologies',
      workplaceAddress: 'test',
    };

    console.log(
      'Drving Licanse Issue Date',
      coApplicantModel.dateOfIncorporation
    );
    // this.addressDetails = [
    //   {
    //     addressType: 'PERMADDADDTYP',
    //     addressLineOne: coApplicantModel.permentAddress.addressLineOne,
    //     addressLineTwo: coApplicantModel.permentAddress.addressLineTwo,
    //     addressLineThree: coApplicantModel.permentAddress.addressLineThree,
    //     pincode: Number(coApplicantModel.permentAddress.pincode),
    //     city: Number(coApplicantModel.permentAddress.city),
    //     district: Number(coApplicantModel.permentAddress.district),
    //     state: Number(coApplicantModel.permentAddress.state),
    //     country: 'IND',
    //     landlineNumber: coApplicantModel.permentAddress.landlineNumber,
    //     // mobileNumber: '9988776655',
    //     // accommodationType: '1ADDACCTYP',
    //     // periodOfCurrentStay: 10,
    //     isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
    //   },
    //   {
    //     addressType: 'COMMADDADDTYP',
    //     addressLineOne: coApplicantModel.communicationAddress.addressLineOne,
    //     addressLineTwo: coApplicantModel.communicationAddress.addressLineTwo,
    //     addressLineThree:
    //       coApplicantModel.communicationAddress.addressLineThree,
    //     pincode: Number(coApplicantModel.communicationAddress.pincode),
    //     city: Number(coApplicantModel.communicationAddress.city),
    //     district: Number(coApplicantModel.communicationAddress.district),
    //     state: Number(coApplicantModel.communicationAddress.state),
    //     country: 'IND',
    //     landlineNumber: coApplicantModel.communicationAddress.landlineNumber,
    //     // mobileNumber: '9988776655',
    //     // accommodationType: '1ADDACCTYP',
    //     // periodOfCurrentStay: 10,
    //     isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
    //   },
    // ];

    // this.addressDetails = [{
    //   addressType: 'PERMADDADDTYP',
    //   addressLineOne: 'test',
    //   addressLineTwo: 'test',
    //   addressLineThree: 'test',
    //   pincode: 123456,
    //   city: 1,
    //   district: 1,
    //   state: 1,
    //   country: 'IN',
    //   landlineNumber: '044202020',
    //   mobileNumber: '9988776655',
    //   accommodationType: '1ADDACCTYP',
    //   periodOfCurrentStay: 10,
    //   isCurrAddSameAsPermAdd: '1'
    // }];

    console.log('adress Details', this.addressDetails);
    const data = {
      applicantDetails: this.applicantDetails,
      aboutIndivProspectDetails: this.aboutIndivProspectDetails,
      indivIdentityInfoDetails: this.indivIdentityInfoDetails,
      indivProspectProfileDetails: this.indivProspectProfileDetails,
      corporateProspectDetails: this.corporateProspectDetails,
      addressDetails: this.addressDetails,
      applicantId: this.applicantId,
      leadId: this.leadId,
    };
    console.log(this.applicantDetails);

    this.applicantService.saveApplicant(data).subscribe((res: any) => {
      const response = res;
      if (response.Error === '0') {
        const message = response.ProcessVariables.error.message;
        console.log('Success Message', message);
      }
      const url = this.location.path();

      if (url.includes('sales')) {
        this.router.navigateByUrl(`pages/sales/${this.leadId}/applicant-list`);
        return;
      }
      this.router.navigateByUrl(
        `pages/lead-section/${this.leadId}/applicant-details`
      );
    });
  }

  onAddress(event) {
    const eventClicked = event.target.checked;
    const formValue: AddressDetails = this.coApplicantForm.value.permentAddress;
    this.isCurrAddSameAsPermAdd = eventClicked === true ? '1' : '0';
    if (eventClicked) {
      this.currentPincode = this.permanentPincode;
    }
    const communicationAddress = this.coApplicantForm.get(
      'communicationAddress'
    );
    communicationAddress.patchValue(this.createAddressObject(formValue));
  }
}
