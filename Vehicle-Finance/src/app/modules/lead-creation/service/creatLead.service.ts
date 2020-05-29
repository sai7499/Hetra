import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { storage } from '../../../storage/localstorage';
import { ApiService } from '@services/api.service';
@Injectable({
    providedIn: 'root'
})

export class CreateLeadService {

    constructor(
        private httpService: HttpService,
        private apiService: ApiService
    ) { }

    createLead(loanLeadDetails, applicantDetails, fromDedupe) {
        const processId = this.apiService.api.createLead.processId;
        const workflowId = this.apiService.api.createLead.workflowId;
        const projectId = this.apiService.api.createLead.projectId;

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
        const processId = this.apiService.api.getAssetProductCategory.processId;
        const workflowId = this.apiService.api.getAssetProductCategory.workflowId;
        const projectId = this.apiService.api.getAssetProductCategory.projectId;

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
        const processId = this.apiService.api.getSourcingChannel.processId;
        const workflowId = this.apiService.api.getSourcingChannel.workflowId;
        const projectId = this.apiService.api.getSourcingChannel.projectId;

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
        const processId = this.apiService.api.getLeadById.processId;
        const workflowId = this.apiService.api.getLeadById.workflowId;
        const projectId = this.apiService.api.getLeadById.projectId;

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
