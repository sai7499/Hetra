import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CreateLeadDataService {
    leadData = {};
    setLeadData(loanLeadDetails, applicantDetails) {
        this.leadData = {
            loanLeadDetails,
            applicantDetails
        };
        console.log('leadService', this.leadData);
    }

    getLeadData() {
        return this.leadData;
    }
}