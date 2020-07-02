import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { HttpService } from '@services/http.service';

@Injectable({
    providedIn: 'root'
})

export class ScoreCardService {

    constructor(
        private apiService: ApiService,
        private httpService: HttpService
    ) { }

    reInitiateCreditScore(leadId, userId) {
        const processId = this.apiService.api.reInitiateCreditScore.processId;
        const workflowId = this.apiService.api.reInitiateCreditScore.workflowId;
        const projectId = environment.projectIds.salesProjectId;

        const body: RequestEntity = {
            processId,
            ProcessVariables: {
                leadId,
                userId
            },
            workflowId,
            projectId
        };

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
}