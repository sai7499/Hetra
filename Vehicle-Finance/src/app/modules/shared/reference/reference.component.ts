import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { LabelsService } from 'src/app/services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';
import { ToastrService } from 'ngx-toastr';
import { ObjectComparisonService } from '@services/obj-compare.service';
import { ToasterService } from '@services/toaster.service';

import { LoanViewService } from '@services/loan-view.service';
import { ToggleDdeService } from '@services/toggle-dde.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit {

  referenceForm: FormGroup;
  lovLabels: any = [];
  labels: any = {};
  LOV: any = [];

  leadId: number;

  namePattern: string;
  nameLength: number;
  mobileLength: number;
  refOnefirstName: string;
  refOnemiddleName: string;
  refOnelastName: string;
  refOnefullName: string;
  refTwofullName: string;
  refTwofirstName: string;
  refTwomiddleName: string;
  refTwolastName: string;
  validationData: any;
  currentUrl: string;

  refOnePincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };
  refTwoPincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };

  refOneBool: boolean;
  refTwoBool: boolean;
  isSavedNext: boolean;
  refOnePincodeDummy: string;
  refTwoPincodeDummy: string;
  isDirty: boolean;
  refOneId: any;
  refTwoId: any;
  responseData: any = [];
  mobileOneErrorMsg: string;
  mobileTwoErrorMsg: string;
  isMobileOneErrorMsg: boolean;
  isMobileTwoErrorMsg: boolean;
  relationShipLOV: any = [];

  applicantReferences: [
    {
      id: number,
      firstName: string,
      middleName: string,
      lastName: string,
      fullName?: string,
      addLine1: string,
      addLine2: string,
      addLine3: string,
      pincode: number,
      district: number,
      state: number,
      country: number,
      city: number,
      phoneNumber: string,
      relationWithApplicant: string
    },
    {
      id: number,
      firstName: string,
      middleName: string,
      lastName: string,
      fullName?: string,
      addLine1: string,
      addLine2: string,
      addLine3: string,
      pincode: number,
      district: number,
      state: number,
      country: number,
      city: number,
      phoneNumber: string,
      relationWithApplicant: string
    }
  ];

  testt: string;
  apiValue: any;
  finalValue: any;
  isLoan360: boolean;
  udfDetails: any = [];
  userDefineForm: any;
  udfScreenId: any;
  udfGroupId: any;
  initUDFValues: any;
  editedUDFValues: any;

  isViewDde: boolean;

  constructor(
    private commonLovService: CommomLovService,
    private labelsData: LabelsService,
    private activatedRoute: ActivatedRoute,
    private applicantService: ApplicantService,
    private toasterService: ToastrService,
    private toasterServiceInfo: ToasterService,
    private location: Location,
    private router: Router,
    private objectComparisonService: ObjectComparisonService,
    private loanViewService: LoanViewService,
    private toggleDdeService: ToggleDdeService
  ) {
    this.refOnefirstName = '';
    this.refOnemiddleName = '';
    this.refOnelastName = '';
    this.refTwofirstName = '';
    this.refTwomiddleName = '';
    this.refTwolastName = '';
    this.namePattern = 'alpha-nospace';

    this.mobileOneErrorMsg = 'Mobile No. required';
    this.mobileTwoErrorMsg = 'Mobile No. required';


    this.refOneBool = true;
    this.refTwoBool = true;
    this.isSavedNext = true;
  }


  async ngOnInit() {
    this.isViewDde = this.toggleDdeService.getOperationType();
    
    this.isLoan360 = this.loanViewService.checkIsLoan360();
    this.initForm();
    this.currentUrl = this.location.path();
    
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      if (this.currentUrl.includes('sales')) {
        this.udfGroupId = 'RDG001'
        this.udfScreenId = udfScreenId.ADE.leadReferenceADE;
      } else if (this.currentUrl.includes('dde')) {
        this.udfGroupId = 'RDG001'
        this.udfScreenId = udfScreenId.DDE.leadReferenceDDE;
      }
    })
    if (this.currentUrl) {
      this.leadId = (await this.getLeadId()) as number;
    };

    this.getLabels();
    this.getLOV();
  }

  initForm() {
    this.referenceForm = new FormGroup({
      refOneFirstName: new FormControl('', Validators.required),
      refOneMiddleName: new FormControl(''),
      refOneLastName: new FormControl('', Validators.required),
      refOneFullName: new FormControl({ value: '', disabled: true }),
      refOneAddressLineOne: new FormControl('', Validators.required),
      refOneAddressLineTwo: new FormControl(''),
      refOneAddressLineThree: new FormControl(''),
      refOnePincode: new FormControl('', Validators.required),
      refOneCity: new FormControl('', Validators.required),
      refOneDistrict: new FormControl('', Validators.required),
      refOneState: new FormControl('', Validators.required),
      refOneCountry: new FormControl('', Validators.required),
      refOnePhoneNumber: new FormControl('', Validators.required),
      refOneRelationship: new FormControl(''),

      refTwoFirstName: new FormControl('', Validators.required),
      refTwoMiddleName: new FormControl(''),
      refTwoLastName: new FormControl('', Validators.required),
      refTwoFullName: new FormControl({ value: '', disabled: true }),
      refTwoAddressLineOne: new FormControl('', Validators.required),
      refTwoAddressLineTwo: new FormControl(''),
      refTwoAddressLineThree: new FormControl(''),
      refTwoPincode: new FormControl('', Validators.required),
      refTwoCity: new FormControl('', Validators.required),
      refTwoDistrict: new FormControl('', Validators.required),
      refTwoState: new FormControl('', Validators.required),
      refTwoCountry: new FormControl('', Validators.required),
      refTwoPhoneNumber: new FormControl('', Validators.required),
      refTwoRelationship: new FormControl(''),
    });
  }

  getLOV() {
    this.commonLovService.getLovData().subscribe((lov: any) => {
      this.LOV = lov;
      const relationLOV = lov.LOVS.relationship;
      relationLOV.map((data) => {
        if (data.key !== '5RELATION') {
          const relationShip = {
            key: data.key,
            value: data.value
          }
          this.relationShipLOV.push(relationShip);
        }
      });
      this.getReferencesData();
    });
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.nameLength = data.validationData.name.maxLength;
        this.mobileLength = data.validationData.mobileNumber.maxLength;
        this.validationData = data.validationData;
      },
      (error) => console.log('Lead Creation Label Error', error)
    );

  }

  onRefOneFirstName(event) {
    this.refOnefirstName = event.target.value;
    this.refOnefirstName = this.refOnefirstName.replace(/[^a-zA-Z ]/g, '');
  }

  onRefOneMiddleName(event) {
    this.refOnemiddleName = event.target.value;
    this.refOnemiddleName = this.refOnemiddleName.replace(/[^a-zA-Z ]/g, '');
  }

  onRefOneLastName(event) {
    this.refOnelastName = event.target.value;
    this.refOnelastName = this.refOnelastName.replace(/[^a-zA-Z ]/g, '');
  }

  onRefTwoFirstName(event) {
    this.refTwofirstName = event.target.value;
    this.refTwofirstName = this.refTwofirstName.replace(/[^a-zA-Z ]/g, '');
  }

  onRefTwoMiddleName(event) {
    this.refTwomiddleName = event.target.value;
    this.refTwomiddleName = this.refTwomiddleName.replace(/[^a-zA-Z ]/g, '');
  }

  onRefTwoLastName(event) {
    this.refTwolastName = event.target.value;
    this.refTwolastName = this.refTwolastName.replace(/[^a-zA-Z ]/g, '');
  }

  onRefTwoMobile(event) {
    const refTwoMobileNo = event.target.value;
    const refOneMobileNo = this.referenceForm.controls.refOnePhoneNumber.value;
    if (refOneMobileNo === refTwoMobileNo) {
      this.isMobileOneErrorMsg = true;
      this.mobileOneErrorMsg = 'Mobile No. should not same as Reference 1 Mobile No.';
    } else {
      this.isMobileOneErrorMsg = false;
      this.isMobileTwoErrorMsg = false;
    }
  }

  onRefOneMobile(event) {
    const refOneMobileNo = event.target.value;
    const refTwoMobileNo = this.referenceForm.controls.refTwoPhoneNumber.value;
    if (refTwoMobileNo === refOneMobileNo) {
      this.isMobileTwoErrorMsg = true;
      this.mobileTwoErrorMsg = 'Mobile No. should not same as Reference 2 Mobile No.';
    } else {
      this.isMobileTwoErrorMsg = false;
      this.isMobileOneErrorMsg = false;
    }
  }

  inputPincode(event) {
    const value = event.target.value;
    const id = event.target.id;
    if (value.length === 6) {
      const ref = (id === 'refOnePincode_id') ? this.refOnePincodeDummy : this.refTwoPincodeDummy;
      if (ref !== value) {
        this.getPincodeResult(Number(value), id);
      }
    }
  }

  getPincodeResult(pincode: number, id: string) {
    this.applicantService.getGeoMasterValue({ pincode })
      .pipe(
        map((value: any) => {
          const processVariables = value.ProcessVariables;
          const referenceList: any[] = processVariables.GeoMasterView;
          console.log('referenceList', referenceList);
          // if(!this.responseData){
          //   return;
          // }
          if (value.Error !== '0') {
            return null;
          }
          const ref = referenceList[0];
          console.log('ref', ref);
          const obj = {
            state: [
              {
                key: ref.stateId,
                value: ref.stateName,
              },
            ],
            district: [
              {
                key: ref.districtId,
                value: ref.districtName,
              },
            ],
            country: [
              {
                key: ref.countryId,
                value: ref.country,
              },
            ],
          };
          const city = referenceList.map((val) => {
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
      ).subscribe((data) => {

        console.log('referencePincodeData', data);
        if (id === 'refOnePincode_id') {
          this.refOnePincodeDummy = String(pincode);
          this.referenceForm.patchValue({ refOneCountry: '' });
          this.referenceForm.patchValue({ refOneState: '' });
          this.referenceForm.patchValue({ refOneDistrict: '' });
          this.referenceForm.patchValue({ refOneCity: '' });
          this.refOnePincode = data;
          const country = this.refOnePincode.country;
          const state = this.refOnePincode.state;
          const district = this.refOnePincode.district;

          if (country && country.length === 1) {
            this.referenceForm.patchValue({ refOneCountry: country[0].key });
          }
          if (state && state.length === 1) {
            this.referenceForm.patchValue({ refOneState: state[0].key });
          }
          if (district && district.length === 1) {
            this.referenceForm.patchValue({ refOneDistrict: district[0].key });
          }
          if (this.responseData) {
            if (this.responseData[0] && this.refOneBool) {
              this.referenceForm.patchValue({
                refOneCity: this.responseData[0].city,
              });
              this.refOneBool = false;
            }
          }

        } else {
          this.refTwoPincodeDummy = String(pincode);
          this.referenceForm.patchValue({ refTwoCountry: '' });
          this.referenceForm.patchValue({ refTwoState: '' });
          this.referenceForm.patchValue({ refTwoDistrict: '' });
          this.referenceForm.patchValue({ refTwoCity: '' });
          this.refTwoPincode = data;
          const country = this.refTwoPincode.country;
          const state = this.refTwoPincode.state;
          const district = this.refTwoPincode.district;

          if (country && country.length === 1) {
            this.referenceForm.patchValue({ refTwoCountry: country[0].key });
          }
          if (state && state.length === 1) {
            this.referenceForm.patchValue({ refTwoState: state[0].key });
          }
          if (district && district.length === 1) {
            this.referenceForm.patchValue({ refTwoDistrict: district[0].key });
          }
          if (this.responseData) {
            if (this.responseData[1] && this.refTwoBool) {
              this.referenceForm.patchValue({
                refTwoCity: this.responseData[1].city,
              });
              this.refTwoBool = false;
            }
          }

        }

        this.apiValue = this.referenceForm.getRawValue();
      });
  }

  getReferencesData() {
    const udfData= {
        udfGroupId: this.udfGroupId,
    }
    this.applicantService.getApplicantReference(this.leadId, udfData)
      .subscribe(
        (res: any) => {
          const response = res;
          const appiyoError = response.Error;
          const apiError = response.ProcessVariables.error.code;
          this.responseData = [];

          if (appiyoError === '0' && apiError === '0') {
            console.log('FetchApplicantReference', response.ProcessVariables);
            this.udfDetails = response.ProcessVariables.udfDetails;
            this.responseData = response.ProcessVariables.ApplicantReference;
            if (this.responseData != null && this.responseData.length > 0) {
              this.refOneId = response.ProcessVariables.ApplicantReference[0].id;
              this.refTwoId = response.ProcessVariables.ApplicantReference[1].id;
              console.log('refID', this.refOneId, this.refTwoId);

              const refOne = 'refOnePincode_id';
              const refOnecode = this.responseData[0].pincode;
              const refTwo = 'refTwoPincode_id';
              const refTwocode = this.responseData[1].pincode;
              this.getPincodeResult(refOnecode, refOne);
              this.getPincodeResult(refTwocode, refTwo);

              this.referenceForm.patchValue({
                refOneFirstName: this.responseData[0].firstName,
                refOneMiddleName: (this.responseData[0].middleName == null) ? '' : this.responseData[0].middleName,
                refOneLastName: (this.responseData[0].lastName == null) ? '' : this.responseData[0].lastName,
                // refOneFullName: this.responseData[0].fullName,
                refOneAddressLineOne: this.responseData[0].addLine1,
                refOneAddressLineTwo: this.responseData[0].addLine2,
                refOneAddressLineThree: this.responseData[0].addLine3,
                refOnePincode: this.responseData[0].pincode,
                refOnePhoneNumber: this.responseData[0].phoneNumber,
                refOneRelationship: this.responseData[0].relationWithApplicant,

                refTwoFirstName: this.responseData[1].firstName,
                refTwoMiddleName: (this.responseData[1].middleName == null) ? '' : this.responseData[1].middleName,
                refTwoLastName: (this.responseData[1].lastName == null) ? '' : this.responseData[1].lastName,
                // refTwoFullName: this.responseData[1].fullName,
                refTwoAddressLineOne: this.responseData[1].addLine1,
                refTwoAddressLineTwo: this.responseData[1].addLine2,
                refTwoAddressLineThree: this.responseData[1].addLine3,
                refTwoPincode: this.responseData[1].pincode,
                refTwoPhoneNumber: this.responseData[1].phoneNumber,
                refTwoRelationship: this.responseData[1].relationWithApplicant
              });

              this.refOnefirstName = `${this.responseData[0].firstName}`;
              this.refOnemiddleName = `${(this.responseData[0].middleName == null) ? '' : this.responseData[0].middleName}`;
              this.refOnelastName = `${(this.responseData[0].lastName == null) ? '' : this.responseData[0].lastName}`;

              this.refTwofirstName = `${this.responseData[1].firstName}`;
              this.refTwomiddleName = `${(this.responseData[1].middleName == null) ? '' : this.responseData[1].middleName}`;
              this.refTwolastName = `${(this.responseData[1].lastName == null) ? '' : this.responseData[1].lastName}`;
            }
            console.log('hello')

          } else {
            const message = response.ProcessVariables.error.message;
            this.toasterService.error(message, 'Reference Details');
          }
          if (this.isViewDde) {
            this.referenceForm.disable();
          }
          if (this.loanViewService.checkIsLoan360()) {
            this.referenceForm.disable();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  onSubmit() {
    const formValue = this.referenceForm.getRawValue();
    console.log('referenceformValue', formValue);
    this.isDirty = true;
    const isUDFInvalid= this.userDefineForm?  this.userDefineForm.udfData.invalid : false;
    if (this.referenceForm.valid === true
      && !this.isMobileOneErrorMsg
      && !this.isMobileOneErrorMsg 
      && !isUDFInvalid) {
      const data: any = { ...formValue };
      this.applicantReferences = [
        {
          id: (this.refOneId) ? this.refOneId : 0,
          firstName: data.refOneFirstName,
          middleName: data.refOneMiddleName,
          lastName: data.refOneLastName,
          addLine1: data.refOneAddressLineOne,
          addLine2: data.refOneAddressLineTwo,
          addLine3: data.refOneAddressLineThree,
          pincode: Number(data.refOnePincode),
          district: Number(data.refOneDistrict),
          state: Number(data.refOneState),
          country: Number(data.refOneCountry),
          city: Number(data.refOneCity),
          phoneNumber: data.refOnePhoneNumber,
          relationWithApplicant: data.refOneRelationship
        },
        {
          id: (this.refTwoId) ? this.refTwoId : 0,
          firstName: data.refTwoFirstName,
          middleName: data.refTwoMiddleName,
          lastName: data.refTwoLastName,
          addLine1: data.refTwoAddressLineOne,
          addLine2: data.refTwoAddressLineTwo,
          addLine3: data.refTwoAddressLineThree,
          pincode: Number(data.refTwoPincode),
          district: data.refTwoDistrict,
          state: data.refTwoState,
          country: data.refTwoCountry,
          city: Number(data.refTwoCity),
          phoneNumber: data.refTwoPhoneNumber,
          relationWithApplicant: data.refTwoRelationship
        }
      ];

      const udfData = this.userDefineForm? JSON.stringify(this.userDefineForm.udfData.getRawValue()) : "";
      const udf ={
        "udfGroupId": this.udfGroupId,
        //"udfScreenId": this.udfScreenId,
        "udfData": udfData
      }

      console.log('applicantReference', this.applicantReferences);
      this.applicantService.saveUpdateApplicantReference(this.leadId, this.applicantReferences, udf)
        .subscribe(
          (res: any) => {
            const response = res;
            const appiyoError = response.Error;
            const apiError = response.ProcessVariables.error.code;

            if (appiyoError === '0' && apiError === '0') {
              this.refOneId = response.ProcessVariables.applicantReferences[0].id;
              this.refTwoId = response.ProcessVariables.applicantReferences[1].id;
              this.toasterService.success('Record saved successfully', 'Reference Details');
              this.isSavedNext = false;
              this.apiValue = this.referenceForm.getRawValue();
              this.initUDFValues = this.userDefineForm.udfData.getRawValue();
            } else {
              const message = response.ProcessVariables.error.message;
              this.toasterService.error(message, 'Reference Details');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.toasterService.error(
        'Please fill all mandatory fields.',
        'Reference Details'
      );
    }
  }

  onBack() {
    if (this.currentUrl.includes('sales')) {
      this.router.navigateByUrl(`pages/sales/${this.leadId}/vehicle-list`);
    } else if (this.currentUrl.includes('dde')) {
      this.router.navigateByUrl(`pages/dde/${this.leadId}/additional-collateral-list`);
    }
  }

  onNext() {
    if (this.isLoan360) {
      return this.onNavigate();
    }
    this.editedUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    const isUDFCheck = this.objectComparisonService.compare(this.editedUDFValues, this.initUDFValues)
    const isUDFInvalid = this.userDefineForm ? this.userDefineForm.udfData.invalid : false
    this.isDirty = true;
    if (this.referenceForm.valid === true
      && !this.isMobileOneErrorMsg
      && !this.isMobileOneErrorMsg &&
      !isUDFInvalid) {
      // if (this.isSavedNext) {
      //   this.onSubmit();
      // }
      this.finalValue = this.referenceForm.getRawValue();
      const isValueCheck = this.objectComparisonService.compare(this.apiValue, this.finalValue);
      console.log(this.apiValue, ' vvalue', this.finalValue);
      if (!isValueCheck || !isUDFCheck) {
        this.toasterServiceInfo.showInfo('Entered details are not Saved. Please SAVE details before proceeding', '');
        return;
      }
      this.onNavigate();
    } else {
      this.toasterService.error(
        'Please fill all mandatory fields.',
        'Reference Details'
      );
      this.isSavedNext = true;
    }
  }

  onNavigate() {
    if (this.currentUrl.includes('sales')) {
      this.router.navigateByUrl(`pages/sales/${this.leadId}/document-upload`);
    } else if (this.currentUrl.includes('dde')) {
      this.router.navigateByUrl(`pages/dde/${this.leadId}/fleet-details`);
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

  onSaveuserDefinedFields(value) {
    this.userDefineForm = value;
    console.log('identify', value);
    if(value.event === 'init'){
      this.initUDFValues = this.userDefineForm? this.userDefineForm.udfData.getRawValue() : {};
    }
  }

}
