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

    submitToSanctionLeads(data) {
      const processData = data;
      const processId = this.apiService.api.submitToSanctionLeads.processId;
      const workflowId = this.apiService.api.submitToSanctionLeads.workflowId;
      const projectId = this.apiService.api.submitToSanctionLeads.projectId;

      const userId = localStorage.getItem('userId')

      const body: RequestEntity = {
        processId: processId,
        ProcessVariables: {
          ...processData
        },
        workflowId: workflowId,
        projectId: projectId
    };

      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
    }

    assignTaskToTSAndCPC(data){
      const processData = data;
      const processId = this.apiService.api.assignTaskToTSAndCPC.processId;
      const workflowId = this.apiService.api.assignTaskToTSAndCPC.workflowId;
      const projectId = this.apiService.api.assignTaskToTSAndCPC.projectId;
      const body: RequestEntity = {
        processId: processId,
        ProcessVariables: processData,
        workflowId: workflowId,
        projectId: projectId
      };
      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
    }

    submitToCC(data) {
      const processData = data;
      const processId = this.apiService.api.submitToCC.processId;
      const workflowId = this.apiService.api.submitToCC.workflowId;
      const projectId = this.apiService.api.submitToCC.projectId;
      const body: RequestEntity = {
        processId: processId,
        ProcessVariables: processData,
        workflowId: workflowId,
        projectId: projectId
      };
      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
    }
}
