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

@Component({
  selector: 'app-identity-details',
  templateUrl: './identity-details.component.html',
  styleUrls: ['./identity-details.component.css'],
})
export class IdentityDetailsComponent implements OnInit {
  labels: any = {};
  lov: any = {};
  applicant: Applicant;
  applicantId: number;
  leadId: number;
  indivIdentityInfoDetails: IndivIdentityInfoDetails;
  corporateProspectDetails: CorporateProspectDetails;
  isIndividual = true;
  identityForm: FormGroup;

  constructor(
    private labelsData: LabelsService,
    private commomLovservice: CommomLovService,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location
  ) {}

  navigateToApplicantList() {
    const url = this.location.path();
    if (url.includes('sales')) {
      this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
      return;
    }
    this.router.navigateByUrl(
      `/pages/applicant-details/${this.leadId}/applicant-list`
    );
  }

  onBack() {
    this.location.back();
  }

  async ngOnInit() {
    this.labelsData.getLabelsData().subscribe(
      (data) => {
        this.labels = data;
      },
      (error) => {
        console.log(error);
      }
    );
    this.getLov();

    this.identityForm = new FormGroup({
      entity: new FormControl(''),
      details: new FormArray([]),
    });
    this.addIndividualFormControls();
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
    this.commomLovservice.getLovData().subscribe((lov) => {
      this.lov = lov;
    });
  }
  addIndividualFormControls() {
    const controls = new FormGroup({
      aadhar: new FormControl(null),
      panType: new FormControl(''),
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
      tinNumber: new FormControl(null),
      panNumber: new FormControl(null),
      corporateIdentificationNumber: new FormControl(null),
      gstNumber: new FormControl(null),
    });
    (this.identityForm.get('details') as FormArray).push(controls);
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

  onSave() {}

  storeNonIndividualValueInService() {
    const value = this.identityForm.getRawValue();
    const details: CorporateProspectDetails = {};
    const formValue = value.details[0];
    details.gstNumber = formValue.gstNumber;
    details.panNumber = formValue.panNumber;
    details.corporateIdentificationNumber =
      formValue.corporateIdentificationNumber;
    details.tinNumber = formValue.tinNumber;
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
    identityDetails.passportIssueDate = this.formatGivenDate(
      formValue.passportIssueDate
    );
    identityDetails.passportExpiryDate = this.formatGivenDate(
      formValue.passportExpiryDate
    );
    identityDetails.drivingLicenseNumber = formValue.drivingLicenseNumber;
    identityDetails.drivingLicenseIssueDate = this.formatGivenDate(
      formValue.drivingLicenseIssueDate
    );
    identityDetails.drivingLicenseExpiryDate = this.formatGivenDate(
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
      tinNumber: value.tinNumber,
      panNumber: value.panNumber,
      corporateIdentificationNumber: value.corporateIdentificationNumber,
      gstNumber: value.gstNumber,
    });
  }

  setIndividualValue() {
    const value = this.indivIdentityInfoDetails;
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);
    const passportExpiryDate = this.getFormateDate(value.passportExpiryDate);
    const passportIssueDate = this.getFormateDate(value.passportIssueDate);
    const drivingLicenseIssueDate = this.getFormateDate(
      value.drivingLicenseIssueDate
    );
    const drivingLicenseExpiryDate = this.getFormateDate(
      value.drivingLicenseExpiryDate
    );
    const voterIdIssueDate = this.getFormateDate(value.voterIdIssueDate);
    const voterIdExpiryDate = this.getFormateDate(value.voterIdExpiryDate);
    details.patchValue({
      passportIssueDate,
      passportExpiryDate,
      drivingLicenseIssueDate,
      drivingLicenseExpiryDate,
      voterIdExpiryDate,
      voterIdIssueDate,
      aadhar: value.aadhar,
      pan: value.pan,
      panType: value.panType,
      passportNumber: value.passportNumber,
      drivingLicenseNumber: value.drivingLicenseNumber,
      voterIdNumber: value.voterIdNumber,
    });
  }
  getFormateDate(date: string) {
    if (!date) {
      return '';
    }
    date = date.split('/').reverse().join('-');
    return date;
  }

  onSubmit() {
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
      if (res.Error !== '0') {
        return;
      }
      const currentUrl = this.location.path();
      if (currentUrl.includes('sales')) {
        this.router.navigate([
          `/pages/sales-applicant-details/${this.leadId}/address-details`,
          this.applicantId,
        ]);
      } else {
        this.router.navigate([
          `/pages/applicant-details/${this.leadId}/address-details`,
          this.applicantId,
        ]);
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
