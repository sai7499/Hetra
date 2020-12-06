import { Injectable } from '@angular/core';

import { HttpService } from '@services/http.service';
import { ApiService } from '@services/api.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoanViewService {

    private loan360 = false;
    private loanDetails: any;
    private addressDetails: any;

    constructor(private httpService: HttpService, private apiService: ApiService) {}

    isLoan360(value: boolean) {
        this.loan360 = value;
    }

    checkIsLoan360() {
        return this.loan360;
    }

    setLoanAccountDetails(value) {
        this.loanDetails = value;
    }

    getLoanAccountDetails() {
        return this.loanDetails;
    }

    setLoanAccountAddress(value) {
        this.addressDetails = value;
    }

    getLoanAccountAddress() {
        return this.addressDetails;
    }

    getLoanDetails(leadId) {
        const processData = {
            leadId
        };
        const processId = this.apiService.api.getLoan360.processId;
        const workflowId = this.apiService.api.getLoan360.workflowId;
        const projectId = this.apiService.api.getLoan360.projectId;

        const body = {
        processId,
        ProcessVariables: processData,
        workflowId,
        projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
}
