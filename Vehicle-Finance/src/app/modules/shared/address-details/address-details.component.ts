import { Component, OnInit, HostListener } from '@angular/core';
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
import { ToggleDdeService } from '@services/toggle-dde.service';
import { AgmFitBounds } from '@agm/core';
import { ObjectComparisonService } from '@services/obj-compare.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css'],
})
export class AddressDetailsComponent implements OnInit {
  disableSaveBtn: boolean;
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
  showModCurrCheckBox: boolean;
  showSrField: boolean;

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
  isCurrAddSameAsOffAdd: any;
  isRegSameAsCommAdd: any;
  permenantAddressDetails: AddressDetails[];
  currentAddressDetails: AddressDetails[];
  onPerAsCurChecked: boolean;
  onRegAsCommChecked: boolean;
  onCurrAsOfficeChecked: boolean;
  addressObj: any;

  isOfficeAddressMandatory: boolean;
  checkedModifyCurrent: boolean;
  disableCurrent: boolean;
  disableRegister: boolean;
  SRNumberValidate: boolean = true;
  showAppAddressCheckBox: boolean = false;
  sameAsAppAddress: boolean = false;
  disableSameAppAddress: boolean = false;
  leadAppAddressDetails = [];
  isSave: boolean = false;
  successSR: boolean = false;
  failureSR: boolean = false;
  validateSrBoolean: boolean;
  successSrValue: string;
  storeSRNumber: any;
  apiValue: any;
  finalValue: any;
  apiCurrentCheckBox = '0';
  apiOfficeCheckBox = '0';
  apiAddressLead = '0';
  apiCommunicationCheckBox = '0';


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
    private toasterService: ToasterService,
    private toggleDdeService: ToggleDdeService,
    private objectComparisonService: ObjectComparisonService
  ) { }

  async ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.hasRoute();
    this.leadId = (await this.getLeadId()) as number;

    this.lovData.getLovData().subscribe((res: any) => {
      this.values = res[0].addApplicant[0];
      this.listenerForOfficeAddress();
      this.activatedRoute.params.subscribe((value) => {
        if (!value && !value.applicantId) {
          return;
        }
        this.applicantId = Number(value.applicantId);
        this.getAddressDetails();
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
    const pobox = officeAddress.get('pobox');
    this.addressCommonListener(addressLineOne);
    this.addressCommonListener(addressLineTwo);
    this.addressCommonListener(addressLineThree);
    this.addressCommonListener(pincode);
    this.addressCommonListener(landlineNumber);
    this.addressCommonListener(mobileNumber);
    this.addressCommonListener(nearestLandmark);
    this.addressCommonListener(pobox);
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
        const pincode = officeAddress.get('pincode').value;
        const addressLineOne = officeAddress.get('addressLineOne').value;
        officeAddress.patchValue({
          pincode : pincode || null,
          addressLineOne : addressLineOne || null
        })
        // const pincode = officeAddress.get('pincode').value;
        // officeAddress.get('pincode').setValue(pincode || null)
        // const addressLineOne = officeAddress.get('addressLineOne').value;
        // officeAddress.get('addressLineOne').setValue(addressLineOne || null)

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
          if (value.Error !== '0') {
            return null;
          }
          if (!addressList) {
            this.toasterService.showError('Invalid pincode', '');
            if (id == 'permanantPincode') {
              this.setNullValues('permanantAddress');
              this.permanantPincode = {}
            }
            if (id == 'currentPincode') {
              this.setNullValues('currentAddress');
              this.currentPincode = {}
            }
            if (id == 'officePincode') {
              this.setNullValues('officeAddress');
              this.communicationPincode = {}
            }
            if (id == 'registeredPincode') {
              this.setNullValues('registeredAddress');
              this.registeredPincode = {}
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

  setNullValues(control) {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get(control).patchValue({
      state: null || '',
      country: null || '',
      district: null || '',
      city: null || ''
    })
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
      srNumber: new FormControl(''),
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
        nearestLandmark: new FormControl(''),
        pobox: new FormControl('')
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
      communicationAddress: new FormGroup({
        ...this.getAddressFormControls(),
        pobox: new FormControl('')
      }),
    });

    (this.addressForm.get('details') as FormArray).push(nonIndividual);
  }

  get addressValidations() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    return details;
  }

  getAddressDetails() {
    const data = {
      applicantId: this.applicantId,
    };
    this.applicantService.getApplicantDetail(data).subscribe((res: any) => {
      this.address = res.ProcessVariables;

      if (this.address.ucic) { 
          this.showModCurrCheckBox = true;
      }
      

      setTimeout(() => {
        this.setAddressData();
      })


    })

    //console.log('COMING ADDRES VALUES', this.address);

  }

  disableAddress(addressType) {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get(addressType).disable();
  }


  setAddressData() {
    this.isIndividual = this.address.applicantDetails.entityTypeKey === 'INDIVENTTYP';
    this.showAppAddressCheckBox = this.address.applicantDetails.applicantTypeKey === "APPAPPRELLEAD"
    this.addressForm.patchValue({
      entity: this.address.applicantDetails.entityTypeKey,
    });
    if (this.isIndividual) {
      if (this.address.ucic) {

        this.disableCurrent = true;
        this.onPerAsCurChecked = true;
        this.isCurrAddSameAsPermAdd = '1'

        this.disableSameAppAddress = true;
        this.disableAddress('permanantAddress');
        this.disableAddress('currentAddress');
      }
      if (this.address.ekycDone == '1') {
        if (this.address.applicantDetails.entityTypeKey === 'INDIVENTTYP') {
          this.disableAddress('permanantAddress');
          this.disableSameAppAddress = true;

        }
      }

      this.setValuesForIndividual();
      setTimeout(() => {
        this.listenerForPermenantAddress();
        this.listenerForCurrentAddress();

      })
    } else {
      this.clearFormArray();
      this.addNonIndividualFormControls();
      this.disableRegister = true;
      this.onRegAsCommChecked = true;
      this.disableAddress('registeredAddress');
      this.disableAddress('communicationAddress');
      this.setValuesForNonIndividual();
      setTimeout(() => {
        this.listenerForRegisterAddress();
      })
    }
    this.apiValue = this.addressForm.getRawValue();
    setTimeout(() => {
      const operationType = this.toggleDdeService.getOperationType();
      if (operationType) {
        this.addressForm.disable();
        this.disableSaveBtn = true;
      }
    })
  }

  listenerForPermenantAddress() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const permanatAddress = details.get('permanantAddress');
    const currentAddress = details.get('currentAddress');

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
  listenerForCurrentAddress() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const currentAddress = details.get('currentAddress');
    const officeAddress = details.get('officeAddress');

    const currAddressLineOne = currentAddress.get('addressLineOne');
    const currAddressLineTwo = currentAddress.get('addressLineTwo');
    const currAddressLineThree = currentAddress.get('addressLineThree');
    const currPincode = currentAddress.get('pincode');
    const currLandmark = currentAddress.get('nearestLandmark');
    const currLandlineNumber = currentAddress.get('landlineNumber');
    const currMobileNumber = currentAddress.get('mobileNumber');


    const ofcAddressLineOne = officeAddress.get('addressLineOne');
    const ofcAddressLineTwo = officeAddress.get('addressLineTwo');
    const ofcAddressLineThree = officeAddress.get('addressLineThree');
    const ofcPincode = officeAddress.get('pincode');
    const ofcLandmark = officeAddress.get('nearestLandmark');
    const ofcLandlineNumber = officeAddress.get('landlineNumber');
    const ofcMobileNumber = officeAddress.get('mobileNumber');

    this.addlistenerForCurrOfc(currAddressLineOne, ofcAddressLineOne);
    this.addlistenerForCurrOfc(currAddressLineTwo, ofcAddressLineTwo);
    this.addlistenerForCurrOfc(currAddressLineThree, ofcAddressLineThree);
    this.addlistenerForCurrOfc(currPincode, ofcPincode);
    this.addlistenerForCurrOfc(currLandmark, ofcLandmark);
    this.addlistenerForCurrOfc(currLandlineNumber, ofcLandlineNumber);
    this.addlistenerForCurrOfc(currMobileNumber, ofcMobileNumber);

  }

  listenerForRegisterAddress() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const registerAddress = details.get('registeredAddress');
    const communicationAddress = details.get('communicationAddress');

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

      if (this.isIndividual) {
        if (this.isCurrAddSameAsPermAdd == '1' && this.onPerAsCurChecked) {
          subControl.setValue(value || null)
        }

      } else {
        if (this.isRegSameAsCommAdd == '1' && this.onRegAsCommChecked) {
          subControl.setValue(value || null)
        }
      }
    })

  }

  addlistenerForCurrOfc(mainControl, subControl) {
    mainControl.valueChanges.subscribe((value) => {
      if (this.isCurrAddSameAsOffAdd == '1' && this.onCurrAsOfficeChecked) {
        subControl.setValue(value || null)
      }
    })
  }

  cityChange(event) {
    const value = event.target.value;
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    if (this.isIndividual) {
      if (this.isCurrAddSameAsPermAdd == '1' && this.onPerAsCurChecked) {
        const formValue: AddressDetails = details.get('permanantAddress').value;
        const currentAddress = details.get('currentAddress');
        this.currentPincode = this.permanantPincode;
        currentAddress.patchValue({
          ...formValue,
        });
        if (this.isCurrAddSameAsOffAdd == '1' && this.onCurrAsOfficeChecked) {
          const ofcFormValue: AddressDetails = details.get('permanantAddress').value;
          const officeAddress = details.get('officeAddress');
          this.officePincode = this.permanantPincode;
          officeAddress.patchValue({
            ...ofcFormValue,
          });
        }
      }
    } else {
      if (this.isRegSameAsCommAdd == '1' && this.onRegAsCommChecked) {
        const formValue: AddressDetails = details.get('registeredAddress').value;
        const communicationAddress = details.get('communicationAddress');
        this.communicationPincode = this.registeredPincode;
        communicationAddress.patchValue({
          ...formValue,
        });
      }
    }

  }



  currentCityChange(event) {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    if (this.isCurrAddSameAsOffAdd == '1' && this.onCurrAsOfficeChecked) {
      const formValue: AddressDetails = details.get('currentAddress').value;
      const officeAddress = details.get('officeAddress');
      this.officePincode = this.currentPincode;
      officeAddress.patchValue({
        ...formValue
      });
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
      nearestLandmark: address.nearestLandmark,
      pobox: address.pobox
    };
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


  setValuesForIndividual() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const modifyCurrentAdd = this.address.applicantDetails.modifyCurrentAddress;
    this.checkedModifyCurrent = modifyCurrentAdd == '1' ? true : false;
    this.showSrField = modifyCurrentAdd == '1' ? true : false;
    if(modifyCurrentAdd == '1'){
      this.disableCurrent=false
    }
    //this.disableCurrent = modifyCurrentAdd == '1' ? false : true;

    const srNumber = this.address.applicantDetails.srNumber;
    details.get('srNumber').setValue(srNumber)

    const sameAppAddress = this.address.applicantDetails.isAddrSameAsApplicant
    this.apiAddressLead = sameAppAddress;

    this.sameAsAppAddress = sameAppAddress == '1' ? true : false;
    if (this.sameAsAppAddress) {
      this.disableCurrent = true
    }
    //this.sameAsAppAddress ? this.disableCurrent= true:  this.disableCurrent= false;

    if (this.sameAsAppAddress && this.isSalesOrCredit == "credit") {
      this.disableSameAppAddress = true;
    }
    this.successSrValue = this.address.applicantDetails.srNumber;
    this.validateSrBoolean = this.storeSRNumber ? true : false;

    const addressObj = this.getAddressObj();
    const permanentAddressObj = addressObj[Constant.PERMANENT_ADDRESS];
    const currentAddressVariable = details.get('currentAddress');
    this.apiCurrentCheckBox = (permanentAddressObj && permanentAddressObj.isCurrAddSameAsPermAdd == '1') ? '1' : '0'
    if (permanentAddressObj && permanentAddressObj.isCurrAddSameAsPermAdd == '1') {

      this.isCurrAddSameAsPermAdd = '1';
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
    } else {
      this.onPerAsCurChecked = false;
      this.isCurrAddSameAsPermAdd = '0';
      if (this.address.ucic) {
        this.disableCurrent = true;
        currentAddressVariable.disable();
      } else {
        currentAddressVariable.enable();
      }

    }


    if (permanentAddressObj) {
      this.permanantPincode = this.formatPincodeData(permanentAddressObj)

      const permenantAddress = details.get('permanantAddress');
      this.sameAsAppAddress ? permenantAddress.disable() : null;
      permenantAddress.patchValue(this.setAddressValues(permanentAddressObj));
    }


    const currentAddressObj =
      addressObj[Constant.CURRENT_ADDRESS] || addressObj['COMMADDADDTYP'];
    this.apiOfficeCheckBox = (currentAddressObj && currentAddressObj.isCurrAddSameAsOffAdd == '1') ? '1' : '0'

    if (currentAddressObj && currentAddressObj.isCurrAddSameAsOffAdd == '1') {
      this.isCurrAddSameAsOffAdd = "1"
      this.onCurrAsOfficeChecked = true;
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      details.get('officeAddress').disable();
      details.get('officeAddress').get('pobox').enable();

    }
    else {
      this.isCurrAddSameAsOffAdd = "0";
      this.onCurrAsOfficeChecked = false;

    }


    if (currentAddressObj) {
      this.currentPincode = this.formatPincodeData(currentAddressObj)
      const currentAddress = details.get('currentAddress');
      if (this.sameAsAppAddress) {
        currentAddress.disable()
      }
      //this.sameAsAppAddress? currentAddress.disable(): currentAddress.enable()
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
      this.officePincode = this.formatPincodeData(officeAddressObj)

      const officeAddress = details.get('officeAddress');
      officeAddress.patchValue(this.setAddressValues(officeAddressObj));
      officeAddress.patchValue({
        accommodationType: officeAddressObj.accommodationType || '',
        periodOfCurrentStay: officeAddressObj.periodOfCurrentStay,
        mobileNumber: officeAddressObj.mobileNumber,
        nearestLandmark: officeAddressObj.nearestLandmark,
        pobox: officeAddressObj.pobox

      });
    }
  }

  setValuesForNonIndividual() {
    const addressObj = this.getAddressObj();
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const registeredAddressObj = addressObj[Constant.REGISTER_ADDRESS];
    this.apiCommunicationCheckBox = (registeredAddressObj && registeredAddressObj.isCurrAddSameAsPermAdd == '1') ? '1' : '0'
    if (registeredAddressObj&& registeredAddressObj.isCurrAddSameAsPermAdd == '1') {
      this.isRegSameAsCommAdd = '1'
      this.onRegAsCommChecked = true;
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      const communicationAddressVariable = details.get('communicationAddress');
      communicationAddressVariable.disable();
      communicationAddressVariable.get('pobox').enable();

    } else {
      this.isRegSameAsCommAdd = '0'
      this.onRegAsCommChecked = false;
    }
    if (registeredAddressObj) {
      this.registeredPincode = this.formatPincodeData(registeredAddressObj)
      const registeredAddress = details.get('registeredAddress');
      registeredAddress.patchValue(this.setAddressValues(registeredAddressObj));
      registeredAddress.patchValue({
        mobileNumber: registeredAddressObj.mobileNumber,
        nearestLandmark: registeredAddressObj.nearestLandmark

      });
    }
    const valueCheckbox = this.getAddressObj();
    const commReplaceObj = valueCheckbox[Constant.COMMUNICATION_ADDRESS]
    if (commReplaceObj) {
      this.communicationPincode = this.formatPincodeData(commReplaceObj)
    }
    //     

    const communicationAddress = details.get('communicationAddress');
    communicationAddress.patchValue(
      this.setAddressValues(commReplaceObj),

    );
    communicationAddress.patchValue({
      pobox: commReplaceObj.pobox,
      nearestLandmark: commReplaceObj.nearestLandmark
    });

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

  onAddSameAsApplicant(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.sameAsAppAddress = true;
      const data = {
        leadId: this.leadId
      }
      this.applicantService.getAddressDetails(data).subscribe((res) => {
        if (res['ProcessVariables'].error.code == '0') {
          this.leadAppAddressDetails = res['ProcessVariables'].addressDetails;
          if (this.leadAppAddressDetails !== null) {
            this.setLeadAppAddressDetails();
          } else {
            this.toasterService.showInfo(
              'There is no main applicant address datas', ''
            );
            this.sameAsAppAddress = false;
          }
        } else {
          this.toasterService.showError(
            res['ProcessVariables'].error.message,
            'Address Details'
          );
        }
      })
    } else if (!isChecked) {
      this.sameAsAppAddress = false;
      this.disableCurrent = false;
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      details.get('permanantAddress').enable();
      details.get('currentAddress').enable();
      details.get('permanantAddress').reset();
      details.get('currentAddress').reset();
      if (this.onCurrAsOfficeChecked) {
        this.onCurrAsOfficeChecked = false;
        this.isCurrAddSameAsOffAdd='0'
        details.get('officeAddress').enable();
      }
    }
  }
  getLeadAddress() {
    const address = this.leadAppAddressDetails;
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

  @HostListener('change') ngOnChanges($event) {
    this.isSave = false;
  }

  @HostListener('keydown', ['$event'])

  onkeyup(event) {
    this.isSave = false;
  }


  setLeadAppAddressDetails() {
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const permentAddress = details.get('permanantAddress');
    const currentAddress = details.get('currentAddress');
    const addressObj = this.getLeadAddress();

    const permenantAddressObj = addressObj[Constant.PERMANENT_ADDRESS];
    this.permanantPincode = this.formatPincodeData(permenantAddressObj);
    if (!!this.setAddressValues(permenantAddressObj)) {
      permentAddress.patchValue(
        this.setAddressValues(permenantAddressObj)
      );
    }
    const currentAddressObj = addressObj[Constant.CURRENT_ADDRESS];
    this.currentPincode = this.formatPincodeData(currentAddressObj);
    if (!!this.setAddressValues(currentAddressObj)) {
      currentAddress.patchValue(
        this.setAddressValues(currentAddressObj)
      );
    }
    this.disableCurrent = true;
    this.onPerAsCurChecked = false;
    this.isCurrAddSameAsPermAdd = '0'
    permentAddress.disable();
    currentAddress.disable();

  }

  clearFormArray() {
    const formArray = this.addressForm.get('details') as FormArray;
    formArray.clear();
  }

  isSameAddress(event) {
    const isChecked = event.target.checked;
    this.isCurrAddSameAsPermAdd = isChecked ? '1' : '0';
    if (isChecked) {
      this.currentPincode = this.permanantPincode;
      this.getPermanentAddressValue();
      this.onPerAsCurChecked = true;
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      if (this.onCurrAsOfficeChecked) {
        details.get('officeAddress').reset();
        details.get('officeAddress').enable();
        this.onCurrAsOfficeChecked = false;
        this.isCurrAddSameAsOffAdd = '0'
      }

    } else if (!isChecked) {
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      const currentAddress = details.get('currentAddress');

      currentAddress.enable();

      currentAddress.reset();
      // this.onPerAsCurChecked = false;

      if (this.onCurrAsOfficeChecked) {
        this.onCurrAsOfficeChecked = false;
        this.isCurrAddSameAsOffAdd = '0'
        details.get('officeAddress').enable();
        details.get('officeAddress').reset();


      }

    }


  }

  officeSameAddress(event) {
    const isChecked = event.target.checked;
    this.isCurrAddSameAsOffAdd = isChecked ? '1' : '0';
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
    this.isRegSameAsCommAdd = isChecked ? '1' : '0';
    if (isChecked) {
      this.communicationPincode = this.registeredPincode;
      this.getRegisteredAddressValue();
      this.onRegAsCommChecked = true;
    } else if (!isChecked) {
      const formArray = this.addressForm.get('details') as FormArray;
      const details = formArray.at(0);
      this.onRegAsCommChecked = false;
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

    //this.isCurrAddSameAsPermAdd = isChecked === true ? '1' : '0';
  }

  getPermanentAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    const formValue = formArray.at(0).get('permanantAddress').value;
    const details = formArray.at(0);
    const currentAddress = details.get('currentAddress');
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
    officeAddress.get('pobox').enable();

  }

  getRegisteredAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    const formValue = formArray.at(0).value.registeredAddress;
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

  onModCurrAddress(event) {
    const eventClicked = event.target.checked;
    const formArray = this.addressForm.get('details') as FormArray;
    const control = formArray.at(0);
    if (eventClicked) {
      this.showSrField = true;
      this.checkedModifyCurrent = true;

      control.get('srNumber').setValidators([Validators.required]);
      control.get('srNumber').updateValueAndValidity();
      control.get('currentAddress').enable();
      this.onPerAsCurChecked = false;
      this.isCurrAddSameAsPermAdd = '0'
      this.disableCurrent = false;
      if (this.onCurrAsOfficeChecked) {
        this.onCurrAsOfficeChecked = false;
        this.isCurrAddSameAsOffAdd='0'
        control.get('officeAddress').enable();
        control.get('officeAddress').reset();


      }


    } else {
      this.showSrField = false;
      this.checkedModifyCurrent = false;

      control.get('srNumber').clearValidators();
      control.get('srNumber').updateValueAndValidity();
      control.get('srNumber').setValue(null)
      control.get('currentAddress').disable();
      this.onPerAsCurChecked = true;
      this.isCurrAddSameAsPermAdd = '1'
      this.disableCurrent = true;
      this.SRNumberValidate = true;

    }
  }

  hasRoute() {
    this.isSalesOrCredit = this.router.url.includes('sales')
      ? 'sales'
      : 'credit';

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

  validateSrNumber(event) {
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
        this.SRNumberValidate = !this.validateSrBoolean ? true : false;

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

  onSubmit() {

    this.isDirty = true;
    setTimeout(() => {
      if (this.addressForm.invalid || this.checkOfficeAddressValidation()
        || !this.SRNumberValidate) {
        this.toasterService.showError(
          'Please fill all mandatory fields.',
          'Applicant Details'
        );
        return;
      }
      const value = this.addressForm.value;
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
          this.toasterService.showError(
            res.ProcessVariables.error.message,
            'Address Details'
          );
          return;
        }

        this.toasterService.showSuccess(
          'Record Saved Successfully',
          ''
        );
        this.apiValue = this.addressForm.getRawValue();
        if (this.isIndividual) {
          this.apiAddressLead = this.sameAsAppAddress ? '1' : '0'
          this.apiCurrentCheckBox = this.isCurrAddSameAsPermAdd
          this.apiOfficeCheckBox = this.isCurrAddSameAsOffAdd
        } else {
          this.apiCommunicationCheckBox = this.isRegSameAsCommAdd
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
    applicantDetails.modifyCurrentAddress = this.checkedModifyCurrent == true ? '1' : '0';
    applicantDetails.srNumber = value.details[0].srNumber;
    this.applicantDataService.setApplicantDetails(applicantDetails);

    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);

    const permanantData = details.get('permanantAddress')
    const perAddress = {
      ...this.getAddressValues(permanantData)
    }
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(perAddress),
      addressType: Constant.PERMANENT_ADDRESS,
      nearestLandmark: permanantData.get('nearestLandmark').value,
      isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
    });

    const officeData = details.get('officeAddress');
    const offAddress = {
      ...this.getAddressValues(officeData)
    }
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(offAddress),
      addressType: Constant.OFFICE_ADDRESS,
      mobileNumber: officeData.get('mobileNumber').value || '',
      nearestLandmark: officeData.get('nearestLandmark').value || '',
      pobox: officeData.get('pobox').value || ''
    });
    //const initialCurAsPer= this.onPerAsCurChecked== true? '1' : '0'

    const currentData = details.get('currentAddress')
    const curAddress = {
      ...this.getAddressValues(currentData)
    }
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(curAddress),

      mobileNumber: currentData.get('mobileNumber').value,
      addressType: Constant.CURRENT_ADDRESS,
      accommodationType: currentData.get('accommodationType').value || '',
      isCurrAddSameAsOffAdd: this.isCurrAddSameAsOffAdd,
      nearestLandmark: currentData.get('nearestLandmark').value,

      periodOfCurrentStay: Number(currentData.get('periodOfCurrentStay').value) || null,

    });
    const data = {
      isAddrSameAsApplicant: this.sameAsAppAddress ? '1' : '0'
    }
    this.applicantDataService.setApplicantDetails(data);
    this.applicantDataService.setAddressDetails(this.addressDetailsDataArray);
  }

  getAddressValues(values) {
    return {
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
  }


  storeNonIndividualValueInService(value) {
    const applicantDetails: ApplicantDetails = {};
    applicantDetails.entityType = value.entity;
    this.applicantDataService.setApplicantDetails(applicantDetails);
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    //const registeredAddressObject = value.details[0].registeredAddress;
    const registeredData = details.get('registeredAddress');
    const regAddress = {
      ...this.getAddressValues(registeredData)
    }
    this.addressDetailsDataArray = [];
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(regAddress),
      addressType: Constant.REGISTER_ADDRESS,
      // accommodationType: registeredData.get('accommodationType').value,
      // periodOfCurrentStay: Number(registeredData.get('periodOfCurrentStay').value),
      mobileNumber: registeredData.get('mobileNumber').value,
      nearestLandmark: registeredData.get('nearestLandmark').value,
      isCurrAddSameAsPermAdd: this.isRegSameAsCommAdd,
    });

    const communicationData = details.get('communicationAddress')
    const commAddress = {
      ...this.getAddressValues(communicationData)
    }
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(commAddress),
      nearestLandmark: communicationData.get('nearestLandmark').value,
      addressType: Constant.COMMUNICATION_ADDRESS,
      pobox: communicationData.get('pobox').value
    });
    // }

    this.applicantDataService.setAddressDetails(this.addressDetailsDataArray);
  }

  onNext() {
    this.finalValue = this.addressForm.getRawValue();
    const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue)
    console.log(JSON.stringify(this.apiValue));
    console.log(JSON.stringify(this.finalValue));
    console.log(this.objectComparisonService.compare(this.apiValue, this.finalValue));
    let isCheckBoxValue: boolean;
    const addressLeadCheckBox = this.sameAsAppAddress ? '1' : '0'
    if (this.isIndividual) {
      if (addressLeadCheckBox !== this.apiAddressLead ||
        this.isCurrAddSameAsPermAdd !== this.apiCurrentCheckBox ||
        this.isCurrAddSameAsOffAdd !== this.apiOfficeCheckBox) {
        isCheckBoxValue = false;
        console.log('checkBox False')
      } else {
        isCheckBoxValue = true;
        console.log('checkBox True')
      }
    } else {
      if (
        this.isRegSameAsCommAdd !== this.apiCommunicationCheckBox) {
        isCheckBoxValue = false;
        console.log('checkBox False')
      } else {
        isCheckBoxValue = true;
        console.log('checkBox True')
      }
    }



    if (this.addressForm.invalid) {
      this.toasterService.showInfo('Please SAVE details before proceeding', '');
      return;
    }
    if (!isValueCheck || !isCheckBoxValue) {
      this.toasterService.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
      return;
    }
    const url = this.location.path();
    localStorage.setItem('currentUrl', url);
    if (url.includes('sales')) {
      this.router.navigateByUrl(
        `pages/sales-applicant-details/${this.leadId}/document-upload/${this.applicantId}`
      );

    } else {
      this.router.navigateByUrl(
        `/pages/applicant-details/${this.leadId}/bank-list/${this.applicantId}`
      );
    }


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
