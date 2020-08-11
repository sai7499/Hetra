import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class TermSheetService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService) { }


  getTermSheet(data) {
    const processData = data;
    const processId = this.apiService.api.getTermSheet.processId;
    const workflowId = this.apiService.api.getTermSheet.workflowId;
    const projectId = this.apiService.api.getTermSheet.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
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
  
}
