import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class SanctionDetailsService {

  constructor( private httpService: HttpService,
               private apiService: ApiService) { }

    getSanctionDetails(data) {
      const processData = data;
      const processId = this.apiService.api.getSanctionDetails.processId;
      const workflowId = this.apiService.api.getSanctionDetails.workflowId;
      const projectId = this.apiService.api.getSanctionDetails.projectId;

      const userId = localStorage.getItem('userId')

      const body: RequestEntity = {
        processId: processId,
        ProcessVariables: {
          leadId: processData
        },
        workflowId: workflowId,
        projectId: projectId
    };

      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
    }
}
