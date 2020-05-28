import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { LabelsService } from 'src/app/services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { Router } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { AddressDetails, Applicant } from '@model/applicant.model';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css'],
})
export class AddressDetailsComponent implements OnInit {
  isIndividual = true;
  addressForm: FormGroup;

  dropDownValues: any = [];
  isSalesOrCredit: string;
  LOV: any = [];
  labels: any = {};
  address: Applicant;
  permenantAddressDetails: AddressDetails[];
  currentAddressDetails: AddressDetails[];

  constructor(
    private lovData: LovDataService,
    private labelsData: LabelsService,
    private router: Router,
    private commomLovService: CommomLovService,
    private applicantDataService: ApplicantDataStoreService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.hasRoute();
    this.getAddressDetails();
  }
  initForm() {
    this.addressForm = new FormGroup({
      details: new FormArray([]),
    });
    this.addIndividualFormControls();
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe((data) => {
      this.labels = data;
    });
  }

  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
    console.log('LOV data ---', this.LOV);
  }

  onIndividualChange(event) {
    const value = event.target.value;
    this.isIndividual = value === 'individual';
    const formArray = this.addressForm.get('details') as FormArray;
    formArray.clear();
    this.isIndividual
      ? this.addIndividualFormControls()
      : this.addNonIndividualFormControls();
  }

  addIndividualFormControls() {
    // const controls = new FormGroup({
    // addressLineOne: new FormControl(null),
    // addressLineTwo: new FormControl(null),
    // addressLineThree: new FormControl(null),
    // pincode: new FormControl(null),
    // city: new FormControl(''),
    // district: new FormControl(''),
    // state: new FormControl(''),
    // country: new FormControl(''),
    // landlineNumber: new FormControl(null),
    // currentLine1: new FormControl(null),
    // currentLine2: new FormControl(null),
    // currentLine3: new FormControl(null),
    // currentPinCode: new FormControl(null),
    // currentCity: new FormControl(''),
    // currentDistrict: new FormControl(''),
    // currentState: new FormControl(''),
    // currentCountry: new FormControl(''),
    // currentAccommodation: new FormControl(null),
    // currentMobile: new FormControl(null),
    // currentLandLine: new FormControl(''),
    // officeLine1: new FormControl(null),
    // officeLine2: new FormControl(null),
    // officeLine3: new FormControl(null),
    // officePinCode: new FormControl(null),
    // officeCity: new FormControl(''),
    // officeDistrict: new FormControl(''),
    // officeState: new FormControl(''),
    // officeCountry: new FormControl(''),
    // officeAccommodation: new FormControl(null),
    // officePeriod: new FormControl(null),
    // officeMobile: new FormControl(null),
    // officeLandLine: new FormControl(null),
    // });
    // (this.addressForm.get('details') as FormArray).push(controls);
    const individual = new FormGroup({
      permanantAddress: new FormGroup({
        addressLineOne: new FormControl(null),
        addressLineTwo: new FormControl(null),
        addressLineThree: new FormControl(null),
        pincode: new FormControl(null),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        landlineNumber: new FormControl(null),
      }),
      currentAddress: new FormGroup({
        addressLineOne: new FormControl(null),
        addressLineTwo: new FormControl(null),
        addressLineThree: new FormControl(null),
        pincode: new FormControl(null),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        accommodationType: new FormControl(null),
        mobileNumber: new FormControl(null),
        landlineNumber: new FormControl(''),
        periodOfCurrentStay: new FormControl(''),
      }),
      officeAddress: new FormGroup({
        addressLineOne: new FormControl(null),
        addressLineTwo: new FormControl(null),
        addressLineThree: new FormControl(null),
        pincode: new FormControl(null),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        accommodationType: new FormControl(null),
        periodOfCurrentStay: new FormControl(null),
        mobileNumber: new FormControl(null),
        landlineNumber: new FormControl(null),
      }),
    });

    (this.addressForm.get('details') as FormArray).push(individual);
  }

  addNonIndividualFormControls() {
    // const controls = new FormGroup({
    //     registeredLine1: new FormControl(null),
    //     registeredLine2: new FormControl(null),
    //     registeredLine3: new FormControl(null),
    //     registeredPinCode: new FormControl(null),
    //     registeredCity: new FormControl(null),
    //     registeredDistrict: new FormControl(null),
    //     registeredState: new FormControl(null),
    //     registeredCountry: new FormControl(null),
    //     registeredLandLine: new FormControl(null),
    //     registeredMobile: new FormControl(null),
    //     communicationLine1: new FormControl(null),
    //     communicationLine2: new FormControl(null),
    //     communicationLine3: new FormControl(null),
    //     communicationPinCode: new FormControl(null),
    //     communicationCity: new FormControl(null),
    //     communicationDistrict: new FormControl(null),
    //     communicationState: new FormControl(null),
    //     communicationCountry: new FormControl(null),
    //     communicationLandLine: new FormControl(null),

    // });
    const nonIndividual = new FormGroup({
      registeredAddress: new FormGroup({
        addressLineOne: new FormControl(null),
        addressLineTwo: new FormControl(null),
        addressLineThree: new FormControl(null),
        pincode: new FormControl(null),
        city: new FormControl(null),
        district: new FormControl(null),
        state: new FormControl(null),
        country: new FormControl(null),
        landlineNumber: new FormControl(null),
        mobileNumber: new FormControl(null),
      }),
      communicationAddress: new FormGroup({
        addressLineOne: new FormControl(null),
        addressLineTwo: new FormControl(null),
        addressLineThree: new FormControl(null),
        pincode: new FormControl(null),
        city: new FormControl(''),
        district: new FormControl(''),
        state: new FormControl(''),
        country: new FormControl(''),
        landlineNumber: new FormControl(null),
      }),
    });

    (this.addressForm.get('details') as FormArray).push(nonIndividual);
  }

  getAddressDetails() {
    this.address = this.applicantDataService.getApplicant();
    console.log('addressDetailsservice--', this.address);
    this.setAddressData();
  }

  setAddressData() {
    this.isIndividual = this.address.applicantDetails.entity === 'Individual';

    if (this.isIndividual) {
      this.addIndividualFormControls();
      this.setValuesForIndividual();
    } else {
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
    }
  }

  setValuesForIndividual() {
    const permenantAddress = this.address.addressDetails[0];
    console.log('permamantAddress---', permenantAddress);
    const formArray = this.addressForm.get('details') as FormArray;

    const details = formArray.at(0);

    const currentAddress = details.get('permanantAddress');
    currentAddress.patchValue({
      addressLineOne: permenantAddress.addressLineOne,
      addressLineTwo: permenantAddress.addressLineTwo,
      addressLineThree: permenantAddress.addressLineThree,
      pincode: permenantAddress.pincode,
      city: permenantAddress.city,
      district: permenantAddress.district,
      state: permenantAddress.state,
      country: permenantAddress.country,
      landlineNumber: permenantAddress.landlineNumber,
    });
    console.log('details', details);
  }

  setValuesForNonIndividual() {
    const communicationAddress = this.address.addressDetails[1];
    const formArray = this.addressForm.get('details') as FormArray;

    const details = formArray.at(0);
    details.patchValue({
      addressLineOne: communicationAddress.addressLineOne,
      addressLineTwo: communicationAddress.addressLineTwo,
      addressLineThree: communicationAddress.addressLineThree,
      pincode: communicationAddress.pincode,
      city: communicationAddress.city,
      district: communicationAddress.district,
      state: communicationAddress.state,
      country: communicationAddress.country,
      landlineNumber: communicationAddress.landlineNumber,
    });
  }

  isSameAddress(event) {
    const isChecked = event.target.checked;
    console.log('event', isChecked);
    this.getPermanentAddressValue();
  }
  onSameRegistered(event) {
    const isChecked = event.target.checked;
    this.getRegisteredAddressValue();
  }

  getPermanentAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    console.log('formArray', formArray);
    const formValue = formArray.at(0).value.permanantAddress;
    console.log('formValue', formValue);
    const details = formArray.at(0);
    const currentAddress = details.get('currentAddress');
    currentAddress.patchValue({
      addressLineOne: formValue.addressLineOne,
      addressLineTwo: formValue.addressLineTwo,
      addressLineThree: formValue.addressLineThree,
      pincode: formValue.pincode,
      city: formValue.city,
      district: formValue.district,
      state: formValue.state,
      country: formValue.country,
      landlineNumber: formValue.landlineNumber,
    });
    // const currentLine1 = formValue.address1;
    // const currentLine2 = formValue.address2;
    // const currentLine3 = formValue.address3;
    // const currentPinCode = formValue.pinCode;
    // const currentCity = formValue.city;
    // const currentDistrict = formValue.district;
    // const currentState = formValue.state;
    // const currentCountry = formValue.country;
    // const currentLandLine = formValue.landLine;
    // formArray.at(0).patchValue({
    //   currentLine1,
    //   currentLine2,
    //   currentLine3,
    //   currentPinCode,
    //   currentCity,
    //   currentDistrict,
    //   currentState,
    //   currentCountry,
    //   currentLandLine

    // });
  }

  getRegisteredAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    console.log('formArray', formArray);
    const formValue = formArray.at(0).value.registeredAddress;
    console.log('formValue', formValue);
    const details = formArray.at(0);
    const communicationAddress = details.get('communicationAddress');
    communicationAddress.patchValue({
      addressLineOne: formValue.addressLineOne,
      addressLineTwo: formValue.addressLineTwo,
      addressLineThree: formValue.addressLineThree,
      pincode: formValue.pincode,
      city: formValue.city,
      district: formValue.district,
      state: formValue.state,
      country: formValue.country,
      landlineNumber: formValue.landlineNumber,
    });
    // const formArray = this.addressForm.get('details') as FormArray;
    // console.log('formArray', formArray)
    // const formValue = formArray.at(0).value;
    // console.log('formValue', formValue);
    // const communicationLine1 = formValue.registeredLine1
    // const communicationLine2 = formValue.registeredLine2
    // const communicationLine3 = formValue.registeredLine3
    // const communicationCity = formValue.registeredCity
    // const communicationDistrict = formValue.registeredCountry
    // const communicationState = formValue.registeredState
    // const communicationCountry = formValue.registeredCountry
    // const communicationLandLine = formValue.registeredLandLine
    // const communicationPinCode = formValue.registeredPinCode

    // formArray.at(0).patchValue({
    //   communicationLine1,
    //   communicationLine2,
    //   communicationLine3,
    //   communicationCity,
    //   communicationDistrict,
    //   communicationState,
    //   communicationCountry,
    //   communicationLandLine,
    //   communicationPinCode

    // })
  }

  hasRoute() {
    this.isSalesOrCredit = this.router.url.includes(
      'pages/applicant-details/address-details'
    )
      ? 'credit'
      : 'sales';
  }

  onSubmit() {
    const formValue = this.addressForm.value;
    console.log('addressValue---', formValue);

    const addressModel = { ...formValue };
    console.log('addressmodel', addressModel);

    this.permenantAddressDetails = [
      {
        addressLineOne: addressModel.details[0].permanantAddress.addressLineOne,
        addressLineTwo: addressModel.details[0].permanantAddress.addressLineTwo,
        addressLineThree:
          addressModel.details[0].permanantAddress.addressLineThree,
        pincode: addressModel.details[0].permanantAddress.pincode,
        city: addressModel.details[0].permanantAddress.city,
        district: addressModel.details[0].permanantAddress.district,
        state: addressModel.details[0].permanantAddress.state,
        country: addressModel.details[0].permanantAddress.country,
        landlineNumber: addressModel.details[0].permanantAddress.landlineNumber,
      },
    ];

    console.log('api-permenantaddressDetails', this.permenantAddressDetails);
    console.log('api-currentaddressDetails', this.currentAddressDetails);
  }
}
