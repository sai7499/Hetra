import { Injectable } from '@angular/core';
import { Dde, ApplicantDetails, CustomerProfile, LoanDetails } from '@model/dde.model';

@Injectable({
  providedIn: 'root'
})
export class PdDataService {

  private ddeData: Dde;
  private applicantDetails: any;
  private customerProfile: any;
  private loanDetails: any;

  constructor() { }


  setApplicationDetails(appDetails: ApplicantDetails) {

    this.applicantDetails = appDetails;
  }

  getApplicationDetails() {
    return this.applicantDetails ? this.applicantDetails : {};
  }


  setCustomerProfile(custProf: CustomerProfile) {

    this.customerProfile = custProf;
    console.log("in set cust prof", this.customerProfile)
  }

  getCustomerProfile() {
    return this.customerProfile ? this.customerProfile : {};
  }

  setLoanDetails(loanDetails: LoanDetails) {
    this.loanDetails = loanDetails;
  }

  getLoanDetails() {
    return this.loanDetails ? this.loanDetails : {};

  }


}
