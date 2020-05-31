import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
<<<<<<< HEAD
import { ApiService } from './api.service';
=======
>>>>>>> 45da71d90e244fe864202f5a243e96842f358911

@Injectable({
  providedIn: 'root'
})
export class IncomeDetailsService {

<<<<<<< HEAD
  constructor( private httpService: HttpService,  private apiService: ApiService) { }
  getAllIncomeDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getAllIncomeDetails.processId;
    const workflowId = this.apiService.api.getAllIncomeDetails.workflowId;
    const projectId = this.apiService.api.bankTransaction.projectId;
=======
  constructor( private httpService: HttpService, ) { }
  getAllIncomeDetails(data) {
    const processData = data;
    const processId = environment.api.getAllIncomeDetails.processId;
    const workflowId = environment.api.getAllIncomeDetails.workflowId;
    const projectId = environment.projectId;
>>>>>>> 45da71d90e244fe864202f5a243e96842f358911

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
<<<<<<< HEAD
  const processId = this.apiService.api.setAllIncomeDetails.processId;
  const workflowId = this.apiService.api.setAllIncomeDetails.workflowId;
  const projectId = this.apiService.api.bankTransaction.projectId;

=======
  const processId = environment.api.setAllIncomeDetails.processId;
  const workflowId = environment.api.setAllIncomeDetails.workflowId;
  const projectId = environment.projectId;
>>>>>>> 45da71d90e244fe864202f5a243e96842f358911

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
<<<<<<< HEAD
softDeleteIncomeDetails(data){
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
  console.log(requestEntity, 'delete income details');

  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
 
  return this.httpService.post(url, requestEntity);
}
=======
>>>>>>> 45da71d90e244fe864202f5a243e96842f358911
}
