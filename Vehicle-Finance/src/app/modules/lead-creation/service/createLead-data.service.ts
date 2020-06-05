import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CreateLeadDataService {
    leadData = {};
    leadSectionData = {};
    proceedAsNewLeadData = {};
    proceedWithSelectedLead = {};

    setLeadData(loanLeadDetails, applicantDetails) {
        this.leadData = {
            loanLeadDetails,
            applicantDetails
        };
    }

    getLeadData() {
        return this.leadData;
    }

    setLeadSectionData(data) {
        this.leadSectionData = data;
    }

    getLeadSectionData() {
        return this.leadSectionData;
    }

    setProceedAsNewLead(data) {
        this.proceedAsNewLeadData = data;
    }

    getProceedAsNewLead() {
        return this.proceedAsNewLeadData;
    }

    setProceedWithSelectedLead(data) {
        this.proceedWithSelectedLead = data;
    }

    getProceedWithSelectedLead() {
        return this.proceedWithSelectedLead;
    }
}
