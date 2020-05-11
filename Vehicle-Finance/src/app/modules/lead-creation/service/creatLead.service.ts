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

        const requestEntity: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                "loanLeadDetails": loanLeadDetail,
                "applicantDetails": applicantDetail,
                "loginId": email
            },
            workflowId: workflowId,
            projectId: projectId
        };

        const body = {
            'processVariables':
                JSON.stringify(requestEntity)
        };
        let url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
        // let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
        return this.httpService.post(url, body);
    }
}