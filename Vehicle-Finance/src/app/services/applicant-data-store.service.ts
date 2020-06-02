import { Injectable } from '@angular/core';

import {
  Applicant,
  CorporateProspectDetails,
  ApplicantDetails,
  IndividualProspectDetails,
  AddressDetails,
} from '@model/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantDataStoreService {
  applicant: Applicant;
  applicantId = '';
  setApplicant(applicant: Applicant) {
    this.applicant = {
      aboutIndivProspectDetails: applicant.aboutIndivProspectDetails,
      addressDetails: applicant.addressDetails,
      applicantDetails: applicant.applicantDetails,
      corporateProspectDetails: applicant.corporateProspectDetails,
      indivIdentityInfoDetails: applicant.indivIdentityInfoDetails,
    };
  }

  getApplicant() {
    return this.applicant;
  }

  setIndividualProspectDetails(value: IndividualProspectDetails) {
    const details = this.applicant.aboutIndivProspectDetails;
    const newDetails = {
      ...details,
      ...value,
    };
    this.applicant.aboutIndivProspectDetails = newDetails;
  }

  setindivProspectProfileDetails(value) {
    // this.applicant.corporateProspectDetails = value;
  }

  setCorporateProspectDetails(value: CorporateProspectDetails) {
    this.applicant.corporateProspectDetails = value;
  }

  setApplicantDetails(value: ApplicantDetails) {
    const details = this.applicant.applicantDetails;
    const newDetails = {
      ...details,
      ...value,
    };
    this.applicant.applicantDetails = newDetails;
  }

  setAddressDetails(value: AddressDetails[]) {
    console.log('setAddressDetails', value);
    this.applicant.addressDetails = value;
  }

  setApplicantId(applicantId) {
    this.applicantId = applicantId;
  }

  getApplicantId() {
    return this.applicantId;
  }
}
