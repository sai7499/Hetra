import { Injectable } from '@angular/core';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { CommonDataService } from '@services/common-data.service';

@Injectable({
    providedIn: 'root'
})
export class CreateLeadDataService {
    leadData = {};
    leadSectionData = {};
    proceedAsNewLeadData = {};
    proceedWithSelectedLead = {};
    constructor(private sharedService: SharedService,
                private cds: CommonDataService){

    }

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
        const requestAmount = this.leadSectionData['leadDetails']['reqLoanAmt']?
                                this.leadSectionData['leadDetails']['reqLoanAmt']: 0;
        this.sharedService.changeLoanAmount(Number( requestAmount));
        this.cds.changeleadDataStatus(data ? true : false);   
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
