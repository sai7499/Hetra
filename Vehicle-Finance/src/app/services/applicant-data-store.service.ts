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
  applicantRelation: any;
  applicant: Applicant = {};
  applicantId = '';
  dedupeValues = {};
  dedupeFlag: boolean = false;
  panValidate: boolean = false;
  isSaveBasicDetails: boolean = false;
  isSaveAddressDetails: boolean = false;
  isNavigateDedupe: boolean = false;
  isValueChange: boolean = false;
  leadSetionData: any;
  isFemaleGender: boolean;
  applicantList : any=[]

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
      ucic: applicant.ucic,
      ekycDone: applicant.ekycDone
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
    const details = this.applicant.indivProspectProfileDetails;
    const newDetails = {
      ...details,
      ...value,
    };
    this.applicant.indivProspectProfileDetails = newDetails;
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

  setDirectorDetails(value: DirectorDetails[]) {
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

  setApplicantRelation(value) {
    this.applicantRelation = value;
  }
  getApplicantRelation() {
    return this.applicantRelation;
  }

  setDedupeValues(data) {
    this.dedupeValues = {
      ...data
    }
  }
  getDedupeValues() {
    return this.dedupeValues
  }
  setDedupeFlag(value: boolean) {
    this.dedupeFlag = value;
  }
  getDedupeFlag() {
    return this.dedupeFlag;
  }
  setPanValidate(value: boolean) {
    this.panValidate = value;
  }
  getPanValidate() {
    return this.panValidate
  }

  setDetectvalueChange(value: boolean) {
    this.isValueChange = value
  }
  getDetectvalueChange() {
    return this.isValueChange
  }
  setNavigateForDedupe(value: boolean) {
    this.isNavigateDedupe = value
  }
  getNavigateForDedupe() {
    return this.isNavigateDedupe
  }
  setApplicantList(data : any[]){
     this.applicantList=[];
     this.applicantList=data;
  }

  getApplicantList(){
     return this.applicantList
  }

  checkLeadSectionDataForNCV(product, applicantDetails, isBool?) {
    let result: boolean;

    if (isBool === true) {
      result = isBool;
      return result;
    } else if (isBool === false) {
      result = false;
      return result;
    }
   
    let appDetails = [];
    const checkProduct: string = product;
    if (checkProduct === 'NCV') {
      appDetails = applicantDetails;
      appDetails.map((data) => {
        if (data.entityTypeKey === "INDIVENTTYP") {
          if (data.gender !== '2GENDER') {
            result = true;
          }
        }
      });
    }
    return result;
  }

  checkFemaleAppForNCV(data : any[]): boolean{

     const applicantList = data;
     
     const result= applicantList.some((value : any)=>{
      return value.gender==='2GENDER'
     })
     return result;
  }

  findCoApplicant(data : any[]) : boolean{
    const applicantList = data;
     
    const result= applicantList.some((value : any)=>{
     return value.applicantTypeKey == "COAPPAPPRELLEAD"
    })
    return result;
  }

}
