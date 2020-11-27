import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, Location } from '@angular/common';

import { LabelsService } from 'src/app/services/labels.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ApplicantService } from '@services/applicant.service';
import { ApplicantDataStoreService } from '@services/applicant-data-store.service';
import {
  ApplicantDetails,
  IndivIdentityInfoDetails,
  Applicant,
  CorporateProspectDetails,
} from '@model/applicant.model';
import { LeadStoreService } from '../../sales/services/lead.store.service';
import { Constant } from '../../../../assets/constants/constant';
import { UtilityService } from '@services/utility.service';
import { ToasterService } from '@services/toaster.service'
import { ControlPosition } from '@agm/core';
import { ToggleDdeService } from '@services/toggle-dde.service';

import { LoanViewService } from '@services/loan-view.service';

@Component({
  selector: 'app-identity-details',
  templateUrl: './identity-details.component.html',
  styleUrls: ['./identity-details.component.css'],
})
export class IdentityDetailsComponent implements OnInit {
  disableSaveBtn: boolean;
  labels: any = {};
  validationData: any = {}
  lov: any = {};
  applicant: Applicant;
  applicantId: number;
  leadId: number;
  indivIdentityInfoDetails: IndivIdentityInfoDetails;
  corporateProspectDetails: CorporateProspectDetails;
  isIndividual = true;
  identityForm: FormGroup;
  isDirty: boolean;
  drivingLicenceDates: boolean;
  passportDates: boolean;
  referenceNo: string;

  panPattern = {
    rule: '[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}',
    msg: 'Invalid Pan',
  };
  public toDayDate: Date = new Date();
  passportIssueDate: any;
  passportExpiryDate: any;
  drivingIssueDate: any;
  drivingExpiryDate: any;
  showInvalidMsg = {};
  minPassportIssueDate: Date = new Date();
  maxPassportExpiryDate: Date;
  maxDate = new Date()
  passportIssueInvalidMsg = "Invalid date"
  passportExpiryInvalidMsg = "Invalid date"
  drivingIssueInvalidMsg = "Invalid date"
  drivingExpiryInvalidMsg = "Invalid date"

  isLoan360: boolean;


  constructor(
    private labelsData: LabelsService,
    private commomLovservice: CommomLovService,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private utilityService: UtilityService,
    private toasterService: ToasterService,
    private toggleDdeService: ToggleDdeService,
    private loanViewService: LoanViewService
  ) {


    this.toDayDate = this.utilityService.setTimeForDates(this.toDayDate)

    this.minPassportIssueDate.setFullYear(this.minPassportIssueDate.getFullYear() - 10)
    this.minPassportIssueDate.setDate(this.minPassportIssueDate.getDate() + 1)
    this.minPassportIssueDate = this.utilityService.setTimeForDates(this.minPassportIssueDate)

    this.maxDate.setDate(this.maxDate.getDate() - 1)
    this.maxDate = this.utilityService.setTimeForDates(this.maxDate)


  }

  navigateToApplicantList() {
    const url = this.location.path();
    if (url.includes('sales')) {
      this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);

    } else {
      this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
    }
  }

  onBack() {
    //this.location.back();
    const url = this.location.path();
    if (url.includes('sales')) {
      this.router.navigateByUrl(`/pages/sales-applicant-details/${this.leadId}/basic-details/${this.applicantId}`);

    } else {
      this.router.navigateByUrl(`/pages/applicant-details/${this.leadId}/basic-data/${this.applicantId}`);
    }
  }

  async ngOnInit() {
    this.isLoan360 = this.loanViewService.checkIsLoan360();




    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
        this.validationData = data.validationData
      },
      (error) => {
        console.log(error);
      }
    );


    this.identityForm = new FormGroup({
      entity: new FormControl(''),
      details: new FormArray([]),
    });
    this.addIndividualFormControls();
    this.getLov();
    const operationType = this.toggleDdeService.getOperationType();
    if (operationType) {
      this.identityForm.disable();
      this.disableSaveBtn = true;
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

  setApplicantDetails() {
    this.isIndividual =
      this.applicant.applicantDetails.entityTypeKey ===
      Constant.ENTITY_INDIVIDUAL_TYPE;
    if (this.isIndividual) {
      this.indivIdentityInfoDetails = this.getIndivIdentityInfoDetails();

      this.setIndividualValue();
    } else {
      this.corporateProspectDetails = this.getCorporateProspectDetails();
      (this.identityForm.get('details') as FormArray).clear();
      this.addNonIndividualFormControls();
      this.setNonIndividualValue();
    }

    if (this.loanViewService.checkIsLoan360()) {
        this.identityForm.disable();
      }
  }

  getApplicantDetails() {
    this.applicant = this.applicantDataService.getApplicant();
    console.log('COMINGVALUES', this.applicant);
  }

  getIndivIdentityInfoDetails() {
    if (!this.applicant) {
      return null;
    }
    return this.applicant.indivIdentityInfoDetails;
  }

  getCorporateProspectDetails() {
    if (!this.applicant) {
      return null;
    }
    return this.applicant.corporateProspectDetails;
  }

  getLov() {
    this.commomLovservice.getLovData().subscribe(async (lov) => {
      this.lov = lov;
      this.leadId = (await this.getLeadId()) as number;
      this.identityForm.patchValue({ entity: Constant.ENTITY_INDIVIDUAL_TYPE });
      this.activatedRoute.params.subscribe((value) => {
        if (!value && !value.applicantId) {
          return;
        }
        this.applicantId = Number(value.applicantId);
        this.getApplicantDetails();
        this.setApplicantDetails();
      });
    });
  }
  addIndividualFormControls() {
    const controls = new FormGroup({
      aadhar: new FormControl({ value: null, disabled: true }),
      panType: new FormControl({ value: '', disabled: true }),
      pan: new FormControl(null),
      passportNumber: new FormControl(null),
      passportIssueDate: new FormControl(null),
      passportExpiryDate: new FormControl(null),
      drivingLicenseNumber: new FormControl(null),
      drivingLicenseIssueDate: new FormControl(null),
      drivingLicenseExpiryDate: new FormControl(null),
      voterIdNumber: new FormControl(null),
      voterIdIssueDate: new FormControl(null),
      voterIdExpiryDate: new FormControl(null),
    });
    (this.identityForm.get('details') as FormArray).push(controls);
  }

  addNonIndividualFormControls() {
    const controls = new FormGroup({
      aadhar: new FormControl({ value: '', disabled: true }),
      panType: new FormControl({ value: '', disabled: true }),
      panNumber: new FormControl(null),

      corporateIdentificationNumber: new FormControl(null),
      cstVatNumber: new FormControl(null),
      gstNumber: new FormControl(null),
      tanNumber: new FormControl(null),
    });
    (this.identityForm.get('details') as FormArray).push(controls);
  }

  passportIssueDateChange(event) {
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);

    this.passportIssueDate = new Date(event)
    //this.passportIssueDate.setDate(this.passportIssueDate.getDate() + 1)
    this.showInvalidMsg['passportExpiry'] = false;
    if (this.passportIssueDate < this.minPassportIssueDate) {
      this.showInvalidMsg['passportIssue'] = true;
      this.passportIssueInvalidMsg = "Passport Issuance date prior to 10 years will not be accepted"
    } else if (this.passportIssueDate > this.maxDate) {
      this.showInvalidMsg['passportIssue'] = true;
      this.passportIssueInvalidMsg = "Invalid date- Should be Past date"
    } else {
      this.showInvalidMsg['passportIssue'] = false;
      this.passportIssueInvalidMsg = "";
      this.maxPassportExpiryDate = this.passportIssueDate;
      this.maxPassportExpiryDate.setFullYear(this.maxPassportExpiryDate.getFullYear() + 10)
      this.maxPassportExpiryDate.setDate(this.maxPassportExpiryDate.getDate() - 1)
    }

    this.clearPassportExpiry()

  }

  clearPassportExpiry() {
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('passportExpiryDate').setValue(null);
    details.get('passportExpiryDate').setValidators([Validators.required])
    details.get('passportExpiryDate').updateValueAndValidity();
  }
  PassportExpiryDateChange(event) {
    this.passportExpiryDate = new Date(event)
    if (this.passportExpiryDate <= this.maxDate) {
      this.showInvalidMsg['passportExpiry'] = true;
      this.passportExpiryInvalidMsg = "Invalid date- Should be Future date"
    } else if (this.passportExpiryDate > this.maxPassportExpiryDate) {
      this.showInvalidMsg['passportExpiry'] = true;
      this.passportExpiryInvalidMsg = "Passport expiry date should be 10 years from Issuance date"
    } else {
      this.showInvalidMsg['passportExpiry'] = false;
      this.passportExpiryInvalidMsg = "";
    }
  }
  drivingIssueDateChange(event) {

    this.drivingIssueDate = new Date(event)
    this.showInvalidMsg['drivingExpiry'] = false;
    //this.drivingIssueDate.setDate(this.drivingIssueDate.getDate() + 1)
    if (this.drivingIssueDate > this.maxDate) {
      this.showInvalidMsg['drivingIssue'] = true;
      this.drivingIssueInvalidMsg = "Invalid date- Should be Past date"
    } else {
      this.showInvalidMsg['drivingIssue'] = false;
      this.drivingIssueInvalidMsg = ""

    }
    //console.log('Date', this.drivingIssueDate)
    this.clearDrivingLicenceExpiry();
   

  }

  clearDrivingLicenceExpiry() {
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('drivingLicenseExpiryDate').setValue(null)
    details.get('drivingLicenseExpiryDate').setValidators([Validators.required])
    details.get('drivingLicenseExpiryDate').updateValueAndValidity();
  }
  drivingExpiryDateChange(event) {
    this.drivingExpiryDate = new Date(event)
    if (this.drivingExpiryDate < this.toDayDate) {
      this.showInvalidMsg['drivingExpiry'] = true;
      this.drivingExpiryInvalidMsg = "Invalid date- Should be Future date"
    } else {
      this.showInvalidMsg['drivingExpiry'] = false;
      this.drivingExpiryInvalidMsg = ""
    }
  }

  onIndividualChange(event) {
    const value = event.target.value;
    this.isIndividual = value === Constant.ENTITY_INDIVIDUAL_TYPE;
    const formArray = this.identityForm.get('details') as FormArray;
    formArray.clear();
    this.isIndividual ? this.addIndividualForm() : this.addNonIndividualForm();
  }

  addIndividualForm() {
    this.addIndividualFormControls();
  }

  addNonIndividualForm() {
    this.addNonIndividualFormControls();
  }



  storeNonIndividualValueInService() {
    const value = this.identityForm.getRawValue();
    const details: CorporateProspectDetails = {};
    const formValue = value.details[0];
    details.aadhar = formValue.aadhar;
    details.gstNumber = formValue.gstNumber;
    details.panNumber = formValue.panNumber;
    details.panType = formValue.panType;
    details.cstVatNumber = formValue.cstVatNumber;
    details.corporateIdentificationNumber =
      formValue.corporateIdentificationNumber;
    details.tanNumber = formValue.tanNumber;
    this.applicantDataService.setCorporateProspectDetails(details);
  }

  storeIndividualValueInService() {
    const value = this.identityForm.getRawValue();
    const identityDetails: IndivIdentityInfoDetails = {};
    const formValue = value.details[0];
    identityDetails.aadhar = formValue.aadhar;
    identityDetails.pan = formValue.pan;
    identityDetails.panType = formValue.panType;
    identityDetails.passportNumber = formValue.passportNumber;
    identityDetails.passportIssueDate = this.utilityService.getDateFormat(
      formValue.passportIssueDate
    );
    identityDetails.passportExpiryDate = this.utilityService.getDateFormat(
      formValue.passportExpiryDate
    );
    identityDetails.drivingLicenseNumber = formValue.drivingLicenseNumber;
    identityDetails.drivingLicenseIssueDate = this.utilityService.getDateFormat(
      formValue.drivingLicenseIssueDate
    );
    identityDetails.drivingLicenseExpiryDate = this.utilityService.getDateFormat(
      formValue.drivingLicenseExpiryDate
    );
    identityDetails.voterIdNumber = formValue.voterIdNumber;
    identityDetails.voterIdIssueDate = this.formatGivenDate(
      formValue.voterIdIssueDate
    );
    identityDetails.voterIdExpiryDate = this.formatGivenDate(
      formValue.voterIdExpiryDate
    );

    this.applicantDataService.setIndivIdentityInfoDetails(identityDetails);
  }

  formatGivenDate(date) {
    return date ? formatDate(date, 'dd/MM/yyyy', 'en-us') : '';
  }

  setNonIndividualValue() {
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);
    const value = this.corporateProspectDetails;
    details.patchValue({
      tanNumber: value.tanNumber,
      panNumber: value.panNumber,
      panType: value.panType,
      cstVatNumber: value.cstVatNumber,
      corporateIdentificationNumber: value.corporateIdentificationNumber,
      gstNumber: value.gstNumber,
      aadhar: value.aadhar
    });
  }

  setIndividualValue() {
    const value = this.indivIdentityInfoDetails;

    this.passportIssueDate = this.utilityService.getDateFromString(value.passportIssueDate);
    this.drivingIssueDate = this.utilityService.getDateFromString(value.drivingLicenseIssueDate);

    //console.log('individual', value)
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);

    if (value.passportIssueDate) {
      const convertDate = this.utilityService.getDateFromString(value.passportIssueDate)
      this.passportIssueDateChange(convertDate)
    }
    if (value.drivingLicenseIssueDate) {
      const convertDate = this.utilityService.getDateFromString(value.drivingLicenseIssueDate)
      this.drivingIssueDateChange(convertDate)
    }

    details.patchValue({
      passportIssueDate: this.utilityService.getDateFromString(value.passportIssueDate),
      passportExpiryDate: this.utilityService.getDateFromString(value.passportExpiryDate),
      drivingLicenseIssueDate: this.utilityService.getDateFromString(value.drivingLicenseIssueDate),
      drivingLicenseExpiryDate: this.utilityService.getDateFromString(value.drivingLicenseExpiryDate),
      aadhar: value.aadhar,
      pan: value.pan,
      panType: value.panType,
      passportNumber: value.passportNumber,
      drivingLicenseNumber: value.drivingLicenseNumber,
      voterIdNumber: value.voterIdNumber,
    });


    if (value.passportExpiryDate) {
      const convertDate = this.utilityService.getDateFromString(value.passportExpiryDate)
      this.PassportExpiryDateChange(convertDate)
    }
    if (value.drivingLicenseExpiryDate) {
      const convertDate = this.utilityService.getDateFromString(value.drivingLicenseExpiryDate)
      this.drivingExpiryDateChange(convertDate)

    }
    if (this.applicant.ucic) {
      this.passportDates = true;
      this.drivingLicenceDates = true;
    } else {
      this.passportDates = value.passportNumber ? false : true;
      this.drivingLicenceDates = value.drivingLicenseNumber ? false : true;
    }


    console.log('details', details)
  }
  getFormateDate(date: string) {
    if (!date) {
      return '';
    }
    date = date.split('/').reverse().join('-');
    return date;
  }

  onRetreiveAdhar() {
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);
    const value = this.indivIdentityInfoDetails;
    this.referenceNo = value.aadhar;
    this.applicantService.retreiveAdhar(this.referenceNo).subscribe((res) => {
      if (res['ProcessVariables'].error.code == "0") {
        const uid = res['ProcessVariables'].uid;
        details.get('aadhar').setValue(uid)
      }
    })
  }

  onRelieve() {
    const value = this.indivIdentityInfoDetails;
    this.referenceNo = value.aadhar;
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);
    details.get('aadhar').setValue(this.referenceNo);
  }

  onSubmit() {
    this.isDirty = true;
    if (!this.applicant.ucic) {
      if (this.identityForm.invalid ||
        this.showInvalidMsg['drivingIssue']||
        this.showInvalidMsg['drivingExpiry']||
        this.showInvalidMsg['passportIssue']||
        this.showInvalidMsg['passportExpiry']) {
        this.toasterService.showError(
          'Please fill all mandatory fields.',
          'Address Details'
        );
        return
      }
    }

    if (this.isIndividual) {
      this.storeIndividualValueInService();
      this.applicantDataService.setCorporateProspectDetails(null);
    } else {
      this.storeNonIndividualValueInService();
      this.applicantDataService.setIndivIdentityInfoDetails(null);
    }

    const applicantDetails: ApplicantDetails = {};
    applicantDetails.entityType = this.applicantDataService.getApplicant().applicantDetails.entityTypeKey;
    this.applicantDataService.setApplicantDetails(applicantDetails);

    const applicant = this.applicantDataService.getApplicant();
    const data = {
      ...applicant,
      leadId: this.leadId,
      applicantId: this.applicantId,
    };
    const leadId = this.leadStoreService.getLeadId();
    this.applicantService.saveApplicant(data).subscribe((res: any) => {
      if (res.ProcessVariables.error.code !== '0') {
        return;
      }
      const currentUrl = this.location.path();
      if (currentUrl.includes('sales')) {
        // this.router.navigate([
        //   `/pages/sales-applicant-details/${this.leadId}/address-details`,
        //   this.applicantId,
        // ]);
        this.toasterService.showSuccess(
          'Record Saved Successfully',
          ''
        );
      } else {
        // this.router.navigate([
        //   `/pages/applicant-details/${this.leadId}/address-details`,
        //   this.applicantId,
        // ]);
        this.toasterService.showSuccess(
          'Record Saved Successfully',
          ''
        );
      }
    });
  }

  onNext() {
    const url = this.location.path();
    if (url.includes('sales')) {
      this.router.navigateByUrl(
        `pages/sales-applicant-details/${this.leadId}/address-details/${this.applicantId}`
      );
      return;
    }

    this.router.navigateByUrl(
      `/pages/applicant-details/${this.leadId}/address-details/${this.applicantId}`
    );
  }
}