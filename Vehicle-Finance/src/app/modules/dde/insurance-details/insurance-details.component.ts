import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from '@services/applicant.service';
import { InsuranceServiceService } from '@services/insurance-service.service';
import { LabelsService } from '@services/labels.service';
import { LoginStoreService } from '@services/login-store.service';
import { ToasterService } from '@services/toaster.service';
import { ToggleDdeService } from '@services/toggle-dde.service';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
import { CommomLovService } from '@services/commom-lov-service';
import { UtilityService } from '@services/utility.service';
import { LoanViewService } from '@services/loan-view.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-insurance-details',
  templateUrl: './insurance-details.component.html',
  styleUrls: ['./insurance-details.component.css']
})
export class InsuranceDetailsComponent implements OnInit {

  insuranceDetailForm: FormGroup;
  LOV: any = {};
  isDirty: boolean = false;
  permanantPincode: any;

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
  // isDirty;
  // permanantPincode;
  inputPincode;
  leadData: {};
  applicantList = [];
  lovData: any;
  applicantRelation = [];
  todayDate: Date;
  nomineeArray = [];
  guardianArray = [];
  processVariables: any;
  isGuardian = false;
  isMinor: boolean;
  isShowGuardian: boolean;
  healthQuestionAns = [];
  covidQuestions = [];
  healthAns: any = [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }];

  isLoan360: boolean;
  insuranceProviderList = [];
  vehicleMakeList = [];
  fuelTypeList = [];
  modelList = [];
  rtoCentreList = [];
  variantList = [];
  vehicleTypeList = [];
  productCode: string;
  rtoCenterName: any;
  isRtoCenter = true;
  isNomineeInvalid = false;
  isGetApi: boolean;

  // User defined
  udfScreenId: any = '';
  udfGroupId: any = 'ISG001';
  udfDetails: any = [];
  userDefineForm: any;
  isViewDde: boolean;
  nomineeDetails: any;
  gaurdianDetails: any;

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
    private loanViewService: LoanViewService
  ) { }

  async ngOnInit() {
    this.todayDate = new Date();
    this.leadData = this.createLeadService.getLeadSectionData();
    console.log('lead Data', this.leadData);
    this.productCode = this.leadData['leadDetails'].productCatCode;
    this.initForm();
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.isViewDde = this.toggleDdeService.getOperationType();
    if (this.isLoan360 || this.isViewDde) {
      this.insuranceDetailForm.disable();
      this.disableSaveBtn = true;
    }


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
        if (element.key !== '5RELATION') {
          const body = {
            key: element.key,
            value: element.value
          };
          this.applicantRelation.push(body);
        }
      });
    });
    this.applicantId = (await this.getApplicantId()) as number;
    this.leadId = (await this.getLeadId()) as number;


    this.getInsuranceDetails();
    this.getInsuranceProvider();
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = udfScreenId.DDE.insuranceDetailsDDE;

    })

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
      nameOfCreditShieldPolicy: [''],
      creditShieldRequired: ['', Validators.required],
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
      // guardianMobile: [''],
      guardianPincode: (['']),
      guardianRelationWithApp: [''],
      guardianState: (['']),
      guardianMobileNumber: [''],
      nomineeMobileNumber: [''],
      motorInsuranceRequired: ['', Validators.required],
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
      nomineeGender: [''],
      nomineePincode: (['']),
      nomineeRelationWithApp: [''],
      nomineeState: [''],
      typeOfApplicant: [''],
      usedCoverageAmount: [''],
      healthQuestion: [''],
      guarantorGender: [''],
      fuelType: [''],
      model: [''],
      rtoCentre: [''],
      variant: [''],
      vehicleMake: [''],
      vehicleType: [''],
      insuranceProvider: ['']
    });
  }


  saveUpdateInsurance(event: string) {

    if (this.isLoan360) {
      return this.onNext();
    }
    this.checkOnMotor(this.f.value.motorInsuranceRequired);
    this.checkOnCredit(this.f.value.creditShieldRequired);

    if (this.f.value.nomineeAge <= 17) {
      this.isGuardian = true;
      this.isDirty = true;
    } else {
      this.isGuardian = false;
      this.isDirty = true;
    }
    if (!this.isRtoCenter) {
      this.toasterService.showError('Please enter mandatory fields', '');
      this.isRtoCenter = false;
      this.insuranceDetailForm.controls.rtoCentre.reset();
      return;
    } else if (this.f.invalid || this.userDefineForm.udfData.invalid) {
      this.toasterService.showError('Please enter mandatory fields', '');
      console.log('form group', this.f);
      return;
    }

    console.log('form group', this.f);
    this.insuranceDetailForm.value.guardianCity = Number(this.insuranceDetailForm.value.guardianCity);
    this.insuranceDetailForm.value.guardianCountry = Number(this.insuranceDetailForm.value.guardianCountry);
    this.insuranceDetailForm.value.guardianDistrict = Number(this.insuranceDetailForm.value.guardianDistrict);
    this.insuranceDetailForm.value.guardianState = Number(this.insuranceDetailForm.value.guardianState);
    this.insuranceDetailForm.value.guardianPincode = Number(this.insuranceDetailForm.value.guardianPincode);
    this.insuranceDetailForm.value.nomineeAge = Number(this.insuranceDetailForm.value.nomineeAge);
    this.insuranceDetailForm.value.nomineeCity = Number(this.insuranceDetailForm.value.nomineeCity);
    this.insuranceDetailForm.value.nomineeCountry = Number(this.insuranceDetailForm.value.nomineeCountry);
    this.insuranceDetailForm.value.nomineeDistrict = Number(this.insuranceDetailForm.value.nomineeDistrict);
    this.insuranceDetailForm.value.nomineePincode = Number(this.insuranceDetailForm.value.nomineePincode);
    this.insuranceDetailForm.value.nomineeState = Number(this.insuranceDetailForm.value.nomineeState);
    this.insuranceDetailForm.value.nomineeAge = Number(this.insuranceDetailForm.value.nomineeAge);
    this.insuranceDetailForm.value.usedCoverageAmount = Number(this.insuranceDetailForm.value.usedCoverageAmount);
    // this.insuranceDetailForm.value.creditShieldRequired = this.creditShieldRequired;
    // this.insuranceDetailForm.value.motorInsuranceRequired = this.motorShieldRequired;
    this.insuranceDetailForm.value.nomineeDOB = this.utilityService.getDateFormat(this.insuranceDetailForm.value.nomineeDOB);
    this.insuranceDetailForm.value.guardianDOB = this.utilityService.getDateFormat(this.insuranceDetailForm.value.guardianDOB);
    this.insuranceDetailForm.value.rtoCentre = this.rtoCenterName;
    const body = {
      leadId: this.leadId,
      applicantId: this.applicantId,
      isMinor: this.isMinor,
      userId: localStorage.getItem('userId'),

      insuranceDetails: {
        ...this.insuranceDetailForm.value
      },
      udfDetails: [{
        "udfGroupId": this.udfGroupId,
        // "udfScreenId": this.udfScreenId,
        "udfData": JSON.stringify(this.userDefineForm.udfData.getRawValue())
      }]

    };
    this.insuranceService.saveInsuranceDetails(body).subscribe((res: any) => {
      if (res && res.ProcessVariables.error.code == '0') {
        if (event == 'save') {
          this.toasterService.showSuccess('Record saved successfully', '');
          this.getInsuranceDetails();
        } else if (event == 'next') {
          this.toasterService.showSuccess('Record saved successfully', '');
          this.onNext();
        }
      } else {
        this.toasterService.showError(res.ProcessVariables.error.message, '');
      }
    });
  }

  checkOnCredit(event) {
    if (event == 'no') {
      this.applicantId = null;
      this.showCreditDetails = false;
      this.creditShieldRequired = false;
      this.removeValidations();
    } else if (event == 'yes') {
      this.showCreditDetails = true;
      this.creditShieldRequired = true;
      this.addValidations();
    }
  }
  checkOnMotor(event) {
      if (event === 'no') {
        // this.showCreditDetails = false;
        this.motorShieldRequired = false;
        this.isRtoCenter = true;
        this.f.controls.vehicleType.clearValidators();
        this.f.controls.vehicleType.updateValueAndValidity();
        this.f.controls.insuranceProvider.clearValidators();
        this.f.controls.insuranceProvider.updateValueAndValidity();
        this.f.controls.vehicleMake.clearValidators();
        this.f.controls.vehicleMake.updateValueAndValidity();
        this.f.controls.variant.clearValidators();
        this.f.controls.variant.updateValueAndValidity();
        this.f.controls.rtoCentre.clearValidators();
        this.f.controls.rtoCentre.updateValueAndValidity();
        this.f.controls.model.clearValidators();
        this.f.controls.model.updateValueAndValidity();
        this.f.controls.fuelType.clearValidators();
        this.f.controls.fuelType.updateValueAndValidity();
      } else if (event === 'yes') {
        // this.showCreditDetails = true;
        this.motorShieldRequired = true;
        this.f.controls.vehicleType.setValidators(Validators.required);
        this.f.controls.vehicleType.updateValueAndValidity();
        this.f.controls.insuranceProvider.setValidators(Validators.required);
        this.f.controls.insuranceProvider.updateValueAndValidity();
        this.f.controls.vehicleMake.setValidators(Validators.required);
        this.f.controls.vehicleMake.updateValueAndValidity();
        this.f.controls.variant.setValidators(Validators.required);
        this.f.controls.variant.updateValueAndValidity();
        this.f.controls.rtoCentre.setValidators(Validators.required);
        this.f.controls.rtoCentre.updateValueAndValidity();
        this.f.controls.model.setValidators(Validators.required);
        this.f.controls.model.updateValueAndValidity();
        this.f.controls.fuelType.setValidators(Validators.required);
        this.f.controls.fuelType.updateValueAndValidity();
      }
  }
  getPincode(pincode, event: string) {
    // const id = pincode.id;
    const pincodeValue = pincode.value;
    if (pincodeValue.length === 6) {
      const pincodeNumber = Number(pincodeValue);
      this.getPincodeResult(pincodeNumber, event, false);
      console.log('in get pincode', pincodeNumber);
    } else {
      this.invalidPincode = false;
    }
  }
  getPincodeResult(pincodeNumber: number, event: string, isGetApi: boolean) {
    console.log('event change', event);

    // this.invalidPincode = false;
    this.city = []; // clearing the array which contains previous city list
    this.state = []; // clearing the array which contains previous state list
    this.district = []; // clearing the array which contains previous district list
    this.country = [];  // clearing the array which contains previous country list
    this.applicantService
      .getGeoMasterValue({
        pincode: pincodeNumber,
      }).pipe(map((value: any) => {
        console.log('map value', value);

        // tslint:disable-next-line: no-string-literal
        
        console.log('in valid pincode', value.ProcessVariables);
          const addressList: any[] = value.ProcessVariables.GeoMasterView ? value.ProcessVariables.GeoMasterView : [];
          if (value['ProcessVariables'].error.code === '1') {
            this.invalidPincode = true;
            this.toasterService.showError('Invalid pincode', '');
            if(event === 'nominee') {
              this.insuranceDetailForm.controls.nomineePincode.reset();
              this.insuranceDetailForm.controls.nomineeState.reset();
              this.insuranceDetailForm.controls.nomineeDistrict.reset();
              this.insuranceDetailForm.controls.nomineeCountry.reset();
              this.insuranceDetailForm.controls.nomineeCity.reset();
            } else if(event === 'guardian') {
              this.insuranceDetailForm.controls.guardianPincode.reset();
              this.insuranceDetailForm.controls.guardianState.reset();
              this.insuranceDetailForm.controls.guardianDistrict.reset();
              this.insuranceDetailForm.controls.guardianCountry.reset();
              this.insuranceDetailForm.controls.guardianCity.reset();
            }
          } else {
          this.invalidPincode = false;
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
      ).subscribe((value: any) => {
        console.log('subscribe value', value);

        if (event === 'nominee') {
          // this.refererPincode = value;
          this.nomineeDetails = value;
          console.log(this.nomineeDetails);

          this.nomineeCity = value.city[0].key;
          this.nomineeState = value.state[0].key;
          this.nomineeDistrict = value.district[0].key;
          this.nomineeCountry = value.country[0].key;
          this.insuranceDetailForm.patchValue({
            nomineeCity: this.nomineeCity,
            nomineeDistrict: this.nomineeDistrict,
            nomineeState: this.nomineeState,
            nomineeCountry: this.nomineeCountry
          });

          if (isGetApi === true && this.nomineeCity != null) {
            this.f.patchValue({
              nomineeState: this.processVariables.nomineeState,
              nomineeCity: this.processVariables.nomineeCity,
              nomineeCountry: this.processVariables.nomineeCountry,
              nomineeDistrict: this.processVariables.nomineeDistrict,
            });
          }
        } else if (event === 'guardian') {
          
          this.gaurdianDetails = value;
          console.log(this.gaurdianDetails);

          this.gaurdianCity = value.city[0].key;
          this.gaurdianState = value.state[0].key;
          this.gaurdianDistrict = value.district[0].key;
          this.gaurdianCountry = value.country[0].key;
          // this.referencePincode = value;
          this.insuranceDetailForm.patchValue({
            guardianCity: value.city[0].key,
            guardianDistrict: value.district[0].key,
            guardianState: value.state[0].key,
            guardianCountry: value.country[0].key
          });
          if (isGetApi === true) {
            this.insuranceDetailForm.patchValue({
              guardianCity: this.processVariables.guardianCity,
              guardianCountry: this.processVariables.guardianCountry,
              guardianState: this.processVariables.guardianState,
              guardianDistrict: this.processVariables.guardianDistrict,
            });
          }
        }
        // console.log('res', value);
        // // tslint:disable-next-line: no-string-literal
        // if (value['ProcessVariables'].error.code === '0') {
        //   console.log('in valid pincode', value.ProcessVariables);
        //   // tslint:disable-next-line: no-string-literal
        //   this.invalidPincode = false;
        //   if (event === 'nominee') {
        //   const values = value.ProcessVariables.GeoMasterView;
        //   const state = [];
        //   const stateArray = {
        //     key: Number(values[0].stateId),
        //     value: values[0].stateName
        //   };
        //   state.push(stateArray);
        //   const district = [];
        //   const districtArray = {
        //     key: Number(values[0].districtId),
        //     value: values[0].districtName
        //   };
        //   district.push(districtArray);
        //   const country = [];
        //   const countryArray = {
        //     key: Number(values[0].countryId),
        //     value: values[0].country
        //   };
        //   country.push(countryArray);
        //   const city = [];
        //   values.map((element) => {
        //     const cityArray = {
        //       key: Number(element.cityId),
        //       value: element.cityName
        //     };
        //     city.push(cityArray);
        //   });
        //   console.log('in geo nominee', city, state, district, country);

        //   this.nomineeCity = [];
        //   this.nomineeState = [];
        //   this.nomineeDistrict = [];
        //   this.nomineeCountry = [];
        //   this.nomineeCity = city;
        //   this.nomineeState = state;
        //   this.nomineeDistrict = district;
        //   this.nomineeCountry = country;
        //   if ( isGetApi === true && city != null) {
        //     this.f.patchValue({
        //       nomineeState: this.processVariables.nomineeState,
        //       nomineeCity: this.processVariables.nomineeCity,
        //       nomineeCountry: this.processVariables.nomineeCountry,
        //       nomineeDistrict: this.processVariables.nomineeDistrict,
        //     });
        //   }
        //     } else if (event === 'guardian') {
        //       const values = value.ProcessVariables.GeoMasterView;
        //       const state = [];
        //       const stateArray = {
        //     key: Number(values[0].stateId),
        //     value: values[0].stateName
        //   };
        //       state.push(stateArray);
        //       const district = [];
        //       const districtArray = {
        //     key: Number(values[0].districtId),
        //     value: values[0].districtName
        //   };
        //       district.push(districtArray);
        //       const country = [];
        //       const countryArray = {
        //     key: Number(values[0].countryId),
        //     value: values[0].country
        //   };
        //       country.push(countryArray);
        //       const city = [];
        //       values.map((element) => {
        //     const cityArray = {
        //       key: Number(element.cityId),
        //       value: element.cityName
        //     };
        //     city.push(cityArray);
        //   });
        //       console.log('in geo guardian', city, state, district, country);
        //       this.gaurdianCity = [];
        //       this.gaurdianState = [];
        //       this.gaurdianDistrict = [];
        //       this.gaurdianCountry = [];
        //       this.gaurdianCity = city;
        //       this.gaurdianState = state;
        //       this.gaurdianDistrict = district;
        //       this.gaurdianCountry = country;
        //       if (isGetApi === true) {
        //         this.f.patchValue({
        //           guardianCity: this.processVariables.guardianCity,
        //           guardianCountry: this.processVariables.guardianCountry,
        //           guardianState: this.processVariables.guardianState,
        //           guardianDistrict: this.processVariables.guardianDistrict,
        //         });
        //       }
        //     }

        //   // tslint:disable-next-line: no-string-literal
        // } else if (value['ProcessVariables'].error.code === '1') {
        //   if (value.ProcessVariables.error.message && value.ProcessVariables.error.message != null) {
        //     const message = value.ProcessVariables.error.message;
        //     this.toasterService.showWarning('', message);
        //     this.invalidPincode = true;
        //   } else {
        //     this.invalidPincode = true;

        //   }

        // }
      });

  }
  public selectApplicant(event: any) {
    // this.applicantId = event.id;
    this.applicantList.filter((element: any) => {
      const control = this.insuranceDetailForm as FormGroup;
      if (element.key == event) {
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
    const nomineeFirstName = this.f.controls.nomineeFirstName.value ? this.f.controls.nomineeFirstName.value + ' ' : '';
    const nomineeLastName = this.f.controls.nomineeLastName.value ? this.f.controls.nomineeLastName.value : '';
    const nomineeMiddleName = this.f.controls.nomineeMiddleName.value ? this.f.controls.nomineeMiddleName.value + ' ' : '';
    const fullName = nomineeFirstName + '' + nomineeMiddleName + '' + nomineeLastName;
    this.f.patchValue({
      nomineeFullName: fullName
    });
  }
  public concatguardianName() {
    this.f.controls.guardianFullName.reset();
    const guardianFirstName = this.f.controls.guardianFirstName.value ? this.f.controls.guardianFirstName.value + '' : '';
    const guardianLastName = this.f.controls.guardianLastName.value ? this.f.controls.guardianLastName.value + '' : '';
    const guardianMiddleName = this.f.controls.guardianMiddleName.value ? this.f.controls.guardianMiddleName.value + ' ' : '';
    const fullName = guardianFirstName + ' ' + guardianMiddleName + ' ' + guardianLastName;
    this.f.patchValue({
      guardianFullName: fullName
    });

  }
  public ageCalculation(date, relation: string) {
    this.isNomineeInvalid = false;
    if (date == null || date == undefined) {
      this.isNomineeInvalid = true;
      return;
    }
    console.log('date full year', date.getFullYear());
    const dateYear = date.getFullYear().toString();
    if (dateYear.length === 4) {
      setTimeout(() => {
        const event = this.calculateAgeInYears(this.utilityService.getDateFormat(date));
        console.log('testing date', event);
        if (relation === 'nominee' && (event > 0 && event <= 100)) {

          this.f.patchValue({
            nomineeAge: event
          });
          this.enableDisableGuardian(event);
        } else if (relation === 'nominee' && (event <= 0 || event > 100)) {
          this.isNomineeInvalid = true;
          this.f.controls.nomineeDOB.reset();
          this.f.controls.nomineeAge.reset();

          // this.toasterService.showError('Please enter guardian age greater than 18', '');
        } else if (relation === 'guardian' && (event < 18 || event > 100)) {
          this.f.controls.guardianDOB.reset();
          this.toasterService.showError('Please enter guardian age greater than 18', '');
        }

      }, 2000);

    }

  }
  public calculateAgeInYears(date) {
    if (date) {
      let now = new Date();
      now = this.utilityService.setTimeForDates(now)
      const toDayDate = this.utilityService.getDateFromString(
        date
      );
      // tslint:disable-next-line: variable-name
      const current_year = now.getFullYear();
      const yearDiff = current_year - toDayDate.getFullYear();
      // const birthdayThisyear = new Date(toDayDate.getFullYear(), toDayDate.getMonth(), toDayDate.getDate());
      // const age = (now >= birthdayThisyear);
      // console.log('age', age)

      // return age
      //   ? yearDiff
      //   : yearDiff - 1;
      return yearDiff;
    }
  }

  public addValidations() {

    if (this.creditShieldRequired === true) {
      const control = this.f as FormGroup;
      this.guardianArray = [];
      this.nomineeArray = [];
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
      this.f.controls.nameOfCreditShieldPolicy.setValidators(Validators.required);
      this.f.controls.nameOfCreditShieldPolicy.updateValueAndValidity();
      this.f.controls.typeOfApplicant.setValidators(Validators.required);
      this.f.controls.typeOfApplicant.updateValueAndValidity();
      this.f.controls.usedCoverageAmount.setValidators(Validators.required);
      this.f.controls.usedCoverageAmount.updateValueAndValidity();
      this.f.controls.healthQuestion.setValidators(Validators.required);
      this.f.controls.healthQuestion.updateValueAndValidity();

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.nomineeArray.length; i++) {

        const nomineeKey = this.nomineeArray[i];
        if (nomineeKey == 'nomineeAddLine2' || nomineeKey == 'nomineeAddLine3' || nomineeKey == 'nomineeFullName' ||
          nomineeKey == 'nomineeMiddleName' || nomineeKey == 'nomineeMobileNumber') {
          this.f.controls[nomineeKey].clearValidators();
          this.f.controls[nomineeKey].updateValueAndValidity();
          console.log(nomineeKey, 'value in nominee   array');
        } else {
          this.f.controls[nomineeKey].setValidators(Validators.required);
          this.f.controls[nomineeKey].updateValueAndValidity();
        }

      }
      if (this.f.value.nomineeAge <= 17) {
        this.isMinor = true;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.guardianArray.length; i++) {
          const guardianKey = this.guardianArray[i];
          if (guardianKey == 'guardianAddLine2' || guardianKey == 'guardianAddLine3' || guardianKey == 'guardianFullName' ||
            guardianKey == 'guardianMiddleName' || guardianKey == 'guardianMobileNumber') {
            console.log(this.guardianArray[i], 'value in nominee array');
            this.f.controls[guardianKey].clearValidators();
            this.f.controls[guardianKey].updateValueAndValidity();

          } else {
            this.f.controls[guardianKey].setValidators(Validators.required);
            this.f.controls[guardianKey].updateValueAndValidity();
          }

        }
      } else {
        this.isMinor = false;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.guardianArray.length; i++) {
          const guardianKey = this.guardianArray[i];
          this.f.controls[guardianKey].clearValidators();
          this.f.controls[guardianKey].updateValueAndValidity();
        }
      }
    }
  }

  public removeValidations() {

    if (this.creditShieldRequired === false) {
      const control = this.f as FormGroup;
      this.guardianArray = [];
      this.nomineeArray = [];
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
      this.f.controls.nameOfCreditShieldPolicy.clearValidators();
      this.f.controls.nameOfCreditShieldPolicy.updateValueAndValidity();
      this.f.controls.typeOfApplicant.clearValidators();
      this.f.controls.typeOfApplicant.updateValueAndValidity();
      this.f.controls.usedCoverageAmount.clearValidators();
      this.f.controls.usedCoverageAmount.updateValueAndValidity();
      this.f.controls.healthQuestion.clearValidators();
      this.f.controls.healthQuestion.updateValueAndValidity();

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.nomineeArray.length; i++) {

        const nomineeKey = this.nomineeArray[i];

        this.f.controls[nomineeKey].clearValidators();
        this.f.controls[nomineeKey].updateValueAndValidity();
        console.log(nomineeKey, 'value in nominee   array');

      }

      this.isMinor = false;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.guardianArray.length; i++) {
        const guardianKey = this.guardianArray[i];

        this.f.controls[guardianKey].clearValidators();
        this.f.controls[guardianKey].updateValueAndValidity();


      }

    }
  }
  getInsuranceDetails() {
    const body = {
      leadId: this.leadId,
      udfDetails: [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ],
    };
    this.insuranceService.getInsuranceDetails(body).subscribe((res: any) => {
      console.log(res, 'res in get');
      if (res && res.ProcessVariables.error.code === '0') {
        this.processVariables = res.ProcessVariables.insuranceDetails;
        this.healthQuestionAns = res.ProcessVariables.healthQuestions;
        this.udfDetails = res.ProcessVariables.udfDetails;
        this.covidQuestions = res.ProcessVariables.covidQuestions;
        if (this.processVariables) {
          if (this.motar == 'yes' && this.processVariables.insuranceProvider != null) {
            this.getInsuranceProvider();
            this.f.patchValue({
              insuranceProvider: this.processVariables.insuranceProvider
            });
            this.onChangeInsuranceprovider(null, 'insProvider');
            this.f.patchValue({
              vehicleType: this.processVariables.vehicleType
            });

            this.onChangeInsuranceprovider(this.processVariables.vehicleType, 'vehicleType');
            this.f.patchValue({
              vehicleMake: this.processVariables.vehicleMake,
            });
            this.onChangeInsuranceprovider(this.processVariables.vehicleMake, 'vehicleMake');
            this.f.patchValue({
              model: this.processVariables.model,
            });
            this.onChangeInsuranceprovider(this.processVariables.model, 'vehicleModel');
            this.f.patchValue({
              variant: this.processVariables.variant,
            });
            this.onChangeInsuranceprovider(this.processVariables.variant, 'vehicleVariant');
            this.f.patchValue({
              fuelType: this.processVariables.fuelType
            });
            // this.getRtoDetails(this.processVariables.rtoCentre, true);
            this.f.patchValue({
              rtoCentre: this.processVariables.rtoCentre,
            });
            this.selectRtoEvent(res.ProcessVariables.aRtoCentre);

          }
          this.selectApplicant(this.processVariables.nameOfCreditShieldPolicy);
          if (this.processVariables.nomineePincode != null && this.processVariables.nomineePincode != undefined) {
            this.getPincodeResult(this.processVariables.nomineePincode, 'nominee', true);
          }
          if (this.processVariables.guardianPincode != null && this.processVariables.guardianPincode != undefined) {
            this.getPincodeResult(this.processVariables.guardianPincode, 'guardian', true);
          }

          this.checkOnCredit(this.returnYesOrNo(this.processVariables.creditShieldRequired));
          this.checkOnMotor(this.returnYesOrNo(this.processVariables.motorInsuranceRequired));
          // this.getPincode(this.processVariables.nomineePincode, 'nominee');

          this.f.patchValue({
            nameOfCreditShieldPolicy: this.processVariables.nameOfCreditShieldPolicy,
            creditShieldRequired: this.returnYesOrNo(this.processVariables.creditShieldRequired),
            guardianAddLine1: this.processVariables.guardianAddLine1,
            guardianAddLine2: this.processVariables.guardianAddLine2,
            guardianAddLine3: this.processVariables.guardianAddLine3,

            guardianDOB: this.utilityService.getDateFromString(this.processVariables.guardianDOB),

            guardianFirstName: this.processVariables.guardianFirstName,
            guardianFullName: this.processVariables.guardianFullName,
            guardianLastName: this.processVariables.guardianLastName,
            guardianMiddleName: this.processVariables.guardianMiddleName,
            guardianPincode: this.processVariables.guardianPincode,
            guardianRelationWithApp: this.processVariables.guardianRelationWithApp,

            guardianMobileNumber: this.processVariables.guardianMobileNumber,
            nomineeMobileNumber: this.processVariables.nomineeMobileNumber,
            motorInsuranceRequired: this.returnYesOrNo(this.processVariables.motorInsuranceRequired),
            nomineeAddLine1: this.processVariables.nomineeAddLine1,
            nomineeAddLine2: this.processVariables.nomineeAddLine2,
            nomineeAddLine3: this.processVariables.nomineeAddLine3,
            nomineeAge: this.processVariables.nomineeAge,

            nomineeDOB: this.utilityService.getDateFromString(this.processVariables.nomineeDOB),

            nomineeFirstName: this.processVariables.nomineeFirstName,
            nomineeFullName: this.processVariables.nomineeFullName,
            nomineeLastName: this.processVariables.nomineeLastName,
            nomineeMiddleName: this.processVariables.nomineeMiddleName,
            nomineePincode: this.processVariables.nomineePincode,
            nomineeRelationWithApp: this.processVariables.nomineeRelationWithApp,

            typeOfApplicant: this.processVariables.typeOfApplicant,
            usedCoverageAmount: this.processVariables.usedCoverageAmount,
            healthQuestion: this.processVariables.healthQuestion,
            guarantorGender: this.processVariables.guarantorGender,
            nomineeGender: this.processVariables.nomineeGender,
          });
          // this.ageCalculation(this.processVariables.nomineeDOB, 'nominee');

          this.enableDisableGuardian(this.processVariables.nomineeAge);
        } else {
          this.checkOnCredit(this.flag);
          this.checkOnMotor(this.motar);
        }
      }
    });
  }

  returnYesOrNo(event: string) {
    if (event == 'yes') {
      return 'yes';
    } else if (event == 'no') {
      return 'no';
    }
  }
  onNext() {
    this.router.navigate([`pages/dde/${this.leadId}/cam`]);
  }
  onBack() {
    this.router.navigate([`pages/dde/${this.leadId}/score-card`]);
  }
  enableDisableGuardian(event) {
    // alert('age' + event);
    if (event <= 17 && this.creditShieldRequired == true) {
      this.isShowGuardian = true;
    } else {
      this.isShowGuardian = false;
    }
  }
  getInsuranceProvider() {
    const body = {};
    this.insuranceService.getMotorInsuranceProviderDetails(body).subscribe((res: any) => {
      console.log('insurance provider', res);
      let itemList: Array<any> = res.ProcessVariables.insuranceLOV;
      this.insuranceProviderList = this.utilityService.getValueFromJSON(
        itemList.filter(val => val.productCatCode == this.productCode && val.insProvider != 'NOT REQUIRED'),
        'insProUniqCode', 'insProvider');
      console.log('insurance lov list', this.insuranceProviderList);
      // }
    });
  }

  onChangeInsuranceprovider(event, lovType) {

    this.getInsuranceMasterDetails(event, lovType);
  }
  getInsuranceMasterDetails(event, lovType) {
    if (lovType == 'vehicleType') {
      // calling api for vehicle make
      this.insuranceDetailForm.controls.vehicleMake.reset();
      this.vehicleMakeList = [];
      const body = {
        vehicleType: event
      };
      console.log('body for insprovider lovtype', body);
      this.insuranceService.getInsuranceMasterDetails(body).subscribe((res: any) => {
        console.log(res, ' res for vehicle make');
        res.ProcessVariables.insuranceVehMstDetails.map((element) => {
          // tslint:disable-next-line: no-shadowed-variable
          const body = {
            key: element.makeCode,
            value: element.makeName
          };
          this.vehicleMakeList.push(body);
        });
        console.log('vehicle make', this.vehicleMakeList);
      });
    } else if (lovType == 'insProvider') {
      // calling api to get vehicle type
      this.insuranceDetailForm.controls.vehicleType.reset();
      this.vehicleTypeList = [];
      const body = {
        leadId: this.leadId
      };
      console.log('body for vehicle make lovtype', body);
      this.insuranceService.getInsuranceMasterDetails(body).subscribe((res: any) => {
        console.log(res, ' res for vehicle type');
        res.ProcessVariables.insuranceVehMstDetails.map((element) => {
          // tslint:disable-next-line: no-shadowed-variable
          const body = {
            key: element.bodyTypeCode,
            value: element.bodyTypeName
          };
          this.vehicleTypeList.push(body);
        });

        console.log('vehicle type', this.vehicleTypeList);
      });
      // })
    } else if (lovType == 'vehicleMake') {
      // calling api to get vehicle model
      this.insuranceDetailForm.controls.model.reset();
      this.modelList = [];
      const control = this.insuranceDetailForm.value;

      const body = {
        vehicleMake: event,
        vehicleType: control.vehicleType
      };
      console.log('body for vehicle type lovtype', body);
      this.insuranceService.getInsuranceMasterDetails(body).subscribe((res: any) => {
        console.log(res, ' res for vehicle model');
        this.rtoCentreList = res.ProcessVariables.rtoLocationList;
        console.log('rtoLocationList', this.rtoCentreList);

        res.ProcessVariables.insuranceVehMstDetails.map((element) => {
          const body = {
            key: element.modelCode,
            value: element.modelName
          };
          this.modelList.push(body);
        });

        console.log('vehicle model', this.modelList);
      });
      // })
    } else if (lovType == 'vehicleModel') {
      // calling api to get vehicle variant
      this.insuranceDetailForm.controls.variant.reset();
      this.variantList = [];
      const control = this.insuranceDetailForm.value;
      const body = {
        vehicleMake: control.vehicleMake,
        vehicleType: control.vehicleType,
        vehicleModel: event
      };
      console.log('body for vehicle model lovtype', body);
      this.insuranceService.getInsuranceMasterDetails(body).subscribe((res: any) => {
        console.log(res, ' res for vehicle variant');
        res.ProcessVariables.insuranceVehMstDetails.map((element) => {
          const body = {
            key: element.variant,
            value: element.variant
          };
          this.variantList.push(body);
        });
        console.log('vehicle variant ', this.variantList);
        // });
      });
    } else if (lovType == 'vehicleVariant') {
      // calling api to get vehicle fuel type
      this.insuranceDetailForm.controls.fuelType.reset();
      this.fuelTypeList = [];
      const control = this.insuranceDetailForm.value;
      const body = {
        vehicleMake: control.vehicleMake,
        vehicleType: control.vehicleType,
        vehicleModel: control.model,
        variant: event
      };
      console.log('body for vehicle variant lovtype', body);
      this.insuranceService.getInsuranceMasterDetails(body).subscribe((res: any) => {
        console.log(res, ' res for fuel type');
        res.ProcessVariables.insuranceVehMstDetails.map((element) => {
          const body = {
            key: element.fuelType,
            value: element.fuelType
          };
          this.fuelTypeList.push(body);
        });
        console.log('vehicle variant ', this.fuelTypeList);

      });
    }

  }
  getRtoDetails(event: string, isGetApi?: boolean) {
    this.isRtoCenter = false;
    if (event.length >= 4) {
      const body = {
        vehicleType: this.f.value.vehicleType,
        rtoCode: event
      };
      this.insuranceService.getInsuranceRtoDetails(body).subscribe((res: any) => {
        console.log('rto', res);
        if (isGetApi != true) {
          this.rtoCentreList = res.ProcessVariables.rtoCentreList;
        }

        console.log('rto center', this.rtoCentreList);
        if (isGetApi == true && this.rtoCentreList != null) {
          this.f.patchValue({
            rtoCentre: this.processVariables.rtoCode,
          });
          // this.isRtoCenter = true;
          // this.selectRtoEvent(this.rtoCentreList[0]);
        }
      });
    }
  }

  selectRtoEvent(event) {
    this.isRtoCenter = event.key ? true : false;
    this.rtoCenterName = event ? event.key : null;
  }

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value)
  }

}
