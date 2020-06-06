import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
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
  address: Applicant;
  applicantId: number;
  leadId: number;

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

  isCurrAddSameAsPermAdd: any = '0';
  permenantAddressDetails: AddressDetails[];
  currentAddressDetails: AddressDetails[];

  constructor(
    private lovData: LovDataService,
    private labelsData: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commomLovService: CommomLovService,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private leadStoreService: LeadStoreService,
    private location: Location
  ) {}

  onBack() {
    this.location.back();
  }

  navigateToApplicantList() {
    this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
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
          if (value.Error !== '0') {
            return null;
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
        if (id == 'permanantPincode') {
          this.permanantPincode = value;
          return;
        }
        if (id == 'currentPincode') {
          this.currentPincode = value;
          return;
        }
        if (id == 'officePincode') {
          this.officePincode = value;
          return;
        }
        if (id == 'registeredPincode') {
          this.registeredPincode = value;
          return;
        }
        if (id == 'communicationPincode') {
          this.communicationPincode = value;
          return;
        }
      });
  }

  async ngOnInit() {
    //this.getPincodeResult(624003);
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.hasRoute();
    this.leadId = (await this.getLeadId()) as number;
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      this.getAddressDetails();
    });

    this.lovData.getLovData().subscribe((res: any) => {
      console.log(res, 'res');
      this.values = res[0].addApplicant[0];
      console.log(this.values, 'values');
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
      addressLineOne: new FormControl(null),
      addressLineTwo: new FormControl(null),
      addressLineThree: new FormControl(null),
      pincode: new FormControl(null),
      city: new FormControl(''),
      district: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      landlineNumber: new FormControl(null),
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
        ...this.getAddressFormControls(),
        periodOfCurrentStay: new FormControl(''),
        mobileNumber: new FormControl(''),
        accommodationType: new FormControl(''),
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

  getAddressDetails() {
    this.address = this.applicantDataService.getApplicant();
    this.setAddressData();
  }

  setAddressData() {
    this.isIndividual = this.address.applicantDetails.entity === 'Individual';
    // this.clearFormArray();
    this.addressForm.patchValue({
      entity: this.address.applicantDetails.entityTypeKey,
    });
    if (this.isIndividual) {
      this.addIndividualFormControls();
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
      addressLineOne: address.addressLineOne,
      addressLineTwo: address.addressLineTwo,
      addressLineThree: address.addressLineThree,
      landlineNumber: address.landlineNumber,
    };
  }

  setValuesForIndividual() {
    const addressObj = this.getAddressObj();
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const permanentAddressObj = addressObj[Constant.PERMANENT_ADDRESS];
    if (permanentAddressObj) {
      const permenantAddress = details.get('permanantAddress');
      permenantAddress.patchValue({
        ...permanentAddressObj,
      });
    }
    const officeAddressObj = addressObj[Constant.OFFICE_ADDRESS];
    if (officeAddressObj) {
      const officeAddress = details.get('officeAddress');
      officeAddress.patchValue({
        ...officeAddressObj,
      });
    }
  }

  setValuesForNonIndividual() {
    const addressObj = this.getAddressObj();
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const registeredAddressObj = addressObj[Constant.REGISTER_ADDRESS];
    if (registeredAddressObj) {
      const registeredAddress = details.get('registeredAddress');
      registeredAddress.patchValue({
        ...registeredAddressObj,
      });
    }
    const communicationAddressObj = addressObj[Constant.COMMUNICATION_ADDRESS];
    if (communicationAddressObj) {
      const communicationAddress = details.get('communicationAddress');
      communicationAddress.patchValue({
        ...communicationAddressObj,
      });
    }

    // }
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
    console.log('permanantPincode',this.permanantPincode)
    if(isChecked){
      this.currentPincode= this.permanantPincode
      console.log('currentPincode',this.currentPincode)
    }
    this.getPermanentAddressValue();
    this.isCurrAddSameAsPermAdd = isChecked === true ? '1' : '0';
  }
  onSameRegistered(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.communicationPincode = this.registeredPincode;
    }
    this.getRegisteredAddressValue();
    this.isCurrAddSameAsPermAdd = isChecked === true ? '1' : '0';
  }

  getPermanentAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    const formValue = formArray.at(0).value.permanantAddress;
    console.log('PERAM VALUE', formValue)
    const details = formArray.at(0);
    const currentAddress = details.get('currentAddress');
    currentAddress.patchValue({
      ...formValue,
    });
  }

  getRegisteredAddressValue() {
    const formArray = this.addressForm.get('details') as FormArray;
    const formValue = formArray.at(0).value.registeredAddress;
    console.log('REG VALUE', formValue)
    const details = formArray.at(0);
    const communicationAddress = details.get('communicationAddress');
    communicationAddress.patchValue({
      ...formValue,
    });
  }

  hasRoute() {
    this.isSalesOrCredit = this.router.url.includes(
      'pages/applicant-details/address-details'
    )
      ? 'credit'
      : 'sales';
  }

  onSubmit() {
    const value = this.addressForm.value;
    console.log('TOTAL FORM VALUE', value)
    if (this.isIndividual) {
      this.storeIndividualValueInService(value);
    } else {
      this.storeNonIndividualValueInService(value);
    }
    const applicantData = this.applicantDataService.getApplicant();
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
      leadId: this.leadId,
    };
    this.applicantService.saveApplicant(data).subscribe((res) => {
      const leadId = this.leadStoreService.getLeadId();
      this.applicantService.saveApplicant(data).subscribe((res) => {
        const currentUrl = this.location.path();
        if (currentUrl.includes('sales')) {
          this.router.navigate([
            `/pages/sales-applicant-details/${this.leadId}/document-upload`,
            this.applicantId,
          ]);
        } else {
          this.router.navigate([
            `/pages/applicant-details/${this.leadId}/bank-details`,
          ]);
        }
      });
    });
    console.log('addressdetailsArray', this.addressDetailsDataArray);
  }

  getAddressFormValues(address: AddressDetails) {
    return {
      ...address,
      pincode: 600002,
      city: 114100,
      state: 40,
      country: 'IND',
      district: 127,
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
      isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
    });
    const officeAddressObject = value.details[0].officeAddress;
    this.addressDetailsDataArray.push({
      ...this.getAddressFormValues(officeAddressObject),
      addressType: Constant.OFFICE_ADDRESS,
      accommodationType: officeAddressObject.accommodationType,
      periodOfCurrentStay: Number(officeAddressObject.periodOfCurrentStay),
      mobileNumber: officeAddressObject.mobileNumber,
      isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
    });

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
      isCurrAddSameAsPermAdd: this.isCurrAddSameAsPermAdd,
    });
    this.applicantDataService.setAddressDetails(this.addressDetailsDataArray);
  }
}
