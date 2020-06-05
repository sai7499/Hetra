import { Injectable } from '@angular/core';

import { Lead, SourcingDetails, ProductDetails, LoanDetails, VehicleDetails, BasicVehicleDetails } from '../model/lead.model';

@Injectable({
    providedIn: 'root'
})
export class LeadStoreService {
    leadCreation: any;
    // leadCreation: Lead;
    basicVehicleDetails: BasicVehicleDetails;
    // coApplicant : CoApplicant;
    applicantList = [];
    vehicleList = [];
    leadDedupeData: any;
    creditlead: any;

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
        // this.leadCreation.vehicleDetails = vehicleDetails;
        this.vehicleList.push(vehicleDetails);
    }

    getVehicleDetails() {
        // return this.leadCreation ? this.leadCreation.vehicleDetails : {};
        return this.vehicleList;
    }
    getSelectedVehicle(index: number) {
        return this.vehicleList[index];
     }

     updateVehicle(index: number, vehicleDetails) {
         this.vehicleList[index] = vehicleDetails;
     }

     deleteVehicle(index: number) {
        this.vehicleList.splice(index, 1);
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
    }

    // getBasicVehicleDetails() {
    //     return this.leadCreation ? this.leadCreation.BasicVehicleDetails : {};
    // }

    getSelectedApplicant(index: number) {
        return this.applicantList[index];
    }

    updateApplicant(index: number, coApplicant) {
        this.applicantList[index] = coApplicant;
    }

    deleteApplicant(index: number) {
        this.applicantList.splice(index, 1);
    }
    getApplicantList() {
        return this.applicantList;
    }

    setDedupeData(leadDedupeData) {
        this.leadDedupeData =  leadDedupeData;
    }
    getDedupeData() {
        return this.leadDedupeData;
    }
    setCreditLead(lead: any) {
    this.creditlead = lead;
    }
    getCreditLead() {
        return this.creditlead;
    }
}
