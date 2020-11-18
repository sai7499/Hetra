import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import RequestEntity from '@model/request.entity';

@Injectable({
    providedIn: 'root'
})

export class LeadHistoryService {

    constructor(
        private httpService: HttpService,
        private apiService: ApiService
    ) { }

    leadHistoryApi(leadId) {
        const processId = this.apiService.api.leadHistory.processId;
        const workflowId = this.apiService.api.leadHistory.workflowId;
        const projectId = this.apiService.api.leadHistory.projectId;

        const requestEntity: RequestEntity = {
            processId,
            ProcessVariables: {
                leadId
            },
            workflowId,
            projectId
        };

        // tslint:disable-next-line: max-line-length
        let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
        return this.httpService.post(url, requestEntity);
    }

}