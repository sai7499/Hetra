import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class IncomeDetailsService {

  constructor( private httpService: HttpService,  private apiService: ApiService) { }
  getAllIncomeDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getAllIncomeDetails.processId;
    const workflowId = this.apiService.api.getAllIncomeDetails.workflowId;
    const projectId = this.apiService.api.getAllIncomeDetails.projectId;

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

setAllIncomeDetails(data)
{
  const processData = data;
  const processId = this.apiService.api.setAllIncomeDetails.processId;
  const workflowId = this.apiService.api.setAllIncomeDetails.workflowId;
  const projectId = this.apiService.api.setAllIncomeDetails.projectId;

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
softDeleteIncomeDetails(data){
  const processData = data;
  const processId = this.apiService.api.softDeleteIncomeDetails.processId;
  const workflowId = this.apiService.api.softDeleteIncomeDetails.workflowId;
  const projectId = this.apiService.api.softDeleteIncomeDetails.projectId;
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
getFactoringValue(data){
  const processData = data;
  const processId = this.apiService.api.getFactoringValue.processId;
  const workflowId = this.apiService.api.getFactoringValue.workflowId;
  const projectId = this.apiService.api.getFactoringValue.projectId;

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
getFoirAsPerPolicy(data){
  const processData = data;
  const processId = this.apiService.api.getFoirAsPerPolicy.processId;
  const workflowId = this.apiService.api.getFoirAsPerPolicy.workflowId;
  const projectId = this.apiService.api.getFoirAsPerPolicy.projectId;

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
