import { Injectable } from '@angular/core';

import { Lead, SourcingDetails, ProductDetails, LoanDetails, VehicleDetails } from '../model/lead.model';

@Injectable({
    providedIn: 'root'
})
export class LeadStoreService {
    leadCreation: any;
    // coApplicant : CoApplicant;
    applicantList = [];


    constructor() { }

    setLeadCreation(lead: any) {
        this.leadCreation = lead;
    }

    getLeadCreation() {
        return this.leadCreation;
    }

    setSourcingDetails(sourcingDetails: SourcingDetails) {
        this.leadCreation.sourcingDetails = sourcingDetails;
    }

    getSourcingDetails() {
        return this.leadCreation ? this.leadCreation.sourcingDetails : {};
    }

    setProductDetails(productDetails: ProductDetails) {
        this.leadCreation.productDetails = productDetails;
    }

    getProductDetails() {
        return this.leadCreation ? this.leadCreation.productDetails : {};
    }

    setVehicleDetails(vehicleDetails: VehicleDetails) {
        this.leadCreation.vehicleDetails = vehicleDetails;
    }

    getVehicleDetails() {
        return this.leadCreation ? this.leadCreation.vehicleDetails : {};
    }

    setLoanDetails(loanDetails: LoanDetails) {
        this.leadCreation.loanDetails = loanDetails;
    }

    getLoanDetails() {
        return this.leadCreation.loanDetails;
    }

    setCoApplicantDetails(coApplicant) {
        // this.coApplicant = coApplicant;
        this.applicantList.push(coApplicant);
        console.log('this.addApplicant', this.applicantList);
    }

    getSelectedApplicant(index: number) {
        return this.applicantList[index];
    }

    updateApplicant(index: number, coApplicant) {
        this.applicantList[index] = coApplicant;
    }

    getApplicantList() {
        return this.applicantList;
    }

    // getCoApplicantDetails(){
    //     return this.addApplicant;
    // }
}
