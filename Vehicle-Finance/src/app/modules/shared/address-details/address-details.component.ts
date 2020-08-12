import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from 'src/app/services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import {
  AddressDetails,
  Applicant,
  ApplicantDetails,
} from '@model/applicant.model';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { LeadStoreService } from '../../sales/services/lead.store.service';
import { Constant } from '@assets/constants/constant';
import { map } from 'rxjs/operators';
import { UtilityService } from '@services/utility.service';
import { constants } from 'os';
import { ToasterService } from '@services/toaster.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css'],
})
export class AddressDetailsComponent implements OnInit {
  isIndividual = true;
  addressForm: FormGroup;
  addressDetailsDataArray: any = [];
  dropDownValues: any = [];
  isSalesOrCredit: string;
  values: any = [];
  LOV: any = [];
  labels: any = {};
  validationData: any;
  address: Applicant;
  applicantId: number;
  leadId: number;
  isDirty: boolean;

  permanantPincode: {
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
  officePincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };
  registeredPincode: {
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

  isCurrAddSameAsPermAdd: any;
  permenantAddressDetails: AddressDetails[];
  currentAddressDetails: AddressDetails[];
  onPerAsCurChecked: boolean;
  onRegAsCommChecked: boolean;
  onCurrAsOfficeChecked: boolean;
  addressObj: any;

  isOfficeAddressMandatory: boolean;


  constructor(
    private lovData: LovDataService,
    private labelsData: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commomLovService: CommomLovService,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private utilityService: UtilityService,
    private toasterService: ToasterService
  ) { }

  async ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.hasRoute();
    this.leadId = (await this.getLeadId()) as number;
    console.log('leadId', this.leadId);

    this.lovData.getLovData().subscribe((res: any) => {
      console.log(res, 'res');
      this.values = res[0].addApplicant[0];
      this.listenerForOfficeAddress();

      console.log(this.values, 'values');
      this.activatedRoute.params.subscribe((value) => {
        if (!value && !value.applicantId) {
          return;
        }
        this.applicantId = Number(value.applicantId);
        this.getAddressDetails();
        //console.log('onperascur', this.onPerAsCurChecked)
      });
    });


  }

  listenerForOfficeAddress() {
    const formArray = this.addressForm.get('details') as FormArray;
    const officeAddress = formArray.at(0).get('officeAddress');
    const addressLineOne = officeAddress.get('addressLineOne');
    const addressLineTwo = officeAddress.get('addressLineTwo');
    const addressLineThree = officeAddress.get('addressLineThree');
    const pincode = officeAddress.get('pincode');
    const landlineNumber = officeAddress.get('landlineNumber');
    const mobileNumber = officeAddress.get('mobileNumber');
    const nearestLandmark = officeAddress.get('nearestLandmark');
    this.addressCommonListener(addressLineOne);
    this.addressCommonListener(addressLineTwo);
    this.addressCommonListener(addressLineThree);
    this.addressCommonListener(pincode);
    this.addressCommonListener(landlineNumber);
    this.addressCommonListener(mobileNumber);
    this.addressCommonListener(nearestLandmark);
  }

  addressCommonListener(control: AbstractControl) {
    const formArray = this.addressForm.get('details') as FormArray;
    const officeAddress = formArray.at(0).get('officeAddress');
    let isChanged = false;
    let val = control.value;
    control.valueChanges.subscribe((value) => {
      if (value === undefined || val === value) {
        return;
      }
      val = value;
      if (this.isDirty) {
        this.isDirty = false;
      }
      if (value) {
        // }
        if (!isChanged) {
          this.addValidatorsForOfficeAddress();
        }
        isChanged = true;
        this.isOfficeAddressMandatory = true;
      } else {
        // this.isDirty = false;
        this.isOfficeAddressMandatory = false;

        if (!isChanged) {
          return;
        }

        this.removeValidatorsForOfficeAddress();

        setTimeout(() => {
          if (isChanged) {
            isChanged = false;
            // officeAddress.patchValue({
            //   addressLineOne: null,
            //   pincode: null,
            // });
            control.setValue(null);
          }
        });
      }
    });
  }

  addValidatorsForOfficeAddress() {
    const formArray = this.addressForm.get('details') as FormArray;
    const officeAddress = formArray.at(0).get('officeAddress');
    const validators = [Validators.required];
    officeAddress.get('addressLineOne').setValidators(validators);
    officeAddress.get('pincode').setValidators(validators);
    officeAddress.get('city').setValidators(validators);
    officeAddress.get('district').setValidators(validators);
    officeAddress.get('state').setValidators(validators);
    officeAddress.get('country').setValidators(validators);
    officeAddress.updateValueAndValidity();
  }

  removeValidatorsForOfficeAddress() {
    const formArray = this.addressForm.get('details') as FormArray;
    const officeAddress = formArray.at(0).get('officeAddress');
    officeAddress.get('addressLineOne').clearValidators();
    officeAddress.get('pincode').clearValidators();
    officeAddress.get('city').clearValidators();
    officeAddress.get('district').clearValidators();
    officeAddress.get('state').clearValidators();
    officeAddress.get('country').clearValidators();
    officeAddress.updateValueAndValidity();
  }

  onBack() {
    //this.location.back();
    const url = this.location.path();
    if (url.includes('sales')) {
      this.router.navigateByUrl(`/pages/sales-applicant-details/${this.leadId}/identity-details/${this.applicantId}`);
    } else {
      this.router.navigateByUrl(`/pages/applicant-details/${this.leadId}/identity-details/${this.applicantId}`);
    }

  }

  navigateToApplicantList() {
    const url = this.location.path();
    if (url.includes('sales')) {
      this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
      return;
    }
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }

  inputPincode(event) {
    const value = event.target.value;
    const id = event.target.id;
    //console.log('pincode change ', pincode)

    if (value.length == 6) {

      this.getPincodeResult(Number(value), id);
    }
  }

  getPincodeResult(pincode: number, id: string) {
    this.applicantService
      .getGeoMasterValue({
        pincode: pincode,
      })
      .pipe(
        map((value: any) => {
          const processVariables = value.ProcessVariables;
          const addressList: any[] = processVariables.GeoMasterView;
          console.log('addressList', addressList);
          if (value.Error !== '0') {
            return null;
          }
          if (!addressList) {
            this.toasterService.showError('Invalid pincode', '');
            return;
          }

          const first = addressList[0];
          console.log('first', first);
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
        const formArray = this.addressForm.get('details') as FormArray
        let details = formArray.at(0)
        if (id == 'permanantPincode') {
          details.get('permanantAddress').get('city').setValue('')
          this.permanantPincode = value;

          formGroupName = 'permanantAddress';
          this.setDefaultValueForAddress(value, formGroupName)

        }
        if (id == 'currentPincode') {

          details.get('currentAddress').get('city').setValue('')
          this.currentPincode = value;
          formGroupName = 'currentAddress';
          this.setDefaultValueForAddress(value, formGroupName)


        }
        if (id == 'officePincode') {
          details.get('officeAddress').get('city').setValue('')
          this.officePincode = value;
          formGroupName = 'officeAddress';
          this.setDefaultValueForAddress(value, formGroupName)

        }
        if (id == 'registeredPincode') {
          details.get('registeredAddress').get('city').setValue('')
          this.registeredPincode = value;
          formGroupName = 'registeredAddress';
          this.setDefaultValueForAddress(value, formGroupName)

        }
        if (id == 'communicationPincode') {
          details.get('communicationAddress').get('city').setValue('')
          this.communicationPincode = value;
          formGroupName = 'communicationAddress';
          this.setDefaultValueForAddress(value, formGroupName)

        }
      });
  }
  setDefaultValueForAddress(value, formGroupName: string) {

    const country = value.country;
    const state = value.state;
    const district = value.district;
    const formArray = this.addressForm.get('details') as FormArray
    const details = formArray.at(0)
    if (country && country.length === 1) {
      details.get(formGroupName).patchValue({
        country: country[0].key,
      });
    }

    if (district && district.length === 1) {
      details.get(formGroupName).patchValue({
        district: district[0].key,
      });
    }

    if (state && state.length === 1) {
      details.get(formGroupName).patchValue({
        state: state[0].key,
      });
    }
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
  initForm() {
    this.addressForm = new FormGroup({
      entity: new FormControl(''),
      details: new FormArray([]),
    });
    this.addIndividualFormControls();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe((data) => {
      this.labels = data;
      this.validationData = data.validationData
      console.log(this.validationData)
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  onIndividualChange(event) {
    if (!event) {
      return;
    }
    const value = event.target.value;
    this.isIndividual = value === 'INDIVENTTYP';
    const formArray = this.addressForm.get('details') as FormArray;
    formArray.clear();
    this.isIndividual
      ? this.addIndividualFormControls()
      : this.addNonIndividualFormControls();
  }

  getAddressFormControls() {
    return {
      addressLineOne: new FormControl(null, Validators.required),
      addressLineTwo: new FormControl(null),
      addressLineThree: new FormControl(null),
      pincode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      landlineNumber: new FormControl(null),
      nearestLandmark: new FormControl(null)
    };
  }

  addIndividualFormControls() {
    const individual = new FormGroup({
      permanantAddress: new FormGroup(this.getAddressFormControls()),
      currentAddress: new FormGroup({
        ...this.getAddressFormControls(),
        periodOfCurrentStay: new FormControl(''),
        mobileNumber: new FormControl(''),
        accommodationType: new FormControl(''),
      }),
      officeAddress: new FormGroup({
        addressLineOne: new FormControl(null),
        addressLineTwo: new FormControl(null),
        addressLineThree: new FormControl(null),
        pincode: new FormControl(''),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        landlineNumber: new FormControl(null),
        //periodOfCurrentStay: new FormControl(''),
        mobileNumber: new FormControl(''),
        //accommodationType: new FormControl(''),
        nearestLandmark: new FormControl(null)
      }),
    });

    (this.addressForm.get('details') as FormArray).push(individual);
  }

  addNonIndividualFormControls() {
    const nonIndividual = new FormGroup({
      registeredAddress: new FormGroup({
        ...this.getAddressFormControls(),
        mobileNumber: new FormControl(null),
      }),
      communicationAddress: new FormGroup(this.getAddressFormControls()),
    });

    (this.addressForm.get('details') as FormArray).push(nonIndividual);
  }

  get addressValidations() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    return details;
  }

  getAddressDetails() {
    this.address = this.applicantDataService.getApplicant();
    console.log('COMING ADDRES VALUES', this.address);
    this.setAddressData();
  }

  setAddressData() {
    this.isIndividual = this.address.applicantDetails.entityTypeKey === 'INDIVENTTYP';
    // this.clearFormArray();
    this.addressForm.patchValue({
      entity: this.address.applicantDetails.entityTypeKey,
    });
    if (this.isIndividual) {
      // this.addIndividualFormControls();
      this.setValuesForIndividual();
    } else {
      this.clearFormArray();
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
    }
  }

  setAddressValues(address: AddressDetails) {
    if (!address) {
      return;
    }
    const pincode = address.pincode ? Number(address.pincode) : null;
    const city = address.city ? Number(address.city) : null;
    const district = address.district ? Number(address.district) : null;
    const state = address.state ? Number(address.state) : null;
    return {
      pincode,
      city,
      district,
      state,
      country: address.country,
      addressLineOne: address.addressLineOne,
      addressLineTwo: address.addressLineTwo,
      addressLineThree: address.addressLineThree,
      landlineNumber: address.landlineNumber,
      nearestLandmark: address.nearestLandmark
    };
  }

  setValuesForIndividual() {
    const addressObj = this.getAddressObj();
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const permanentAddressObj = addressObj[Constant.PERMANENT_ADDRESS];
    if (permanentAddressObj && permanentAddressObj.isCurrAddSameAsPermAdd == '1') {

      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      const currentAddressVariable = details.get('currentAddress');
      this.onPerAsCurChecked = true;
      currentAddressVariable.get('addressLineOne').disable();
      currentAddressVariable.get('addressLineTwo').disable();
      currentAddressVariable.get('addressLineThree').disable();
      currentAddressVariable.get('pincode').disable();
      currentAddressVariable.get('city').disable();
      currentAddressVariable.get('district').disable();
      currentAddressVariable.get('state').disable();
      currentAddressVariable.get('country').disable();
      currentAddressVariable.get('landlineNumber').disable();
      currentAddressVariable.get('nearestLandmark').disable();
    }


    // console.log('permanentAddressObj', permanentAddressObj);

    if (permanentAddressObj) {
      this.permanantPincode = {
        city: [
          {
            key: permanentAddressObj.city,
            value: permanentAddressObj.cityValue,
          },
        ],
        district: [
          {
            key: permanentAddressObj.district,
            value: permanentAddressObj.districtValue,
          },
        ],
        state: [
          {
            key: permanentAddressObj.state,
            value: permanentAddressObj.stateValue,
          },
        ],
        country: [
          {
            key: permanentAddressObj.country,
            value: permanentAddressObj.countryValue,
          },
        ],
      };
      const permenantAddress = details.get('permanantAddress');
      permenantAddress.patchValue(this.setAddressValues(permanentAddressObj));
    }

    // const valueCheckbox = this.getAddressObj();
    // const isCurAsPer = valueCheckbox[Constant.PERMANENT_ADDRESS];
    // const currentObjReplace = valueCheckbox[Constant.CURRENT_ADDRESS]
    //this.onCurrAsOfficeChecked=currentObjReplace.isCurrAddSameAsPermAdd=='1'? true : false;


    //   const currentAddressObj = isCurAsPer;
    //   this.currentPincode = {
    //     city: [
    //       {
    //         key: currentAddressObj.city,
    //         value: currentAddressObj.cityValue,
    //       },
    //     ],
    //     district: [
    //       {
    //         key: currentAddressObj.district,
    //         value: currentAddressObj.districtValue,
    //       },
    //     ],
    //     state: [
    //       {
    //         key: currentAddressObj.state,
    //         value: currentAddressObj.stateValue,
    //       },
    //     ],
    //     country: [
    //       {
    //         key: currentAddressObj.country,
    //         value: currentAddressObj.countryValue,
    //       },
    //     ],
    //   };
    //   const currentAddress = details.get('currentAddress');
    //   currentAddress.patchValue(this.setAddressValues(currentAddressObj));
    //   //const currentReplaceObj= this.getAddressObj[Constant.CURRENT_ADDRESS]
    //   currentAddress.patchValue({
    //     accommodationType: currentObjReplace.accommodationType || '',
    //     periodOfCurrentStay: currentObjReplace.periodOfCurrentStay,
    //     mobileNumber: currentObjReplace.mobileNumber,
    //   });
    // } else {

    const currentAddressObj =
      addressObj[Constant.CURRENT_ADDRESS] || addressObj['COMMADDADDTYP'];

    if (currentAddressObj.isCurrAddSameAsOffAdd == '1') {
      this.onCurrAsOfficeChecked = true;
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      details.get('officeAddress').disable();

    }


    if (currentAddressObj) {
      this.currentPincode = {
        city: [
          {
            key: currentAddressObj.city,
            value: currentAddressObj.cityValue,
          },
        ],
        district: [
          {
            key: currentAddressObj.district,
            value: currentAddressObj.districtValue,
          },
        ],
        state: [
          {
            key: currentAddressObj.state,
            value: currentAddressObj.stateValue,
          },
        ],
        country: [
          {
            key: currentAddressObj.country,
            value: currentAddressObj.countryValue,
          },
        ],
      };
      const currentAddress = details.get('currentAddress');
      currentAddress.patchValue(this.setAddressValues(currentAddressObj));
      currentAddress.patchValue({
        accommodationType: currentAddressObj.accommodationType || '',
        periodOfCurrentStay: currentAddressObj.periodOfCurrentStay,
        mobileNumber: currentAddressObj.mobileNumber,
      });
    }
    // }

    const officeAddressObj = addressObj[Constant.OFFICE_ADDRESS];
    if (officeAddressObj) {
      this.officePincode = {
        city: [
          {
            key: officeAddressObj.city,
            value: officeAddressObj.cityValue,
          },
        ],
        district: [
          {
            key: officeAddressObj.district,
            value: officeAddressObj.districtValue,
          },
        ],
        state: [
          {
            key: officeAddressObj.state,
            value: officeAddressObj.stateValue,
          },
        ],
        country: [
          {
            key: officeAddressObj.country,
            value: officeAddressObj.countryValue,
          },
        ],
      };
      const officeAddress = details.get('officeAddress');
      officeAddress.patchValue(this.setAddressValues(officeAddressObj));
      officeAddress.patchValue({
        accommodationType: officeAddressObj.accommodationType || '',
        periodOfCurrentStay: officeAddressObj.periodOfCurrentStay,
        mobileNumber: officeAddressObj.mobileNumber,
        nearestLandmark: officeAddressObj.nearestLandmark,

      });
    }
  }

  setValuesForNonIndividual() {
    const addressObj = this.getAddressObj();
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const registeredAddressObj = addressObj[Constant.REGISTER_ADDRESS];
    console.log('resg obj', registeredAddressObj)
    if (registeredAddressObj.isCurrAddSameAsPermAdd == '1') {
      this.onRegAsCommChecked = true;
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      const communicationAddressVariable = details.get('communicationAddress');
      communicationAddressVariable.disable()
    }
    if (registeredAddressObj) {
      this.registeredPincode = {
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

      const registeredAddress = details.get('registeredAddress');
      registeredAddress.patchValue(this.setAddressValues(registeredAddressObj));
      registeredAddress.patchValue({
        mobileNumber: registeredAddressObj.mobileNumber,
      });
    }
    const valueCheckbox = this.getAddressObj();
    const commReplaceObj = valueCheckbox[Constant.COMMUNICATION_ADDRESS]
    if (commReplaceObj) {
      this.communicationPincode = {
        city: [
          {
            key: commReplaceObj.city,
            value: commReplaceObj.cityValue,
          },
        ],
        district: [
          {
            key: commReplaceObj.district,
            value: commReplaceObj.districtValue,
          },
        ],
        state: [
          {
            key: commReplaceObj.state,
            value: commReplaceObj.stateValue,
          },
        ],
        country: [
          {
            key: commReplaceObj.country,
            value: commReplaceObj.countryValue,
          },
        ],
      };
    }
    //     

    const communicationAddress = details.get('communicationAddress');
    communicationAddress.patchValue(
      this.setAddressValues(commReplaceObj)
    );

  }

  getAddressObj() {
    const address = this.address.addressDetails;
    const addressObj = {};
    if (address) {
      address.forEach((value) => {
        if (value.addressType === Constant.PERMANENT_ADDRESS) {
          addressObj[Constant.PERMANENT_ADDRESS] = value;
        } else if (value.addressType === Constant.COMMUNICATION_ADDRESS) {
          addressObj[Constant.COMMUNICATION_ADDRESS] = value;
        } else if (value.addressType === Constant.OFFICE_ADDRESS) {
          addressObj[Constant.OFFICE_ADDRESS] = value;
        } else if (value.addressType === Constant.REGISTER_ADDRESS) {
          addressObj[Constant.REGISTER_ADDRESS] = value;
        } else if (value.addressType === Constant.CURRENT_ADDRESS) {
          addressObj[Constant.CURRENT_ADDRESS] = value;
        }
      });
    }
    return addressObj;
  }

  clearFormArray() {
    const formArray = this.addressForm.get('details') as FormArray;
    formArray.clear();
  }

  isSameAddress(event) {
    const isChecked = event.target.checked;
    console.log('permanantPincode', this.permanantPincode);
    if (isChecked) {
      this.currentPincode = this.permanantPincode;
      //console.log('currentPincode', this.currentPincode);
      this.getPermanentAddressValue();
      this.onPerAsCurChecked = true;
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      details.get('officeAddress').enable();
      this.onCurrAsOfficeChecked = false;
    } else if (!isChecked) {


      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      const currentAddress = details.get('currentAddress');

      currentAddress.get('addressLineOne').enable();
      currentAddress.get('addressLineTwo').enable();
      currentAddress.get('addressLineThree').enable();
      currentAddress.get('pincode').enable();
      currentAddress.get('city').enable();
      currentAddress.get('district').enable();
      currentAddress.get('state').enable();
      currentAddress.get('country').enable();
      currentAddress.get('landlineNumber').enable();
      currentAddress.get('nearestLandmark').enable();

      currentAddress.reset();
      this.onPerAsCurChecked = false;
      this.onCurrAsOfficeChecked = false;
      details.get('officeAddress').enable()
    }


  }

  officeSameAddress(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.officePincode = this.currentPincode;
      this.getCurrentAddressValue();
      this.onCurrAsOfficeChecked = true;
    } else {
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      const officeAddress = details.get('officeAddress');
      officeAddress.enable();
      officeAddress.reset();
      this.onCurrAsOfficeChecked = false;

    }
  }

  onSameRegistered(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.communicationPincode = this.registeredPincode;
      this.getRegisteredAddressValue();
      this.onRegAsCommChecked= true;
    } else if (!isChecked) {
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      this.onRegAsCommChecked= false;
      const communicationAddress = details.get('communicationAddress');

      communicationAddress.get('addressLineOne').enable();
      communicationAddress.get('addressLineTwo').enable();
      communicationAddress.get('addressLineThree').enable();
      communicationAddress.get('pincode').enable();
      communicationAddress.get('city').enable();
      communicationAddress.get('district').enable();
      communicationAddress.get('state').enable();
      communicationAddress.get('country').enable();
      communicationAddress.get('landlineNumber').enable();
      communicationAddress.get('nearestLandmark').enable();

      communicationAddress.reset();
    }

    this.isCurrAddSameAsPermAdd = isChecked === true ? '1' : '0';
  }

  getPermanentAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    const formValue = formArray.at(0).value.permanantAddress;
    //console.log('PERAM VALUE', formValue);
    const details = formArray.at(0);
    const currentAddress = details.get('currentAddress');
    console.log('currentAddress', currentAddress);
    currentAddress.patchValue({
      ...formValue,
    });
    currentAddress.get('addressLineOne').disable();
    currentAddress.get('addressLineTwo').disable();
    currentAddress.get('addressLineThree').disable();
    currentAddress.get('pincode').disable();
    currentAddress.get('city').disable();
    currentAddress.get('district').disable();
    currentAddress.get('state').disable();
    currentAddress.get('country').disable();
    currentAddress.get('landlineNumber').disable();
    currentAddress.get('nearestLandmark').disable();
  }

  getCurrentAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const currentAddressValue = details.get('currentAddress')['controls'];
    console.log('currentAddressValue', currentAddressValue)
    const officeAddress = details.get('officeAddress')
    officeAddress.patchValue({
      addressLineOne: currentAddressValue.addressLineOne.value,
      addressLineTwo: currentAddressValue.addressLineTwo.value,
      addressLineThree: currentAddressValue.addressLineThree.value,
      pincode: currentAddressValue.pincode.value,
      city: currentAddressValue.city.value,
      district: currentAddressValue.district.value,
      state: currentAddressValue.state.value,
      country: currentAddressValue.country.value,
      landlineNumber: currentAddressValue.landlineNumber.value,
      nearestLandmark: currentAddressValue.nearestLandmark.value,
      mobileNumber: currentAddressValue.mobileNumber.value
    });
    officeAddress.disable();

  }

  getRegisteredAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    const formValue = formArray.at(0).value.registeredAddress;
    console.log('REG VALUE', formValue);
    const details = formArray.at(0);
    const communicationAddress = details.get('communicationAddress');
    communicationAddress.patchValue({
      ...formValue,
    });
    communicationAddress.get('addressLineOne').disable();
    communicationAddress.get('addressLineTwo').disable();
    communicationAddress.get('addressLineThree').disable();
    communicationAddress.get('pincode').disable();
    communicationAddress.get('city').disable();
    communicationAddress.get('district').disable();
    communicationAddress.get('state').disable();
    communicationAddress.get('country').disable();
    communicationAddress.get('landlineNumber').disable();
    communicationAddress.get('nearestLandmark').disable();

  }

  hasRoute() {
    this.isSalesOrCredit = this.router.url.includes('sales')
      ? 'sales'
      : 'credit';

    console.log('isSalesOrCredit', this.isSalesOrCredit);
  }

  checkOfficeAddressValidation() {
    if (this.isOfficeAddressMandatory) {
      const formArray = this.addressForm.get('details') as FormArray;
      const officeAddress = formArray.at(0).get('officeAddress');
      const city = officeAddress.get('city').value;
      const state = officeAddress.get('state').value;
      const country = officeAddress.get('country').value;
      const district = officeAddress.get('district').value;
      if (!city || !state || !country || !district) {
        return true;
      }
      return false;
    }
    return false;
  }

  onSubmit() {

    this.isDirty = true;
    console.log('this.addressForm', this.addressForm)
    setTimeout(() => {
      if (this.addressForm.invalid || this.checkOfficeAddressValidation()) {
        this.toasterService.showError(
          'Please fill all mandatory fields.',
          'Applicant Details'
        );
        return;
      }
      const value = this.addressForm.value;
      console.log('value', value)
      if (this.isIndividual) {
        this.storeIndividualValueInService(value);
      } else {
        this.storeNonIndividualValueInService(value);
      }
      // if(this.addressForm.valid){
      const applicantData = this.applicantDataService.getApplicant();
      const data = {
        applicantId: this.applicantId,
        ...applicantData,
        leadId: this.leadId,
      };
      this.applicantService.saveApplicant(data).subscribe((res: any) => {
        if (res.ProcessVariables.error.code !== '0') {
          return;
        }
        const leadId = this.leadStoreService.getLeadId();
        //this.applicantService.saveApplicant(data).subscribe((res) => {
        const currentUrl = this.location.path();
        if (currentUrl.includes('sales')) {
          // this.router.navigate([
          //   `/pages/sales-applicant-details/${this.leadId}/document-upload`,
          //   this.applicantId,
          // ]);
          this.toasterService.showSuccess(
            'Record Saved Successfully',
            ''
          );
        } else {
          this.toasterService.showSuccess(
            'Record Saved Successfully',
            ''
          );
        }

      });
    });
  }

  getAddressFormValues(address: AddressDetails) {
    // return {
    //   ...address,
    //   pincode: 600002,
    //   city: 114100,
    //   state: 40,
    //   country: 'IND',
    //   district: 127,
    // };
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
      addressLineTwo: address.addressLineTwo ? address.addressLineTwo : '',
      addressLineThree: address.addressLineThree ? address.addressLineThree : '',
      country: address.country,
      landlineNumber: address.landlineNumber ? address.landlineNumber : '',
    };
  }

  storeIndividualValueInService(value) {
    this.addressDetailsDataArray = [];
    const applicantDetails: ApplicantDetails = {};
    applicantDetails.entityType = value.entity;
    this.applicantDataService.setApplicantDetails(applicantDetails);
    const permanentAddressObject = value.details[0].permanantAddress;
    console.log('permanant address object', permanentAddressObject);
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(permanentAddressObject),
      addressType: Constant.PERMANENT_ADDRESS,
      isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd || this.onPerAsCurChecked == true ? '1' : '0',
    });
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const officeAddressObject = details.get('officeAddress').value;
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(officeAddressObject),
      addressType: Constant.OFFICE_ADDRESS,
      mobileNumber: officeAddressObject.mobileNumber || '',
      nearestLandmark: officeAddressObject.nearestLandmark || ''
    });
    //const initialCurAsPer= this.onPerAsCurChecked== true? '1' : '0'


    const currentAddressObject = value.details[0].currentAddress;
    const values = details.get('currentAddress')
    const curAddress = {
      pincode: values.get('pincode').value,
      city: values.get('city').value,
      district: values.get('district').value,
      state: values.get('state').value,
      addressLineOne: values.get('addressLineOne').value,
      addressLineTwo: values.get('addressLineTwo').value,
      addressLineThree: values.get('addressLineThree').value,
      country: values.get('country').value,
      landlineNumber: values.get('landlineNumber').value,


    }
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(curAddress),

      mobileNumber: values.get('mobileNumber').value,
      addressType: Constant.CURRENT_ADDRESS,
      accommodationType: currentAddressObject.accommodationType || '',
      isCurrAddSameAsOffAdd: this.onCurrAsOfficeChecked ? '1' : '0',

      periodOfCurrentStay: currentAddressObject.periodOfCurrentStay ? Number(currentAddressObject.periodOfCurrentStay) : null,

    });

    // if(this.isCurrAddSameAsPermAdd  == '1'){
    //   const currentAddressObject = value.details[0].currentAddress;
    // this.addressDetailsDataArray.push({
    //   addressType: Constant.CURRENT_ADDRESS,
    //   accommodationType: currentAddressObject.accommodationType || '',
    //   periodOfCurrentStay: Number(currentAddressObject.periodOfCurrentStay) || null,
    //   mobileNumber: currentAddressObject.mobileNumber || '',

    // });
    // }




    this.applicantDataService.setAddressDetails(this.addressDetailsDataArray);
  }
  storeNonIndividualValueInService(value) {
    const applicantDetails: ApplicantDetails = {};
    applicantDetails.entityType = value.entity;
    this.applicantDataService.setApplicantDetails(applicantDetails);
    const registeredAddressObject = value.details[0].registeredAddress;
    this.addressDetailsDataArray = [];
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(registeredAddressObject),
      addressType: Constant.REGISTER_ADDRESS,
      accommodationType: registeredAddressObject.accommodationType,
      periodOfCurrentStay: Number(registeredAddressObject.periodOfCurrentStay),
      mobileNumber: registeredAddressObject.mobileNumber,
      isCurrAddSameAsPermAdd: this.onRegAsCommChecked ? '1' : '0',
    });
    // const initialCurAsPer = this.onRegAsCommChecked == true ? '1' : '0'
    // if (this.isCurrAddSameAsPermAdd ? this.isCurrAddSameAsPermAdd == '0' : initialCurAsPer == '0') {
      const communicationAddressObject = value.details[0].communicationAddress;
      const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
      const values = details.get('communicationAddress')
      const commAddress={
        pincode: values.get('pincode').value,
      city: values.get('city').value,
      district: values.get('district').value,
      state: values.get('state').value,
      addressLineOne: values.get('addressLineOne').value,
      addressLineTwo: values.get('addressLineTwo').value,
      addressLineThree: values.get('addressLineThree').value,
      country: values.get('country').value,
      landlineNumber: values.get('landlineNumber').value,
      }
      this.addressDetailsDataArray.push({
        ...this.getAddressFormValues(commAddress),
        addressType: Constant.COMMUNICATION_ADDRESS,
      });
    // }
    this.applicantDataService.setAddressDetails(this.addressDetailsDataArray);
  }

  onNext() {
   
    
    const url = this.location.path();
    localStorage.setItem('currentUrl',url);
    if (url.includes('sales')) {
      this.router.navigateByUrl(
        `pages/sales-applicant-details/${this.leadId}/document-upload/${this.applicantId}`
      );
      return;
    }
    this.router.navigateByUrl(
      `/pages/applicant-details/${this.leadId}/bank-list/${this.applicantId}`
    );
  }
}

// onSubmit() {
//   this.isSubmitted = true;
//   if (!this.registrationForm.valid) {
//     return false;
//   } else {
//     alert(JSON.stringify(this.registrationForm.value))
//   }

// }
