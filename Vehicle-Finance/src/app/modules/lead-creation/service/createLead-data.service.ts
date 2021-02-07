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
    loanAmountAndTenure = {};
    leadDetailsData = {};
    

    constructor(
        private sharedService: SharedService,
        private cds: CommonDataService
    ) { }

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
        console.log("set lead Called",data);
        this.leadSectionData = data;
        // const requestAmount = this.leadSectionData['leadDetails']['reqLoanAmt'] ?
        //     this.leadSectionData['leadDetails']['reqLoanAmt'] : 0;
        // this.sharedService.changeLoanAmount(Number(requestAmount));
        this.cds.changeleadDataStatus(data ? true : false);
        this.sharedService.setProductCatCode(this.leadSectionData['leadDetails']?this.leadSectionData['leadDetails']['productCatCode'] : '');
        this.sharedService.setProductCatName(this.leadSectionData['leadDetails'] ? this.leadSectionData['leadDetails']['productCatName'] : '');
    }

    getLeadSectionData() {
        return this.leadSectionData;
    }

    setLeadDetailsData(data) {
        this.leadDetailsDataModified(data);
    }

    // getLeadDetailsData() {
    //     return this.leadDetailsData;
    // }

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

    leadDetailsDataModified(data) {
        this.leadSectionData['leadDetails']['bizDivision'] = data.leadDetails.bizDivision;
        this.leadSectionData['leadDetails']['priority'] = data.leadDetails.priority;
        this.leadSectionData['leadDetails']['applicationNo'] = data.leadDetails.applicationNo;
        this.leadSectionData['leadDetails']['productCatCode'] = data.leadDetails.productCatCode;
        this.leadSectionData['leadDetails']['productId'] = data.leadDetails.productId;
        this.leadSectionData['leadDetails']['fundingProgram'] = data.leadDetails.fundingProgram;
        this.leadSectionData['leadDetails']['spokeCode'] = data.leadDetails.spokeCode;
        this.leadSectionData['leadDetails']['sourcingChannel'] = data.leadDetails.sourcingChannel;
        this.leadSectionData['leadDetails']['sourcingType'] = data.leadDetails.sourcingType;
        this.leadSectionData['leadDetails']['sourcingCode'] = data.leadDetails.sourcingCode;
        this.leadSectionData['leadDetails']['sourcingCodeDesc'] = data.leadDetails.sourcingCodeDesc;
        this.leadSectionData['leadDetails']['dealorCode'] = data.leadDetails.dealorCode;
        this.leadSectionData['leadDetails']['dealorCodeDesc'] = data.leadDetails.dealorCodeDesc;
        this.leadSectionData['leadDetails']['typeOfLoan'] = data.leadDetails.typeOfLoan;
        this.leadSectionData['leadDetails']['reqLoanAmt'] = data.leadDetails.reqLoanAmt;
        this.leadSectionData['leadDetails']['reqTenure'] = data.leadDetails.reqTenure;
        this.leadSectionData['leadDetails']['isCommSuppressed'] = data.leadDetails.isCommSuppressed;
        


        const requestAmount = this.leadSectionData['leadDetails']['reqLoanAmt'] ?
            this.leadSectionData['leadDetails']['reqLoanAmt'] : 0;
        this.sharedService.changeLoanAmount(Number(requestAmount));

        this.sharedService.setProductCatCode( this.leadSectionData['leadDetails']['productCatCode']);
        this.sharedService.setProductCatName(this.leadSectionData['leadDetails']['productCatName']);
    }
}
