import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
    templateUrl: './address-details.component.html',
    styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit {
    isIndividual = true;
    addressForm: FormGroup;

    ngOnInit() {
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
            registeredMobile: new FormControl(null)
        });
        (this.addressForm.get('details') as FormArray).push(controls);
    }

    isSameAddress(event) {
        const isChecked = event.target.checked;
        console.log('event', isChecked);
        this.getPermanentAddressValue();
    }

    getPermanentAddressValue() {
      const formArray = this.addressForm.get('details') as FormArray;
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
}
