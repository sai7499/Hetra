import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { LabelsService } from 'src/app/services/labels.service';
import { LovDataService } from '@services/lov-data.service';
import { Router,ActivatedRoute } from '@angular/router';
import { CommomLovService } from '@services/commom-lov-service';
import { AddressDetails, Applicant, ApplicantDetails } from '@model/applicant.model';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import { Address } from 'cluster';

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css'],
})
export class AddressDetailsComponent implements OnInit {
  isIndividual = true;
  addressForm: FormGroup;
  addressDetailsDataArray : any =[];

  dropDownValues: any = [];
  isSalesOrCredit: string;
  LOV: any = [];
  labels: any = {};
  address: Applicant;
  applicantId: number;

  isCurrAddSameAsPermAdd : any =0;
  permenantAddressDetails: AddressDetails[];
  currentAddressDetails: AddressDetails[];

  constructor(
    private lovData: LovDataService,
    private labelsData: LabelsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commomLovService: CommomLovService,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getLabels();
    this.getLOV();
    this.hasRoute();
    this.activatedRoute.params.subscribe((value) => {
      if (!value && !value.applicantId) {
        return;
      }
      this.applicantId = Number(value.applicantId);
      
    });
    this.getAddressDetails();
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
    console.log('LOV data ---', this.LOV);
  }

  onIndividualChange(event) {
    if (!event) {
      return;
    }
    const value = event.target.value;
    console.log('value', value)
    this.isIndividual = value === 'INDIVENTTYP';
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
    console.log('this.indi', this.isIndividual)
    this.clearFormArray();
    this.addressForm.patchValue({
      entity : this.address.applicantDetails.entityTypeKey
    });
    if (this.isIndividual) {
      this.addIndividualFormControls();
      this.setValuesForIndividual();
    } else {
      this.addNonIndividualFormControls();
      this.setValuesForNonIndividual();
    }
  }

  setValuesForIndividual() {
    
    const addressObj = this.getAddressObj()
    console.log('addressObj',addressObj)
    
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);

    const permenantAddressObj= addressObj['PERMADDADDTYP']
    console.log('objectpermananentAddress--', permenantAddressObj)
    if(permenantAddressObj){
      const permenantAddress = details.get('permanantAddress');
      permenantAddress.patchValue({

        addressLineOne: permenantAddressObj.addressLineOne,
        addressLineTwo: permenantAddressObj.addressLineTwo,
        addressLineThree: permenantAddressObj.addressLineThree,
        pincode: permenantAddressObj.pincode,
        city: permenantAddressObj.city,
        district: permenantAddressObj.district,
        state: permenantAddressObj.state,
        country: permenantAddressObj.country,
        landlineNumber: permenantAddressObj.landlineNumber,
      });
    }
    
    console.log('details', details);
  }

  setValuesForNonIndividual() {
    const addressObj = this.getAddressObj();
    console.log('addressObj',addressObj)
    
    const formArray = this.addressForm.get('details') as FormArray;
    const details = formArray.at(0);
    const registeredAddressObj = addressObj['REGADDADDTYP']
    if(registeredAddressObj){
      const registeredAddress= details.get('registeredAddress')
      registeredAddress.patchValue({
        addressLineOne: registeredAddressObj.addressLineOne,
        addressLineTwo: registeredAddressObj.addressLineTwo,
        addressLineThree: registeredAddressObj.addressLineThree,
        pincode: registeredAddressObj.pincode,
        city: registeredAddressObj.city,
        district: registeredAddressObj.district,
        state: registeredAddressObj.state,
        country: registeredAddressObj.country,
        landlineNumber: registeredAddressObj.landlineNumber,
      });
    }
    
  }

  getAddressObj(){
   const address = this.address.addressDetails;
   const addressObj = {};
    if(address) {
      
      address.forEach((value) => {
        
          if(value.addressType === 'PERMADDADDTYP') {
              addressObj['PERMADDADDTYP'] = value;
          }
          else if(value.addressType === 'COMMADDADDTYP') {
              addressObj['COMMADDADDTYP'] = value;
          }
          else if(value.addressType === 'OFFADDADDTYP') {
            addressObj['OFFADDADDTYP'] = value;
          }
          else if(value.addressType === 'REGADDADDTYP') {
            addressObj['REGADDADDTYP'] = value;
          }
          else if(value.addressType === 'CURRADDADDTYP') {
            addressObj['CURRADDADDTYP'] = value;
        }
      })
  }
  return addressObj;
  }

  clearFormArray() {
    const formArray = this.addressForm.get('details') as FormArray;
    formArray.clear();
}

  isSameAddress(event) {
    const isChecked = event.target.checked;
    console.log('event', isChecked);
    this.getPermanentAddressValue();
    this.isCurrAddSameAsPermAdd = isChecked=== true? 1: 0
  }
  onSameRegistered(event) {
    const isChecked = event.target.checked;
    this.getRegisteredAddressValue();
    this.isCurrAddSameAsPermAdd = isChecked=== true? 1: 0
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
    const value = this.addressForm.value;
    if (this.isIndividual) {
      this.storeIndividualValueInService(value);
      this.applicantDataService.setAddressDetails(null)

    }else {
      this.storeNonIndividualValueInService(value);
      this.applicantDataService.setAddressDetails(null)
    }
    const applicantData = this.applicantDataService.getApplicant();
    const data = {
      applicantId: this.applicantId,
      ...applicantData,
    };
    this.applicantService.saveApplicant(data).subscribe((res) => {
      console.log('res', res);
    });
  }

  storeIndividualValueInService(value){
    const applicantDetails : ApplicantDetails={}
    applicantDetails.entityType = value.entity
    this.applicantDataService.setApplicantDetails(applicantDetails)
    
    const permenantAdress : AddressDetails= {}
    const permanantAddressObject = value.details[0].permanantAddress
    console.log('permanantAddressObject', permanantAddressObject)
    permenantAdress.addressType="PERMADDADDTYP"
    permenantAdress.addressLineOne= permanantAddressObject.addressLineOne;
    permenantAdress.addressLineTwo= permanantAddressObject.addressLineOne;
    permenantAdress.addressLineThree= permanantAddressObject.addressLineOne;
    // permenantAdress.pincode= permanantAddressObject.pinCode;
    // permenantAdress.city= permanantAddressObject.city;
    // permenantAdress.state= permanantAddressObject.state;
    // permenantAdress.country= permanantAddressObject.country;
    // permenantAdress.district= permanantAddressObject.district;
    permenantAdress.pincode= 1;
    permenantAdress.city= 1
    permenantAdress.state= 1;
    permenantAdress.country= "IN";
    permenantAdress.district= 1;


    permenantAdress.landlineNumber= permanantAddressObject.landlineNumber;
    permenantAdress.isCurrAddSameAsPermAdd=this.isCurrAddSameAsPermAdd;

    this.addressDetailsDataArray.push(permenantAdress);

     const currentAddress : AddressDetails ={}
     const currentAddressObject = value.details[0].currentAddress
     console.log('currentAddressObject', currentAddressObject);
     currentAddress.addressType="CURRADDADDTYP"
     currentAddress.addressLineOne= currentAddressObject.addressLineOne;
     currentAddress.addressLineTwo= currentAddressObject.addressLineOne;
     currentAddress.addressLineThree= currentAddressObject.addressLineOne;
     currentAddress.pincode= currentAddressObject.pinCode;
    //  currentAddress.city= currentAddressObject.city;
    //  currentAddress.state= currentAddressObject.state;
    //  currentAddress.country= currentAddressObject.country;
    //  currentAddress.district= currentAddressObject.district;

    currentAddress.pincode= 1;
    currentAddress.city= 1
    currentAddress.state= 1;
    currentAddress.country= "IN";
    currentAddress.district= 1;



    
     currentAddress.accommodationType= currentAddressObject.accommodationType;
     currentAddress.periodOfCurrentStay= currentAddressObject.periodOfCurrentStay;
     currentAddress.landlineNumber= currentAddressObject.landlineNumber;
     currentAddress.mobileNumber= currentAddressObject.mobileNumber;
     currentAddress.isCurrAddSameAsPermAdd= this.isCurrAddSameAsPermAdd

     this.addressDetailsDataArray.push(currentAddress);

     const officeAddress : AddressDetails ={}
     const officeAddressObject = value.details[0].officeAddress;
     console.log('officeAddressObject',officeAddressObject);
     officeAddress.addressType="OFFADDADDTYP"
     officeAddress.addressLineOne= officeAddressObject.addressLineOne;
     officeAddress.addressLineTwo= officeAddressObject.addressLineOne;
     officeAddress.addressLineThree= officeAddressObject.addressLineOne;
    //  officeAddress.pincode= officeAddressObject.pinCode;
    //  officeAddress.city= officeAddressObject.city;
    //  officeAddress.state= officeAddressObject.state;
    //  officeAddress.country= officeAddressObject.country;
    //  officeAddress.district= officeAddressObject.district;
    officeAddress.pincode= 1;
     officeAddress.city= 1
     officeAddress.state= 1;
     officeAddress.country= "IN";
     officeAddress.district= 1;

     officeAddress.accommodationType= officeAddressObject.accommodationType;
     officeAddress.periodOfCurrentStay= officeAddressObject.periodOfCurrentStay;
     officeAddress.landlineNumber= officeAddressObject.landlineNumber;
     officeAddress.mobileNumber= officeAddressObject.mobileNumber;
     officeAddress.isCurrAddSameAsPermAdd= this.isCurrAddSameAsPermAdd

     this.addressDetailsDataArray.push(officeAddress)
     console.log('addressDetailsDataArray',this.addressDetailsDataArray)
    
     this.applicantDataService.setAddressDetails(this.addressDetailsDataArray);

     

   
  }
  storeNonIndividualValueInService(value){
    const applicantDetails : ApplicantDetails={}
    applicantDetails.entityType = value.entity
    this.applicantDataService.setApplicantDetails(applicantDetails)
    
    const registeredAddress : AddressDetails={}
    const registeredAddressObject = value.details[0].registeredAddress
    console.log('registeredAddressObject',registeredAddressObject)
    registeredAddress.addressType="REGADDADDTYP"
    registeredAddress.addressLineOne= registeredAddressObject.addressLineOne;
    registeredAddress.addressLineTwo= registeredAddressObject.addressLineOne;
    registeredAddress.addressLineThree= registeredAddressObject.addressLineOne;
    // registeredAddress.pincode= registeredAddressObject.pinCode;
    // registeredAddress.city= registeredAddressObject.city;
    // registeredAddress.state= registeredAddressObject.state;
    // registeredAddress.country= registeredAddressObject.country;
    // registeredAddress.district= registeredAddressObject.district;

    registeredAddress.pincode= 1;
    registeredAddress.city= 1;
    registeredAddress.state= 1;
    registeredAddress.country= "IN";
    registeredAddress.district= 1;

    registeredAddress.landlineNumber= registeredAddressObject.landlineNumber;
    registeredAddress.mobileNumber= registeredAddressObject.mobileNumber;
    registeredAddress.isCurrAddSameAsPermAdd= this.isCurrAddSameAsPermAdd

    this.addressDetailsDataArray.push(registeredAddress);

    const communicationAddress : AddressDetails={}
    const communicationAddressObject = value.details[0].communicationAddress;
    console.log('communicationAddressObject',communicationAddressObject);
    communicationAddress.addressType="COMMADDADDTYP"
    communicationAddress.addressLineOne= communicationAddressObject.addressLineOne;
    communicationAddress.addressLineTwo= communicationAddressObject.addressLineOne;
    communicationAddress.addressLineThree= communicationAddressObject.addressLineOne;
    // communicationAddress.pincode= communicationAddressObject.pinCode;
    // communicationAddress.city= communicationAddressObject.city;
    // communicationAddress.state= communicationAddressObject.state;
    // communicationAddress.country= communicationAddressObject.country;
    // communicationAddress.district= communicationAddressObject.district;
    communicationAddress.pincode= 1;
    communicationAddress.city= 1;
    communicationAddress.state= 1;
    communicationAddress.country= "IN";
    communicationAddress.district= 1;

    communicationAddress.landlineNumber= communicationAddressObject.landlineNumber;
    communicationAddress.isCurrAddSameAsPermAdd= this.isCurrAddSameAsPermAdd;

    this.addressDetailsDataArray.push(communicationAddress)
    console.log('addressDetailsDataArray', this.addressDetailsDataArray);

    this.applicantDataService.setAddressDetails(this.addressDetailsDataArray)


  }
}
