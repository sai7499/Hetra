import { Injectable } from '@angular/core';

import { Applicant } from '@model/applicant.model';

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
}
