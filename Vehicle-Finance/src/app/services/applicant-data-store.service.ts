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
  applicantId ='';

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
  setApplicantId(applicantId){
    this.applicantId= applicantId;
  }

  getApplicantId(){
    return this.applicantId
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
    console.log('setAddressDetails', value)
    this.applicant.addressDetails = value;
  }
  setIndivIdentityInfoDetails(value : IndivIdentityInfoDetails){
    this.applicant.indivIdentityInfoDetails= value;
  }
}
