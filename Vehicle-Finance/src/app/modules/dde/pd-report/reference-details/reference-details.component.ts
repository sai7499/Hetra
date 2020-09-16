import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { LabelsService } from '@services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { PersonalDiscussionService } from '@services/personal-discussion.service';
import { PdDataService } from '@modules/dde/fi-cum-pd-report/pd-data.service';
import { ToasterService } from '@services/toaster.service';
import { UtilityService } from '@services/utility.service';
import { LovDataService } from '@services/lov-data.service';
import { ApplicantService } from '@services/applicant.service';
import { map } from 'rxjs/operators';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {
  referenceDetailsForm: FormGroup;
  refCheckDetails: any = {};
  //isDirty: boolean;
  applicantLov: any;
  refererPincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };
  referencePincode: {
    state?: any[];
    country?: any[];
    district?: any[];
    city?: any[];
  };

  leadId: number;
  applicantId: any;
  version: any;
  LOV: any = {};
  labels: any = {};
  valuesToYesNo: any = [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }];
  isDirty = false;
  userId: any;
  isValidPincode: boolean;
  //valuesToYesNo: any = [{ key: 1, value: 'Yes' }, { key: 0, value: 'No' }];

  constructor(private labelsData: LabelsService, private lovDataService: LovDataService,
    private formBuilder: FormBuilder, private pdDataService: PdDataService, private applicantService: ApplicantService,
    private router: Router, private personalDiscussionService: PersonalDiscussionService,
    private aRoute: ActivatedRoute, private toastrService: ToasterService, private loginStoreService: LoginStoreService,
    private commomLovService: CommomLovService, private utilityService: UtilityService) { }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    this.getApplicantId();
    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
    });
    this.initForm();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();  // getting  user roles and
    this.userId = roleAndUserDetails.userDetails.userId;
  }

  getLabels() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.aRoute.params.subscribe((value) => {// calling get lead section data function in line 174
          if (!value && !value.applicantId) {
            return;
          }
          this.applicantId = Number(value.applicantId);
          this.version = String(value.version);
          this.getReferenceDetails()
        });
      },
      error => {
        console.log('error', error)
      });
  }

  // GET LEADID FROM URL
  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
  }

  //GET APPLICANTID
  getApplicantId() {
    this.aRoute.params.subscribe((value: any) => {
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
    });
  }

  //GET ALL LOVS
  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  getReferenceDetails() {

    const data = {
      applicantId: this.applicantId,
      pdVersion: this.version,
    };

    this.personalDiscussionService.getPdData(data).subscribe((value: any) => {
      if (value.Error === '0' && value.ProcessVariables.error.code === '0') {

        this.refCheckDetails = value.ProcessVariables.referenceCheck ? value.ProcessVariables.referenceCheck : {};
        if (this.refCheckDetails) {
          this.setFormValue(this.refCheckDetails);
          this.pdDataService.setCustomerProfile(this.refCheckDetails);
        }
      } else {
        this.toastrService.showError(value.ErrorMessage, 'Personal Details')
      }
    })

  }

  setFormValue(referenceDetails) {

    this.referenceDetailsForm.patchValue({
      refererFirstName: referenceDetails.refererFirstName || '',
      refererSecondName: referenceDetails.refererSecondName || '',
      refererThirdName: referenceDetails.refererThirdName || '',
      refererFullName: referenceDetails.refererFullName || '',
      refererRelationship: referenceDetails.refererRelationship || '',
      refererOfficePhoneNo: referenceDetails.refererOfficePhoneNo || '',
      refererAddressLine1: referenceDetails.refererAddressLine1 || '',
      refererAddressLine2: referenceDetails.refererAddressLine2 || '',
      refererAddressLine3: referenceDetails.refererAddressLine3 || '',
      refererPincode: referenceDetails.refererPincode || '',
      refererCity: referenceDetails.refererCity || '',
      refererDistrict: referenceDetails.refererDistrict || '',
      refererState: referenceDetails.refererState || '',
      refererCountry: referenceDetails.refererCountry || '',
      refererAssetName: referenceDetails.refererAssetName || '',
      referenceFirstName: referenceDetails.referenceFirstName || '',
      referenceSecondName: referenceDetails.referenceSecondName || '',
      referenceThirdName: referenceDetails.referenceThirdName || '',
      referenceFullName: referenceDetails.referenceFullName || '',
      referenceAddressLine1: referenceDetails.referenceAddressLine1 || '',
      referenceAddressLine2: referenceDetails.referenceAddressLine2 || '',
      referenceAddressLine3: referenceDetails.referenceAddressLine3 || '',
      referenceCity: referenceDetails.referenceCity || '',
      referenceCountry: referenceDetails.referenceCountry || '',
      referenceDistrict: referenceDetails.referenceDistrict || '',
      referenceState: referenceDetails.referenceState || '',
      referencePincode: referenceDetails.referencePincode || '',
      referenceMobile: referenceDetails.referenceMobile || '',
      referenceRelationship: referenceDetails.referenceRelationship || '',
      natureOfBusiness: referenceDetails.natureOfBusiness || '',
      selfieWithCustomer: referenceDetails.selfieWithCustomer || '',
      uploadImages: referenceDetails.uploadImages || '',
      pdStatus: referenceDetails.pdStatus || '',
      opinionOfPdOfficer: referenceDetails.opinionOfPdOfficer || '',
    })

  }

  //FORMGROUP
  initForm() {
    this.referenceDetailsForm = this.formBuilder.group({
      refererFirstName: ["", Validators.required],
      refererSecondName: [""],
      refererThirdName: ["", Validators.required],
      refererFullName: [{ value: '', disabled: true }],
      refererRelationship: ["", Validators.required],
      refererOfficePhoneNo: ["", Validators.required],
      refererAddressLine1: ["", Validators.required],
      refererAddressLine2: [""],
      refererAddressLine3: [""],
      refererPincode: ["", Validators.required],
      refererCity: ["", Validators.required],
      refererDistrict: ["", Validators.required],
      refererState: ["", Validators.required],
      refererCountry: ["", Validators.required],
      refererAssetName: ["", Validators.required],
      referenceFirstName: ["", Validators.required],
      referenceSecondName: [""],
      referenceThirdName: ["", Validators.required],
      referenceFullName: [{ value: '', disabled: true }],
      referenceAddressLine1: ["", Validators.required],
      referenceAddressLine2: [""],
      referenceAddressLine3: [""],
      referenceCity: ["", Validators.required],
      referenceCountry: ["", Validators.required],
      referenceDistrict: ["", Validators.required],
      referenceState: ["", Validators.required],
      referencePincode: ["", Validators.required],
      referenceMobile: ["", Validators.required],
      referenceRelationship: ["", Validators.required],
      natureOfBusiness: [""],
      selfieWithCustomer: [""],
      uploadImages: [""],
      pdStatus: ["", Validators.required],
      opinionOfPdOfficer: ["", Validators.required],
    });
  }

  getPincode(val) {
    const id = val.id;
    const pincodeValue = val.value;
    this.isValidPincode = false;
    if (pincodeValue.length === 6) {

      const pincodeNumber = Number(pincodeValue);
      this.getPincodeResult(pincodeNumber, id);
    }
  }

  getPincodeResult(pincodeNumber: number, id: string) {
    this.applicantService
      .getGeoMasterValue({
        pincode: pincodeNumber,
      })
      .pipe(
        map((value: any) => {
          const processVariables = value.ProcessVariables;
          const addressList: any[] = processVariables.GeoMasterView;
          if (!addressList) {
            this.toastrService.showError('Invalid pincode', '');
            this.isValidPincode = true;
            if (id === 'refererPincode') {
              this.referenceDetailsForm.patchValue({
                refererCity: '',
                refererDistrict: '',
                refererState: '',
                refererCountry: ''
              })
            } else if (id === 'referencePincode') {
              this.referenceDetailsForm.patchValue({
                referenceCity: '',
                referenceDistrict: '',
                referencetate: '',
                referenceCountry: ''
              })
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
                key: first.threeAlphaCode,
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
        console.log('value', value)
        if (!value) {
          return;
        }
        if (id === 'refererPincode') {
          this.refererPincode = value;
          this.referenceDetailsForm.patchValue({
            refererCity: value.city[0].value,
            refererDistrict: value.district[0].value,
            refererState: value.state[0].value,
            refererCountry: value.country[0].value
          })
        } else if (id === 'referencePincode') {

          this.referencePincode = value;
          this.referenceDetailsForm.patchValue({
            referenceCity: value.city[0].value,
            referenceDistrict: value.district[0].value,
            referenceState: value.state[0].value,
            referenceCountry: value.country[0].value
          })
        }

        setTimeout(() => {
          // this.setDefaultValueForAddress(value, formGroupName);
        });
      });
  }

  onFormSubmit() {

    let formValue = this.referenceDetailsForm.getRawValue();

    formValue.refererFullName = formValue.refererFirstName || '' + ' ' + formValue.refererSecondName || '' + ' ' + (formValue.refererThirdName || '');
    formValue.referenceFullName = formValue.referenceFirstName || '' + ' ' + formValue.referenceSecondName || '' + ' ' + formValue.referenceThirdName || '';

    if (this.referenceDetailsForm.valid) {
      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        referenceCheck: formValue
      };

      this.personalDiscussionService.saveOrUpdatePdData(data).subscribe((value: any) => {
        if (value.Error === '0' && value.ProcessVariables.error.code === '0') {
          this.refCheckDetails = value.ProcessVariables.referenceCheck ? value.ProcessVariables.referenceCheck : {};
          this.getLOV();
          this.toastrService.showSuccess('Successfully Save Reference Details', 'Save/Update Reference Details');
        } else {
          this.toastrService.showSuccess(value.ErrorMessage, 'Error Reference Details');
        }
      })

    } else {
      this.isDirty = true;
      this.toastrService.showError('Please enter valid details', 'Reference Details');
      this.utilityService.validateAllFormFields(this.referenceDetailsForm);
    }

  }

  onBack() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${this.applicantId}/income-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/income-details`]);
    }
  }

  onNext() {
    if (this.version !== 'undefined') {
      this.router.navigate([`/pages/dde/${this.leadId}/pd-list/${this.applicantId}/other-details/${this.version}`]);
    } else {
      this.router.navigate([`/pages/pd-dashboard/${this.leadId}/pd-list/${this.applicantId}/other-details`]);
    }
  }

}
