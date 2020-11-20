import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from '@services/applicant.service';
import { InsuranceServiceService } from '@services/insurance-service.service';
import { LabelsService } from '@services/labels.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.css']
})
export class InsuranceDetailsComponent implements OnInit {

  insuranceDetailForm: FormGroup;
  LOV: any = {};

  public label: any = {};
  public labelCreditShield: any = {};
  public labelExistingInsuranceDetails: any = {};
  disableSaveBtn: boolean;
  showCreditDetails = false;

  insuranceType = '0';
  labels: any;
  validationData: any;
  roleId: any;
  roleType: any;
  applicantId: number;
  leadId: number;
  invalidPincode: boolean;
  city: any;
  state: any;
  gaurdianCity: any[];
  gaurdianState: any[];
  nomineeCity: any[];
  nomineeState: any[];
  district: any;
  nomineeDistrict: any;
  nomineeCountry: any[];
  gaurdianCountry: any[];
  gaurdianDistrict: any[];
  country: any[];
  flag = 'yes'; // to default check credit sheild radio button
  motar = 'yes'; // to default check motor insurance radio button
  creditShieldRequired: boolean;
  motorShieldRequired = true;

  constructor(private fb: FormBuilder,
              private labelsData: LabelsService,
              private toggleDdeService: ToggleDdeService,
              private insuranceService: InsuranceServiceService,
              private loginStoreService: LoginStoreService,
              private route: ActivatedRoute,
              private router: Router,
              private applicantService: ApplicantService,
              private toasterService: ToasterService) { }

  async ngOnInit() {

    this.labelsData.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
    });
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.applicantId = (await this.getApplicantId()) as number;
    this.leadId = (await this.getLeadId()) as number;
    this.initForm();
    this.checkOnCredit(this.flag);
    this.checkOnMotor(this.motar);

  }
  getApplicantId() {
    return new Promise((resolve, reject) => {
      this.route.params.subscribe((value) => {
        const applicantId = value.applicantId;
        if (applicantId) {
          resolve(Number(applicantId));
        }
        resolve(null);
      });
    });
  }
  getLeadId() {
    return new Promise((resolve, reject) => {
      this.route.parent.params.subscribe((value) => {
        if (value && value.leadId) {
          resolve(Number(value.leadId));
        }
        resolve(null);
      });
    });
  }

  initForm() {
    this.insuranceDetailForm = this.fb.group({
      nameOfApplicant: [''],
      creditShieldRequired: [''],
      guardianAddLine1: [''],
      guardianAddLine2: [''],
      guardianAddLine3: [''],
      guardianCity: Number(['']),
      guardianCountry: Number(['']),
      guardianDOB: [''],
      guardianDistrict: Number(['']),
      guardianFirstName: [''],
      guardianFullName: [''],
      guardianLastName: [''],
      guardianMiddleName: [''],
      guardianMobileNumber: [''],
      guardianPincode: Number(['']),
      guardianRelationWithApp: [''],
      guardianState: Number(['']),
      motorInsuranceRequired: [''],
      nomineeAddLine1: [''],
      nomineeAddLine2: [''],
      nomineeAddLine3: [''],
      nomineeAge: Number(['']),
      nomineeCity: Number(['']),
      nomineeCountry: Number(['']),
      nomineeDOB: [''],
      nomineeDistrict: Number(['']),
      nomineeFirstName: [''],
      nomineeFullName: [''],
      nomineeLastName: [''],
      nomineeMiddleName: [''],
      nomineeMobileNumber: [''],
      nomineePincode: Number(['']),
      nomineeRelationWithApp: [''],
      nomineeState: [''],
      typeOfApplicant: [''],
      usedCoverageAmount: [''],
    });
  }

  
 saveUpdateInsurance() {
  this.insuranceDetailForm.value.guardianCity =  Number(this.insuranceDetailForm.value.guardianCity);
  this.insuranceDetailForm.value.guardianCountry =  Number(this.insuranceDetailForm.value.guardianCountry);
  this.insuranceDetailForm.value.guardianDistrict =  Number(this.insuranceDetailForm.value.guardianDistrict);
  this.insuranceDetailForm.value.guardianState =  Number(this.insuranceDetailForm.value.guardianState);
  this.insuranceDetailForm.value.guardianPincode =  Number(this.insuranceDetailForm.value.guardianPincode);
  this.insuranceDetailForm.value.nomineeAge =  Number(this.insuranceDetailForm.value.nomineeAge);
  this.insuranceDetailForm.value.nomineeCity =  Number(this.insuranceDetailForm.value.nomineeCity);
  this.insuranceDetailForm.value.nomineeCountry =  Number(this.insuranceDetailForm.value.nomineeCountry);
  this.insuranceDetailForm.value.nomineeDistrict =  Number(this.insuranceDetailForm.value.nomineeDistrict);
  this.insuranceDetailForm.value.nomineePincode =  Number(this.insuranceDetailForm.value.nomineePincode);
  this.insuranceDetailForm.value.nomineeState =  Number(this.insuranceDetailForm.value.nomineeState);
  this.insuranceDetailForm.value.nomineeAge =  Number(this.insuranceDetailForm.value.nomineeAge);
  this.insuranceDetailForm.value.usedCoverageAmount =  Number(this.insuranceDetailForm.value.usedCoverageAmount);
  this.insuranceDetailForm.value.creditShieldRequired = this.creditShieldRequired;
  this.insuranceDetailForm.value.motorInsuranceRequired = this.motorShieldRequired;
  const body  = {
     leadId: this.leadId,
     applicantId: 522,
     isMinor: true,
     userId: localStorage.getItem('userId'),

     insuranceDetails: {
      ...this.insuranceDetailForm.value
     }

   };
  this.insuranceService.saveInsuranceDetails(body).subscribe((res: any) => {
   console.log('insurance', res);
 });
 }

 checkOnCredit(event) {
  if (event === 'no') {
    this.showCreditDetails = false;
    this.creditShieldRequired = false;
  } else if (event === 'yes') {
    this.showCreditDetails = true;
    this.creditShieldRequired = true;
  }
 }
 checkOnMotor(event) {
  if (event === 'no') {
    // this.showCreditDetails = false;
    this.motorShieldRequired = false;
  } else if (event === 'yes') {
    // this.showCreditDetails = true;
    this.motorShieldRequired = true;
  }
 }
 getPincode(pincode, event: string) {
  // const id = pincode.id;
  const pincodeValue = pincode.value;
  if (pincodeValue.length === 6) {
    const pincodeNumber = Number(pincodeValue);
    this.getPincodeResult(pincodeNumber, event);
    console.log('in get pincode', pincodeNumber);
  } else {
    this.invalidPincode = false;
  }
}
getPincodeResult(pincodeNumber: number, event: string) {
  console.log('event change', event);

  this.invalidPincode = false;
  this.city = []; // clearing the array which contains previous city list
  this.state = []; // clearing the array which contains previous state list
  this.district = []; // clearing the array which contains previous district list
  this.country = [];  // clearing the array which contains previous country list
  this.applicantService
    .getGeoMasterValue({
      pincode: pincodeNumber,
    }).subscribe((value: any) => {
      console.log('res', value);
      // tslint:disable-next-line: no-string-literal
      if (value['ProcessVariables'].error.code === '0') {
        console.log('in valid pincode', value['ProcessVariables'].error);
        // tslint:disable-next-line: no-string-literal
        this.invalidPincode = false;
        const values = value['ProcessVariables'].GeoMasterView;
        const state = {
          key: Number(values[0].stateId),
          value: values[0].stateName
        };
        this.state.push(state);
        const district = {
          key: Number(values[0].districtId),
          value: values[0].districtName
        };
        this.district.push(district);
        const country = {
          key: Number(values[0].countryId),
          value: values[0].country
        };
        this.country.push(country);
        values.map((element) => {
          const city = {
            key: Number(element.cityId),
            value: element.cityName
          };
          this.city.push(city);
          // console.log('in geo', city);
          if (event === 'nominee') {
            this.nomineeCity = [];
            this.nomineeState = [];
            this.nomineeDistrict = [];
            this.nomineeCountry = [];
            this.nomineeCity = this.city;
            this.nomineeState = this.state;
            this.nomineeDistrict = this.district;
            this.nomineeCountry = this.country;
           } else if (event === 'guardian') {
             this.gaurdianCity = [];
             this.gaurdianState = [];
             this.gaurdianDistrict = [];
             this.gaurdianCountry = [];
             this.gaurdianCity = this.city;
             this.gaurdianState = this.state;
             this.gaurdianDistrict = this.district;
             this.gaurdianCountry = this.country;
           }
        });
        // tslint:disable-next-line: no-string-literal
      } else if (value['ProcessVariables'].error.code === '1') {
        if (value['ProcessVariables'].error.message && value['ProcessVariables'].error.message != null) {
          const message = value.ProcessVariables.error.message;
          this.toasterService.showWarning('', message);
          this.invalidPincode = true;
        } else {
          this.invalidPincode = true;

        }
        // tslint:disable-next-line: no-string-literal
        // console.log('in valid pincode', value['ProcessVariables'].error);
        // const message = value.ProcessVariables.error.message;
        // this.toasterService.showWarning('', message);

      }
    });



}
}
