import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { HttpService } from '@services/http.service';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class LeadUploadService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService) { }


  validateLeadDetails(data) {
    const processData = data;
    const processId = this.apiService.api.validateLeadDetails.processId;
    const workflowId = this.apiService.api.validateLeadDetails.workflowId;
    const projectId = this.apiService.api.validateLeadDetails.projectId;


    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: processData,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  saveValidRecords(data) {
    const processData = data;
    const processId = this.apiService.api.saveValidLeadRecords.processId;
    const workflowId = this.apiService.api.saveValidLeadRecords.workflowId;
    const projectId = this.apiService.api.saveValidLeadRecords.projectId;


    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: processData,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }


}