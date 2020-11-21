import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from '@services/applicant.service';
import { InsuranceServiceService } from '@services/insurance-service.service';
import { LabelsService } from '@services/labels.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service'
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
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
  isDirty;
  permanantPincode;
  leadData: {};
  applicantList = [];
  lovData: any;
  applicantRelation = [];
  todayDate: Date;
  nomineeArray = [];
  guardianArray = []

  constructor(private fb: FormBuilder,
              private labelsData: LabelsService,
              private toggleDdeService: ToggleDdeService,
              private insuranceService: InsuranceServiceService,
              private loginStoreService: LoginStoreService,
              private route: ActivatedRoute,
              private router: Router,
              private applicantService: ApplicantService,
              private toasterService: ToasterService,
              private createLeadService: CreateLeadDataService,
              private lovService: CommomLovService,
              private utilityService: UtilityService,
              ) { }

  async ngOnInit() {
    this.todayDate = new Date();
    this.leadData = this.createLeadService.getLeadSectionData();
    console.log('lead Data', this.leadData);
    // tslint:disable-next-line: no-string-literal
    this.leadData['applicantDetails'].map((element => {
      const body = {
        key: element.applicantTypeKey,
        value: element.fullName,
        applicantId: element.applicantId,
        applicantType: element.applicantType
      };
      this.applicantList.push(body);
    }));
    this.labelsData.getLabelsData().subscribe(res => {
      this.labels = res;
      this.validationData = res.validationData;
    });
    this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
      this.roleId = value.roleId;
      this.roleType = value.roleType;
      console.log('role Type', this.roleType);
    });
    this.lovService.getLovData().subscribe((res: any) => {
      this.lovData = res.LOVS;
      console.log('lov data', this.lovData);
      this.lovData.relationship.filter(element => {
       if ( element.key !== '5RELATION') {
         const body = {
           key : element.key,
           value: element.value
         };
         this.applicantRelation.push(body);
       }
      });
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
      guardianCity: (['']),
      guardianCountry: (['']),
      guardianDOB: [''],
      guardianDistrict: (['']),
      guardianFirstName: [''],
      guardianFullName: [''],
      guardianLastName: [''],
      guardianMiddleName: [''],
      guardianMobile: [''],
      guardianPincode: (['']),
      guardianRelationWithApp: [''],
      guardianState: (['']),
      guardianMobileNumber: [''],
      nomineeMobileNumber: [''],
      motorInsuranceRequired: [''],
      nomineeAddLine1: [''],
      nomineeAddLine2: [''],
      nomineeAddLine3: [''],
      nomineeAge: (['']),
      nomineeCity: (['']),
      nomineeCountry: (['']),
      nomineeDOB: [''],
      nomineeDistrict: (['']),
      nomineeFirstName: [''],
      nomineeFullName: [''],
      nomineeLastName: [''],
      nomineeMiddleName: [''],
      nomineeMobile: [''],
      nomineePincode: (['']),
      nomineeRelationWithApp: [''],
      nomineeState: [''],
      typeOfApplicant: [''],
      usedCoverageAmount: [''],
    });
  }


 saveUpdateInsurance() {
   this.isDirty = true;
   if ( this.f.invalid) {
     this.toasterService.showError('Please enter mandatory fields', '');
     console.log('form group', this.f);
     return;
   }
   console.log('form group', this.f);
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
     applicantId: this.applicantId,
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
    this.addValidations();
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
        console.log('in valid pincode', value.ProcessVariables.error);
        // tslint:disable-next-line: no-string-literal
        this.invalidPincode = false;
        const values = value.ProcessVariables.GeoMasterView;
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
        if (value.ProcessVariables.error.message && value.ProcessVariables.error.message != null) {
          const message = value.ProcessVariables.error.message;
          this.toasterService.showWarning('', message);
          this.invalidPincode = true;
        } else {
          this.invalidPincode = true;

        }

      }
    });

}
public selectApplicant(event: any) {
  // this.applicantId = event.id;
  this.applicantList.filter((element: any) => {
    const control = this.insuranceDetailForm as FormGroup;
    if (element.key === event) {
    this.applicantId = element.applicantId;
    control.patchValue({
      typeOfApplicant: element.applicantType
    });
  }
  });
}
get f() {
  return this.insuranceDetailForm as FormGroup;
}
public concatNomineeName() {
this.f.controls.nomineeFullName.reset();
const nomineeFirstName = this.f.controls.nomineeFirstName.value ? this.f.controls.nomineeFirstName.value + ' ' : '' ;
const nomineeLastName = this.f.controls.nomineeLastName.value ? this.f.controls.nomineeLastName.value  : '' ;
const nomineeMiddleName = this.f.controls.nomineeMiddleName.value ? this.f.controls.nomineeMiddleName.value + ' ' : '' ;
const fullName = nomineeFirstName + '' + nomineeMiddleName + '' + nomineeLastName;
this.f.patchValue({
  nomineeFullName: fullName
});
}
public concatguardianName() {
  this.f.controls.guardianFullName.reset();
  const guardianFirstName = this.f.controls.guardianFirstName.value ? this.f.controls.guardianFirstName.value + '' : '' ;
  const guardianLastName = this.f.controls.guardianLastName.value ? this.f.controls.guardianLastName.value + '' : '' ;
  const guardianMiddleName = this.f.controls.guardianMiddleName.value ? this.f.controls.guardianMiddleName.value + ' ' : '' ;
  const fullName = guardianFirstName + ' ' + guardianMiddleName + ' ' + guardianLastName;
  this.f.patchValue({
    guardianFullName: fullName
  });

  }
public ageCalculation(date, relation: string) {
  const event = this.calculateAgeInYears(this.utilityService.getDateFormat(date));
  console.log('testing date', event);
  if ( relation === 'nominee') {
  this.f.patchValue({
    nomineeAge: event
  });
  }
}
  public calculateAgeInYears(date) {
    const now = new Date();
    const toDayDate = this.utilityService.getDateFromString(
      date
    );
    // tslint:disable-next-line: variable-name
    const current_year = now.getFullYear();
    const yearDiff = current_year - toDayDate.getFullYear();
    const birthdayThisyear = new Date(current_year, toDayDate.getMonth(), toDayDate.getDate());
    const age = (now >= birthdayThisyear);

    return age
        ? yearDiff
        : yearDiff - 1;
}

public addValidations() {
  if ( this.creditShieldRequired === true) {
    let control = this.f as FormGroup;
    // tslint:disable-next-line: forin
    for (const key in control.controls) {
      // console.log('key validations', key);
      if (key.includes('nominee')) {
        this.nomineeArray.push(key);
      } else if (key.includes('guardian')) {
        this.guardianArray.push(key);
      }
    }
    console.log('controls array', this.nomineeArray, this.guardianArray);
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.nomineeArray.length; i++) {
      console.log(this.nomineeArray[i], 'value in nominee array');
      this.f.controls[this.nomineeArray[i]].setValidators(Validators.required);
      this.f.controls[this.nomineeArray[i]].updateValueAndValidity();
    }
  }
}


}
