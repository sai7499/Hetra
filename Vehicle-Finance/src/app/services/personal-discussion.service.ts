import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalDiscussionService {
  pdData: {
    processId?: string;
    workflowId?: string;
  };
  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
  ) { this.pdData = this.apiService.api.getPdData; }

  getPdData(data) {
    const projectId = environment.projectIds.creditProjectId;
    const processId = this.pdData.processId;
    const workflowId = this.pdData.workflowId;

    const body = {
      projectId,
      processId,
      workflowId,
      ProcessVariables: {
        ...data
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
