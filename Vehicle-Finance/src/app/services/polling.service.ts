import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})

export class PollingService {

  conditionalPollingTok: string = 'JJsZjki6ofISkf/SIfKoHbt9O77X7kF/hy4O7ZshWR0fXZJCEMLuKFgxM9RtZPcl';

  isPollingHeads = {
    'content-type': 'application/json',
    'authentication-token': this.conditionalPollingTok
  }

  constructor(private httpService: HttpService, private apiService: ApiService) { }
  

  // 1.Leads Count

  getPollingLeadCount(userId) {
    const processId = this.apiService.api.getCount.processId;
    const workflowId = this.apiService.api.getCount.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: {
        "userId": userId
      },
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false,
      headers: this.conditionalPollingTok
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 2. Chat Count
  getPollingLeadsCount(data) {

    const processId = this.apiService.api.getLeads.processId;
    const workflowId = this.apiService.api.getLeads.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false,
      headers: this.conditionalPollingTok
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

}