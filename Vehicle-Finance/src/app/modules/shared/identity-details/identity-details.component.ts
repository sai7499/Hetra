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
  isDirty : boolean;

  panPattern = {
    rule: '[A-Z]{3}(P)[A-Z]{1}[0-9]{4}[A-Z]{1}',
    msg: 'Invalid Pan',
  };
  public toDayDate: Date = new Date();

  constructor(
    private labelsData: LabelsService,
    private commomLovservice: CommomLovService,
    private applicantService: ApplicantService,
    private applicantDataService: ApplicantDataStoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadStoreService: LeadStoreService,
    private location: Location,
    private utilityService : UtilityService,
    private toasterService : ToasterService
  ) {}

  navigateToApplicantList() {
    const url = this.location.path();
    if (url.includes('sales')) {
      this.router.navigateByUrl(`/pages/sales/${this.leadId}/applicant-list`);
      
    }else{
    this.router.navigateByUrl(`/pages/dde/${this.leadId}/applicant-list`);
  }
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
    

    this.identityForm = new FormGroup({
      entity: new FormControl(''),
      details: new FormArray([]),
    });
    this.addIndividualFormControls();
    this.getLov();
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
      aadhar: new FormControl(null),
      panType: new FormControl('', Validators.required),
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
    identityDetails.passportIssueDate = this.utilityService.getDateFormat(
      formValue.passportIssueDate
    );
    identityDetails.passportExpiryDate =this.utilityService.getDateFormat( 
      formValue.passportExpiryDate
    );
    identityDetails.drivingLicenseNumber = formValue.drivingLicenseNumber;
    identityDetails.drivingLicenseIssueDate =this.utilityService.getDateFormat( 
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
      tinNumber: value.tinNumber,
      panNumber: value.panNumber,
      corporateIdentificationNumber: value.corporateIdentificationNumber,
      gstNumber: value.gstNumber,
    });
  }

  setIndividualValue() {
    const value = this.indivIdentityInfoDetails;
    console.log('individual', value)
    const formArray = this.identityForm.get('details') as FormArray;
    const details = formArray.at(0);
    // const aadhar= value.aadhar
    // const passportExpiryDate = this.utilityService.getDateFromString(value.passportExpiryDate) || '';
    // const passportIssueDate = this.utilityService.getDateFromString(value.passportIssueDate);
    // const drivingLicenseIssueDate = this.utilityService.getDateFromString(
    //   value.drivingLicenseIssueDate)
    // ;
    // const drivingLicenseExpiryDate = this.utilityService.getDateFromString(
    //   value.drivingLicenseExpiryDate)
    // ;
    // const voterIdIssueDate = this.getFormateDate(value.voterIdIssueDate);
    // const voterIdExpiryDate = this.getFormateDate(value.voterIdExpiryDate);
    details.patchValue({
      passportIssueDate: this.utilityService.getDateFromString(value.passportIssueDate),
      passportExpiryDate: this.utilityService.getDateFromString(value.passportExpiryDate),
      drivingLicenseIssueDate: this.utilityService.getDateFromString(value.drivingLicenseIssueDate),
      drivingLicenseExpiryDate: this.utilityService.getDateFromString(value.drivingLicenseExpiryDate),
      aadhar : value.aadhar,
      pan: value.pan,
      panType: value.panType,
      passportNumber: value.passportNumber,
      drivingLicenseNumber: value.drivingLicenseNumber,
      voterIdNumber: value.voterIdNumber,
    });
    console.log('details', details)
  }
  getFormateDate(date: string) {
    if (!date) {
      return '';
    }
    date = date.split('/').reverse().join('-');
    return date;
  }

  onSubmit() {
    this.isDirty= true;
    if(this.identityForm.invalid){
       return
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
      if (res.Error !== '0') {
        return;
      }
      const currentUrl = this.location.path();
      if (currentUrl.includes('sales')) {
        // this.router.navigate([
        //   `/pages/sales-applicant-details/${this.leadId}/address-details`,
        //   this.applicantId,
        // ]);
        this.toasterService.showSuccess(
          'Applicant Identity Details Saved Successfully',
          ''
        );
      } else {
        // this.router.navigate([
        //   `/pages/applicant-details/${this.leadId}/address-details`,
        //   this.applicantId,
        // ]);
        this.toasterService.showSuccess(
          'Applicant Identity Details Saved Successfully',
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
