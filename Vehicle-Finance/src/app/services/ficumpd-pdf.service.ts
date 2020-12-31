import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FicumpdPdfService {

  applicantPdDetails: any;
  custProfDetails: any;
  loanDetails: any;
  referenceCheckDetails: any;

  constructor() { }

  setApplicantPdDetails(data){
    this.applicantPdDetails = data;
  }

  getApplicantPdDetails(){
    return this.applicantPdDetails;
  }

  setcustomerProfileDetails(data){
    this.custProfDetails = data;
  }

  getcustomerProfileDetails(){
    return this.custProfDetails;
  }

  setLoanDetails(data){
    this.loanDetails = data;
  }

  getLoanDetails(){
    return this.loanDetails;
  }

  setReferenceCheckDetails(data){
    this.referenceCheckDetails = data;
  }

  getReferenceCheckDetails(){
    return this.referenceCheckDetails;
  }
}
