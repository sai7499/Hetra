import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';
@Component({
  selector: 'app-reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.css']
})
export class ReferenceDetailsComponent implements OnInit {
  referenceDetailsForm: FormGroup;
  refCheckDetails: any = {};
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
  productCatCode: any;
  listArray: FormArray;
  referenceDetails: any;
  marketAndFinReferenceDetails: any;
  applicantType: any;
  allowSave: boolean;
  indexFromHtml: number;

  // User defined fields
  udfScreenId: string = 'PDS003';
  udfDetails: any = [];
  userDefineForm: any;
  udfGroupId: string = 'PDG001';

  constructor(private labelsData: LabelsService, private lovDataService: LovDataService,
    private formBuilder: FormBuilder, private pdDataService: PdDataService, private applicantService: ApplicantService,
    private router: Router, private personalDiscussionService: PersonalDiscussionService,
    private aRoute: ActivatedRoute, private toasterService: ToasterService, private loginStoreService: LoginStoreService,
    private commomLovService: CommomLovService, private createLeadDataService: CreateLeadDataService,
    private utilityService: UtilityService, private fb: FormBuilder) {
    this.listArray = this.fb.array([]);
  }

  ngOnInit() {
    this.getLabels();
    this.getLeadId();
    this.getApplicantId();
    this.getLOV();
    this.lovDataService.getLovData().subscribe((value: any) => {
      this.applicantLov = value ? value[0].applicantDetails[0] : {};
    });
    this.initForm();
    this.removeReferenceControls();
    const roleAndUserDetails = this.loginStoreService.getRolesAndUserDetails();  // getting  user roles and
    this.userId = roleAndUserDetails.userDetails.userId;
    let roleType = roleAndUserDetails.roles[0].roleType;

    //this.udfScreenId = roleType === 1 ? 'PDS003' : 'PDS007';
    this.labelsData.getScreenId().subscribe((data) => {
      let udfScreenId = data.ScreenIDS;

      this.udfScreenId = roleType === 1 ? udfScreenId.PD.applicantReferencePD : udfScreenId.DDE.referencePDDDE ;

    })
  }

  getLeadSectiondata() {
    const leadData = this.createLeadDataService.getLeadSectionData();
    const leadDetailsFromLead = leadData['leadDetails'];
    this.productCatCode = leadDetailsFromLead.productCatCode;
    for (const value of leadData['applicantDetails']) {
      if (value['applicantId'] === this.applicantId) {
        const applicantDetailsFromLead = value;
        this.applicantType = applicantDetailsFromLead['applicantTypeKey']
      }
    }
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
          this.getLeadSectiondata();
          this.getReferenceDetails();
        });
      },
      error => {
        console.log('error', error);
      });
  }

  // GET LEADID FROM URL
  getLeadId() {
    this.aRoute.parent.params.subscribe((val) => {
      this.leadId = Number(val.leadId);
    });
  }

  // GET APPLICANTID
  getApplicantId() {
    this.aRoute.params.subscribe((value: any) => {
      this.applicantId = Number(value.applicantId);
      this.version = String(value.version);
    });
  }

  // GET ALL LOVS
  getLOV() {
    this.commomLovService.getLovData().subscribe((lov) => (this.LOV = lov));
  }

  getReferenceDetails() {

    const data = {
      applicantId: this.applicantId,
      pdVersion: this.version,
      "udfDetails": [
        {
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId
        }
      ]
    };

    this.personalDiscussionService.getPdData(data).subscribe((value: any) => {
      if (value.Error === '0' && value.ProcessVariables.error.code === '0') {
        this.refCheckDetails = value.ProcessVariables.referenceCheck ? value.ProcessVariables.referenceCheck : {};
        this.udfDetails = value.ProcessVariables.udfDetails ? value.ProcessVariables.udfDetails : [];

        const referenceDetails = value.ProcessVariables.marketFinRefData;
        if (referenceDetails != null && this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
          this.populateData(value);
        } else if (referenceDetails == null && this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
          const control = this.referenceDetailsForm.controls.marketFinRefData as FormArray;
          control.push(this.initRows(null));
        }
        if (this.refCheckDetails) {
          this.setFormValue(this.refCheckDetails);
          this.pdDataService.setCustomerProfile(this.refCheckDetails);
        }
      } else {
        this.toasterService.showError(value.ErrorMessage, '');
      }
    });
  }

  public populateData(data?: any) {
    const referenceDetailsList = data.ProcessVariables.marketFinRefData;
    for (let i = 0; i < referenceDetailsList.length; i++) {
      this.addProposedUnit(referenceDetailsList[i]);
    }
  }

  addProposedUnit(data?: any) {
    const control = this.referenceDetailsForm.controls.marketFinRefData as FormArray;
    control.push(this.populateRowData(data));
  }

  addNewRow(rowData) {
    const control = this.referenceDetailsForm.controls.marketFinRefData as FormArray;
    control.push(this.initRows(rowData));
  }

  deleteRow(index: number, references: any) {
    const control = this.referenceDetailsForm.controls.marketFinRefData as FormArray;

    let referenceId = references[index].id;
    let i = 0;
    let j = 0;
    references.forEach(element => {
      if (element.typeReference === 'FINREFREFERNS') {
        i = i + 1;
      } else if (element.typeReference === 'MKTREFREFERNS') {
        j = j + 1;
      }
    });
    if (references.length > 2) {
      const data = {
        id: referenceId
      };
      if ((referenceId !== 0 && i > 1 && j === 1) && (references[index].typeReference === 'MKTREFREFERNS')) {
        this.toasterService.showError(' atleast one market reference is required', '');

      } else if ((referenceId !== 0 && i === 1 && j > 1) && (references[index].typeReference === 'FINREFREFERNS')) {
        this.toasterService.showError(' atleast one finance reference is required', '');
      } else if ((referenceId !== 0) && (i > 1 || j > 1)) {
        this.personalDiscussionService.deleteMarFinReference(data).subscribe((res: any) => {
          const processVariables = res.ProcessVariables;
          const message = processVariables.error.message;
          if (processVariables.error.code === '0') {
            this.toasterService.showSuccess(message, '');
            this.listArray.controls = [];
            this.getReferenceDetails();
          } else {
            this.toasterService.showSuccess(message, '');
          }
        });
      } else if (referenceId === 0) {
        control.removeAt(index);
        this.toasterService.showSuccess('Reference details deleted successfully', '');
      }
    } else if (referenceId !== 0 && (i === 1 && j === 1)) {
      this.toasterService.showError('atleast one market and finance reference required', '');
    }
  }

  delete(index: number) {
    this.indexFromHtml = index;
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
    });
    if (referenceDetails.referencePincode != null) {
      this.getPincodeResult(Number(referenceDetails.referencePincode), 'referencePincode');
    }
    if (referenceDetails.referencePincode != null) {
      this.getPincodeResult(Number(referenceDetails.refererPincode), 'refererPincode');
    }
  }

  // FORMGROUP
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
      refererAssetName: [""],
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
      referenceMobile: [""],
      referenceRelationship: ["", Validators.required],
      natureOfBusiness: ["", Validators.required],
      selfieWithCustomer: [""],
      uploadImages: [""],
      pdStatus: ["", Validators.required],
      opinionOfPdOfficer: ["", Validators.required],
      marketFinRefData: this.listArray
    });
  }

  removeReferenceControls() {
    const controls = this.referenceDetailsForm as FormGroup;
    if ((this.productCatCode !== 'NCV') || (this.productCatCode === 'NCV' && this.applicantType !== 'APPAPPRELLEAD')) {
      controls.removeControl('marketFinRefData');
    }
  }

  public populateRowData(rowData) {
    return this.fb.group({
      typeReference: rowData.typeReference ? rowData.typeReference : null,
      companyName: rowData.companyName ? rowData.companyName : null,
      officerName: rowData.officerName ? rowData.officerName : null,
      designation: rowData.designation ? rowData.designation : null,
      teleNo: rowData.teleNo ? rowData.teleNo : null,
      comments: rowData.comments ? rowData.comments : null,
      id: rowData.id ? rowData.id : null,
      applicantId: rowData.applicantId ? rowData.applicantId : this.applicantId
    });
  }

  public initRows(index: number) {
    return this.fb.group({
      typeReference: new FormControl(''),
      // , [Validators.required]
      companyName: new FormControl(''),
      // , [Validators.required]
      officerName: new FormControl(''),
      // , [Validators.required]
      designation: new FormControl(''),
      // , [Validators.required]
      teleNo: new FormControl(''),
      // , [Validators.required]
      comments: new FormControl(''),
      id: 0,
      applicantId: this.applicantId
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
          const addressList: any[] = processVariables.GeoMasterView ? processVariables.GeoMasterView : [];
          if (!addressList) {
            this.toasterService.showError('Invalid pincode', '');
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
        if (!value) {
          return;
        }
        if (id === 'refererPincode') {
          this.refererPincode = value;
          this.referenceDetailsForm.patchValue({
            refererCity: value.city[0].key,
            refererDistrict: value.district[0].key,
            refererState: value.state[0].key,
            refererCountry: value.country[0].key
          });
        } else if (id === 'referencePincode') {

          this.referencePincode = value;
          this.referenceDetailsForm.patchValue({
            referenceCity: value.city[0].key,
            referenceDistrict: value.district[0].key,
            referenceState: value.state[0].key,
            referenceCountry: value.country[0].key
          });
        }
      });
  }

  onFormSubmit(references: any) {

    let formValue = this.referenceDetailsForm.getRawValue();

    formValue.refererFullName = formValue.refererFirstName || '' + ' ' + formValue.refererSecondName || '' + ' ' + (formValue.refererThirdName || '');
    formValue.referenceFullName = formValue.referenceFirstName || '' + ' ' + formValue.referenceSecondName || '' + ' ' + formValue.referenceThirdName || '';
    if (this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
      const referenceArray = (this.referenceDetailsForm.value.marketFinRefData as FormArray);
      for (let i = 0; i < referenceArray.length; i++) {
        referenceArray[i]['typeReference'] = referenceArray[i]['typeReference'];
        referenceArray[i]['companyName'] = referenceArray[i]['companyName'];
        referenceArray[i]['officerName'] = referenceArray[i]['officerName'];
        referenceArray[i]['designation'] = referenceArray[i]['designation'];
        referenceArray[i]['teleNo'] = referenceArray[i]['teleNo'];
        referenceArray[i]['comments'] = referenceArray[i]['comments'];
      }
      this.referenceDetailsForm.value.marketFinRefData = referenceArray;

      let i = 0;
      let j = 0;
      references.forEach(element => {
        if (element.typeReference === 'FINREFREFERNS') {
          i = i + 1;
        } else if (element.typeReference === 'MKTREFREFERNS') {
          j = j + 1;
        }
      });
      if (i >= 1 && j >= 1) {
        this.allowSave = true;
      }
      this.marketAndFinReferenceDetails = referenceArray;
    }
    this.isDirty = true;

    let isUdfField = this.userDefineForm ? this.userDefineForm.udfData.valid ? true : false : true;

    if (this.referenceDetailsForm.valid && isUdfField) {

      // if (this.allowSave !== true && this.productCatCode === 'NCV' && this.applicantType === 'APPAPPRELLEAD') {
      //   this.toasterService.showWarning('atleast one market and finance reference required', '');
      //   return;
      // }

      const data = {
        leadId: this.leadId,
        applicantId: this.applicantId,
        userId: this.userId,
        referenceCheck: formValue,
        udfDetails: [
          {
            "udfGroupId": this.udfGroupId,
            // "udfScreenId": this.udfScreenId,
            "udfData": JSON.stringify(
              this.userDefineForm && this.userDefineForm.udfData ?
                this.userDefineForm.udfData.getRawValue() : {}
            )
          }
        ],
        marketFinRefData: this.marketAndFinReferenceDetails
      };

      this.personalDiscussionService.saveOrUpdatePdData(data).subscribe((value: any) => {
        if (value.Error === '0' && value.ProcessVariables.error.code === '0') {
          this.refCheckDetails = value.ProcessVariables.referenceCheck ? value.ProcessVariables.referenceCheck : {};
          this.getLOV();
          this.toasterService.showSuccess('Record Saved Successfully', '');
          this.listArray.controls = [];
          this.getReferenceDetails();
        } else {
          this.toasterService.showSuccess(value.ErrorMessage, 'Error Reference Details');
        }
      });
    } else {
      this.toasterService.showError('Please enter valid details', 'Reference Details');
      this.utilityService.validateAllFormFields(this.referenceDetailsForm);
      return;
    }
  }

  onSaveuserDefinedFields(event) {
    this.userDefineForm = event;
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
