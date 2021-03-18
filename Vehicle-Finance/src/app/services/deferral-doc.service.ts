import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DeferralDocService {
constructor(
    private httpService: HttpService,
    private apiService: ApiService
) { }

getDeferralDocs(data) {
    const getDeferralDocs = this.apiService.api.getDeferralDocs;
    const projectId = getDeferralDocs.projectId;
    const processId = getDeferralDocs.processId;
    const workflowId = getDeferralDocs.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
        processId,
        workflowId,
        projectId,
        ProcessVariables: {
            userId,
            ...data,
            },
        };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
    }


submitDefDocuments(data) {
    const submitDefDocuments = this.apiService.api.submitDefDocuments;
    const projectId = submitDefDocuments.projectId;
    const processId = submitDefDocuments.processId;
    const workflowId = submitDefDocuments.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
        processId,
        workflowId,
        projectId,
        ProcessVariables: {
            userId,
            ...data,
            },
        };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
    }
}