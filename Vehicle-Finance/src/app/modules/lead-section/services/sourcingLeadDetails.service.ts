import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { HttpService } from '@services/http.service';

@Injectable({
    providedIn: 'root'
})
export class LeadDetails {

    constructor(
        private apiService: ApiService,
        private httpService: HttpService
    ) { }

    saveAndUpdateLead(leadDetails) {
        const processId = this.apiService.api.saveAndUpdateLead.processId;
        const workflowId = this.apiService.api.saveAndUpdateLead.workflowId;
        const projectId = this.apiService.api.saveAndUpdateLead.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                leadId: leadDetails.leadId,
                sourcingCode: leadDetails.sourcingCode,
                branchId: leadDetails.loanBranch,
                productId: leadDetails.productCategory,
                reqLoanAmt: leadDetails.requestedLoanAmount,
                reqTenure: leadDetails.requestedLoanTenor,
                leadHandledBy: leadDetails.leadHandeledBy,
                leadCreatedBy: leadDetails.leadCreatedBy,
                leadCreatedOn: leadDetails.leadCreatedOn,

                priority: leadDetails.priority,
                spokesId: leadDetails.spokeCode,
                sourcingChannel: leadDetails.sourcingChannel,
                sourcingType: leadDetails.sourcingType,
                bizDivision: leadDetails.bizDivision,
                userId: leadDetails.userId
            },
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

}