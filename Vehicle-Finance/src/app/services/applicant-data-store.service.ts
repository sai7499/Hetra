import { Injectable } from '@angular/core';

import {
  Applicant,
  CorporateProspectDetails,
  ApplicantDetails,
  IndividualProspectDetails,
} from '@model/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantDataStoreService {
  applicant: Applicant;

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
}
