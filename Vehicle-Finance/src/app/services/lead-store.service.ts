import { Injectable } from '@angular/core';

import { Lead, SourcingDetails, ProductDetails, LoanDetails, VehicleDetails } from '@model/lead.model';

@Injectable({
    providedIn: 'root'
})
export class LeadStoreService {
    leadCreation: Lead;
    constructor() {}

    setLeadCreation(lead: Lead) {
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
        return this.leadCreation.vehicleDetails;
    }

    setLoanDetails(loanDetails: LoanDetails) {
        this.leadCreation.loanDetails = loanDetails;
    }

    getLoanDetails() {
        return this.leadCreation.loanDetails;
    }
}
