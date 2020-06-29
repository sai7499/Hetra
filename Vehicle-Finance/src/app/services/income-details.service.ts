import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { HttpClient } from '@angular/common/http';
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
    const projectId = this.apiService.api.bankTransaction.projectId;

    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);

    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity, 'income details');

    
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);
}

setAllIncomeDetails(data)
{
  const processData = data;
  const processId = this.apiService.api.setAllIncomeDetails.processId;
  const workflowId = this.apiService.api.setAllIncomeDetails.workflowId;
  const projectId = this.apiService.api.bankTransaction.projectId;


  const userId = localStorage.getItem('userId');
  console.log('userid in service', userId);

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables:  processData,
      workflowId,
      projectId
  };
  console.log(requestEntity, 'Set income details');

  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
 
  return this.httpService.post(url, requestEntity);
}
softDeleteIncomeDetails(data){
  const processData = data;
  const processId = this.apiService.api.softDeleteIncomeDetails.processId;
  const workflowId = this.apiService.api.softDeleteIncomeDetails.workflowId;
  const projectId = this.apiService.api.bankTransaction.projectId;
  const userId = localStorage.getItem('userId');
  console.log('userid in service', userId);

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables:  processData,
      workflowId,
      projectId
  };
  console.log(requestEntity, 'delete income details');

  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
 
  return this.httpService.post(url, requestEntity);
}
getAllAplicantDetails(data){
  const processData = data;
    const processId = this.apiService.api.getAllAplicantDetails.processId;
    const workflowId = this.apiService.api.getAllAplicantDetails.workflowId;
    const projectId = this.apiService.api.bankTransaction.projectId;

    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);

    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity, 'income details');

    
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);
}
getFactoringValue(data){
  const processData = data;
  const processId = this.apiService.api.getFactoringValue.processId;
  const workflowId = this.apiService.api.getFactoringValue.workflowId;
  const projectId = this.apiService.api.bankTransaction.projectId;

  const userId = localStorage.getItem('userId');
  console.log('userid in service', userId);

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables:  processData,
      workflowId,
      projectId
  };
  console.log(requestEntity, 'income details');

  
  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
  
  return this.httpService.post(url, requestEntity);
}
}
