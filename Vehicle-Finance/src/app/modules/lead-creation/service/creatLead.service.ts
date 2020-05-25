import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { storage } from '../../../storage/localstorage';
@Injectable({
    providedIn: 'root'
})

export class CreateLeadService {

    constructor(
        private httpService: HttpService,
    ) { }

    createLead(loanLeadDetails, applicantDetails, fromDedupe) {
        const processId = environment.api.createLead.processId;
        const workflowId = environment.api.createLead.workflowId;
        const projectId = environment.projectId;

        const userId = storage.getUserId();

        if (fromDedupe) {
            console.log("loan", loanLeadDetails)
            console.log("app", applicantDetails)
            const body: RequestEntity = {
                processId: processId,
                ProcessVariables: {
                    loanLeadDetails,
                    applicantDetails,
                    "userId": userId,
                    'toCreateNewLead': true
                },
                workflowId: workflowId,
                projectId: projectId
            };
            const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
            return this.httpService.post(url, body);
        } else {
            const body: RequestEntity = {
                processId: processId,
                ProcessVariables: {
                    "loanLeadDetails": loanLeadDetails,
                    "applicantDetails": applicantDetails,
                    "userId": userId
                },
                workflowId: workflowId,
                projectId: projectId
            };
            const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
            return this.httpService.post(url, body);
        }

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

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
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

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    getLeadById(leadId) {
        const processId = environment.api.getLeadById.processId;
        const workflowId = environment.api.getLeadById.workflowId;
        const projectId = environment.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                'leadId': leadId
            },
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
}
