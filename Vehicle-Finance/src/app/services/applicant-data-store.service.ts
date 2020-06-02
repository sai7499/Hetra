import { Injectable } from '@angular/core';

import {
  Applicant,
  CorporateProspectDetails,
  ApplicantDetails,
  IndividualProspectDetails,
  IndivProspectProfileDetails,
  IndivIdentityInfoDetails, 
  AddressDetails
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
  setIndividualProspectDetails(value : IndividualProspectDetails){
    this.applicant.aboutIndivProspectDetails = value;
  }
  setindivProspectProfileDetails(value : IndivProspectProfileDetails){
    this.applicant.indivProspectProfileDetails = value;
  }
  setAddressDetails(value : AddressDetails[]){
    this.applicant.addressDetails = value;
  }
  setIndivIdentityInfoDetails(value : IndivIdentityInfoDetails){
    this.applicant.indivIdentityInfoDetails= value;
  }
}
