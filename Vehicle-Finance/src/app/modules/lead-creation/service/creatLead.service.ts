import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
@Injectable({
    providedIn: 'root'
})

export class CreateLeadService {

    constructor(
        private httpService: HttpService) { }

    createLead(loanLeadDetail, applicantDetail) {
        const processId = environment.api.createLead.processId;
        const workflowId = environment.api.createLead.workflowId;
        const projectId = environment.projectId;

        let email = localStorage.getItem('email');

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                "loanLeadDetails": loanLeadDetail,
                "applicantDetails": applicantDetail,
                "loginId": email
            },
            workflowId: workflowId,
            projectId: projectId
        };

        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    getProductCategory(bizDivId) {
        const processId = environment.api.getAssetProductCategory.processId;
        const workflowId = environment.api.getAssetProductCategory.workflowId;
        const projectId = environment.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                "bussinessDivision": bizDivId
            },
            workflowId: workflowId,
            projectId: projectId
        };

        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    getSourcingChannel() {
        const processId = environment.api.getSourcingChannel.processId;
        const workflowId = environment.api.getSourcingChannel.workflowId;
        const projectId = environment.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {},
            workflowId: workflowId,
            projectId: projectId
        };

        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
}
