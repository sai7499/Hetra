import { Injectable } from '@angular/core';

import {
  Applicant,
  CorporateProspectDetails,
  ApplicantDetails,
  IndividualProspectDetails,
  AddressDetails,
  IndivIdentityInfoDetails,
} from '@model/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantDataStoreService {
  applicant: Applicant;
  applicantId = '';
  setApplicant(applicant: Applicant) {
    const aboutIndivProspectDetails = applicant.aboutIndivProspectDetails
      ? applicant.aboutIndivProspectDetails
      : {};
    const addressDetails = applicant.addressDetails
      ? applicant.addressDetails
      : [];
    const applicantDetails = applicant.applicantDetails
      ? applicant.applicantDetails
      : {};
    const corporateProspectDetails = applicant.corporateProspectDetails
      ? applicant.corporateProspectDetails
      : {};
    const indivIdentityInfoDetails = applicant.indivIdentityInfoDetails
      ? applicant.indivIdentityInfoDetails
      : {};
    this.applicant = {
      aboutIndivProspectDetails,
      addressDetails,
      applicantDetails,
      corporateProspectDetails,
      indivIdentityInfoDetails,
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

  setCorporateProspectDetails(value: CorporateProspectDetails) {
    const details = this.applicant.corporateProspectDetails;
    this.applicant.corporateProspectDetails = {
      ...details,
      ...value,
    };
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

  setIndivIdentityInfoDetails(value: IndivIdentityInfoDetails) {
    const details = this.applicant.indivIdentityInfoDetails;
    const newDetails = {
      ...details,
      ...value,
    };
    this.applicant.indivIdentityInfoDetails = newDetails;
  }
}
