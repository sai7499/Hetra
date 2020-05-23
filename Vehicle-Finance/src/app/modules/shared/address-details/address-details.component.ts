import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { LovDataService } from '@services/lov-data.service';
import { Router} from '@angular/router'

@Component({
  selector: 'app-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit {
  isIndividual = true;
  addressForm: FormGroup;
  dropDownValues : any=[];
  isSalesOrCredit : string;

  constructor(private lovData : LovDataService,
              private router : Router) { 
    
  }

  ngOnInit() {
    this.initForm();
    this.hasRoute()
    // this.lovData.getLovData().subscribe((res: any) => {
      
    //   this.dropDownValues = res[0].addApplicant[0];

  
  }
  initForm(){
    this.addressForm = new FormGroup({
      details: new FormArray([])
  });
  this.addIndividualFormControls();
  }

  onIndividualChange(event) {
    const value = event.target.value;
    this.isIndividual = value === 'individual';
    const formArray = (this.addressForm.get('details') as FormArray);
    formArray.clear();
    this.isIndividual ? this.addIndividualFormControls() : this.addNonIndividualFormControls();
}

addIndividualFormControls() {
    const controls = new FormGroup({
    address1: new FormControl(null),
    address2: new FormControl(null),
    address3: new FormControl(null),
    pinCode: new FormControl(null),
    city: new FormControl(''),
    district: new FormControl(''),
    state: new FormControl(''),
    country: new FormControl(''),
    landLine: new FormControl(null),
    currentLine1: new FormControl(null),
    currentLine2: new FormControl(null),
    currentLine3: new FormControl(null),
    currentPinCode: new FormControl(null),
    currentCity: new FormControl(''),
    currentDistrict: new FormControl(''),
    currentState: new FormControl(''),
    currentCountry: new FormControl(''),
    currentAccommodation: new FormControl(null),
    currentMobile: new FormControl(null),
    currentLandLine: new FormControl(''),
    officeLine1: new FormControl(null),
    officeLine2: new FormControl(null),
    officeLine3: new FormControl(null),
    officePinCode: new FormControl(null),
    officeCity: new FormControl(''),
    officeDistrict: new FormControl(''),
    officeState: new FormControl(''),
    officeCountry: new FormControl(''),
    officeAccommodation: new FormControl(null),
    officePeriod: new FormControl(null),
    officeMobile: new FormControl(null),
    officeLandLine: new FormControl(null),
    });
    (this.addressForm.get('details') as FormArray).push(controls);
}

addNonIndividualFormControls() {
    const controls = new FormGroup({
        registeredLine1: new FormControl(null),
        registeredLine2: new FormControl(null),
        registeredLine3: new FormControl(null),
        registeredPinCode: new FormControl(null),
        registeredCity: new FormControl(null),
        registeredDistrict: new FormControl(null),
        registeredState: new FormControl(null),
        registeredCountry: new FormControl(null),
        registeredLandLine: new FormControl(null),
        registeredMobile: new FormControl(null),
        communicationLine1: new FormControl(null),
        communicationLine2: new FormControl(null),
        communicationLine3: new FormControl(null),
        communicationPinCode: new FormControl(null),
        communicationCity: new FormControl(null),
        communicationDistrict: new FormControl(null),
        communicationState: new FormControl(null),
        communicationCountry: new FormControl(null),
        communicationLandLine: new FormControl(null),
        

    });
    (this.addressForm.get('details') as FormArray).push(controls);
}

isSameAddress(event) {
    const isChecked = event.target.checked;
    console.log('event', isChecked);
    this.getPermanentAddressValue();
}
onSameRegistered(event){
  const isChecked = event.target.checked;
  this.getRegisteredAddressValue();
}

getPermanentAddressValue() {
  const formArray = this.addressForm.get('details') as FormArray;
  console.log('formArray',formArray)
  const formValue = formArray.at(0).value;
  console.log('formValue', formValue);
  const currentLine1 =  formValue.address1;
  const currentLine2 =  formValue.address2;
  const currentLine3 =  formValue.address3;
  const currentPinCode =  formValue.pinCode;
  const currentCity =  formValue.city;
  const currentDistrict =  formValue.district;
  const currentState =  formValue.state;
  const currentCountry =  formValue.country;
  const currentLandLine =  formValue.landLine;
  formArray.at(0).patchValue({
      currentLine1,
      currentLine2,
      currentLine3,
      currentPinCode,
      currentCity,
      currentDistrict,
      currentState,
      currentCountry,
      currentLandLine
      
  });
 

}

getRegisteredAddressValue(){
  const formArray = this.addressForm.get('details') as FormArray;
  console.log('formArray',formArray)
  const formValue = formArray.at(0).value;
  console.log('formValue', formValue);
  const communicationLine1= formValue.registeredLine1
  const communicationLine2= formValue.registeredLine2
  const communicationLine3= formValue.registeredLine3
  const communicationCity= formValue.registeredCity
  const communicationDistrict= formValue.registeredCountry
  const communicationState= formValue.registeredState
  const communicationCountry= formValue.registeredCountry
  const communicationLandLine= formValue.registeredLandLine
  const communicationPinCode= formValue.registeredPinCode

  formArray.at(0).patchValue({
    communicationLine1,
    communicationLine2,
    communicationLine3,
    communicationCity,
    communicationDistrict,
    communicationState,
    communicationCountry,
    communicationLandLine,
    communicationPinCode
    
  })
}


hasRoute(){
 this.isSalesOrCredit = this.router.url.includes('/dde/credit')?'credit': 'sales';
}


}
