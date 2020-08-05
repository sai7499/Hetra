import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor( private apiService: ApiService,
               private httpService: HttpService,  ) { }
  saveCheckListDetails(data) {
    const processData = data;
    const processId = this.apiService.api.saveCheckList.processId;
    const workflowId = this.apiService.api.saveCheckList.workflowId;
    const projectId = this.apiService.api.saveCheckList.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }

  getCheckListDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getCheckList.processId;
    const workflowId = this.apiService.api.getCheckList.workflowId;
    const projectId = this.apiService.api.getCheckList.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }
}
