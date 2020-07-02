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
    ) {}

    getCreditScoreCard() {
        const processId = this.apiService.api.getCreditScoreCard.processId;
        const workflowId = this.apiService.api.getCreditScoreCard.workflowId;
        const projectId = environment.projectIds.salesProjectId;

        const body: RequestEntity = {
            processId,
            ProcessVariables: { "leadId": 143, "userId": "1002" },
            workflowId,
            projectId
        };

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
}