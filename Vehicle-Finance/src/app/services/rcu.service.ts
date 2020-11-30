import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class RcuService {
  userId: any;

  constructor( private httpService: HttpService,  private apiService: ApiService) { }

 public getRcuDetails(data) {

    const processData = data;
    const processId = this.apiService.api.getRcuDetails.processId;
    const workflowId = this.apiService.api.getRcuDetails.workflowId;
    const projectId = this.apiService.api.getRcuDetails.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity);
    
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    console.log(url);
    
    return this.httpService.post(url, requestEntity);
    
}
saveUpdateRcuDetails(data) {

  const processData = data;
  const processId = this.apiService.api.saveUpdateRcuDetails.processId;
  const workflowId = this.apiService.api.saveUpdateRcuDetails.workflowId;
  const projectId = this.apiService.api.saveUpdateRcuDetails.projectId;

  const userId = localStorage.getItem('userId');

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables:  processData,
      workflowId,
      projectId
  };
  console.log(requestEntity);
  
  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
  console.log(url);
  
  return this.httpService.post(url, requestEntity);
  
}

getAllAplicantDetails(data){
  const processData = data;
    const processId = this.apiService.api.getAllAplicantDetails.processId;
    const workflowId = this.apiService.api.getAllAplicantDetails.workflowId;
    const projectId = this.apiService.api.getAllAplicantDetails.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);
}
assignRcuTask(data){
  const processData = data;
  const processId = this.apiService.api.assignRcuTask.processId;
  const workflowId = this.apiService.api.assignRcuTask.workflowId;
  const projectId = this.apiService.api.assignRcuTask.projectId;

  const userId = localStorage.getItem('userId');

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables:  processData,
      workflowId,
      projectId
  };
  
  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
  
  return this.httpService.post(url, requestEntity);
}
stopRcuTask(data){
  const processData = data;
  const processId = this.apiService.api.stopRcuTask.processId;
  const workflowId = this.apiService.api.stopRcuTask.workflowId;
  const projectId = this.apiService.api.stopRcuTask.projectId;

  const userId = localStorage.getItem('userId');

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables:  processData,
      workflowId,
      projectId
  };
  
  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
  
  return this.httpService.post(url, requestEntity);
}
}
