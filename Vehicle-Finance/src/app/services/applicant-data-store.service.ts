import { Injectable } from '@angular/core';

import {
  Applicant,
  CorporateProspectDetails,
  ApplicantDetails,
  IndividualProspectDetails,
  AddressDetails,
  IndivIdentityInfoDetails,
  IndivProspectProfileDetails,
  DirectorDetails
} from '@model/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantDataStoreService {
  applicantRelation : any;
  applicant: Applicant = {};
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
    const indivProspectProfileDetails = applicant.indivProspectProfileDetails
      ? applicant.indivProspectProfileDetails
      : {};
    const directorDetails = applicant.directorDetails
      ? applicant.directorDetails
      : [];

    this.applicant = {
      aboutIndivProspectDetails,
      addressDetails,
      applicantDetails,
      corporateProspectDetails,
      indivIdentityInfoDetails,
      indivProspectProfileDetails,
      directorDetails,
      otpVerified: applicant.otpVerified,
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
    const details = this.applicant.indivIdentityInfoDetails;
    const newDetails = {
      ...details,
      ...value,
    };
    this.applicant.indivProspectProfileDetails = newDetails;
    console.log(
      ' this.applicant.indivProspectProfileDetails',
      this.applicant.indivProspectProfileDetails
    );
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
    this.applicant.addressDetails = value;
  }

  setDirectorDetails(value : DirectorDetails[]){
    this.applicant.directorDetails = value;
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

  setApplicantRelation(value){
    this.applicantRelation= value;
  }
  getApplicantRelation(){
    return this.applicantRelation;
  }
}
