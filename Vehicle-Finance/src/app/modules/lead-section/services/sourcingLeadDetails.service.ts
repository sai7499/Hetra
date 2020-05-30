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
                leadId: 504,
                sourcingCode: leadDetails.sourcingCode,
                branchType: 9999,
                branchId: leadDetails.loanBranch,
                productId: leadDetails.productCategory,
                reqLoanAmt: leadDetails.requestedLoanAmount,
                reqTenure: leadDetails.requestedLoanTenor,
                leadHandledBy: leadDetails.leadHandeledBy,
                leadCreatedBy: 0,
                leadCreatedOn: '22/5/2020',

                priority: leadDetails.priority,
                spokesId: leadDetails.spokeCode,
                sourcingChannel: leadDetails.sourcingChannel,
                sourcingType: leadDetails.sourcingType,
                bizDivision: leadDetails.bizDivision,
                userId: leadDetails.userId
            },
            // bizDivision: saveAndUpdate.bizDivision,
            // productCategory: Number(saveAndUpdate.productCategory),
            // priority: saveAndUpdate.priority,
            // sourcingChannel: saveAndUpdate.sourcingChannel,
            // sourcingType: saveAndUpdate.sourcingType,
            // sourcingCode: saveAndUpdate.sourcingCode,
            // spokeCode: Number(saveAndUpdate.spokeCode),
            // loanBranch: Number(this.branchId),
            // leadHandeledBy: Number(this.userId),
            // requestedLoanAmount: Number(saveAndUpdate.requestedAmount),
            // requestedLoanTenor: Number(saveAndUpdate.requestedTenor)


            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

}