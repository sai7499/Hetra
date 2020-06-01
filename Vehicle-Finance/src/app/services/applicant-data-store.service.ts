import { Injectable } from '@angular/core';

import {
  Applicant,
  CorporateProspectDetails,
  ApplicantDetails,
} from '@model/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantDataStoreService {
  applicant: Applicant;

  setApplicant(applicant: Applicant) {
    this.applicant = applicant;
  }

  getApplicant() {
    return this.applicant;
  }

  setCorporateProspectDetails(value: CorporateProspectDetails) {
    this.applicant.corporateProspectDetails = value;
  }

  setApplicantDetails(value: ApplicantDetails) {
    this.applicant.applicantDetails = value;
  }
}
