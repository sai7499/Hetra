import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';
import { HttpService } from '../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class OdDetailsService {

  constructor(private apiService : ApiService, private httpService : HttpService) { }

  getOdApplicantList(data){
    const processData = data;
    const processId = this.apiService.api.getOdApplicantList.processId;
    const workflowId = this.apiService.api.getOdApplicantList.workflowId;
    const projectId = this.apiService.api.getOdApplicantList.projectId;
    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);
  
    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity, '--->get applicant list for od details ');
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);

  
  }
  saveParentOdDetails(data){
    const processData = data;
    const processId = this.apiService.api.saveParentOdDetails.processId;
    const workflowId = this.apiService.api.saveParentOdDetails.workflowId;
    const projectId = this.apiService.api.saveParentOdDetails.projectId;
    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);
  
    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity, '--->put parent od details ');
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);

  
  }
  getParentOdDetails(data){
    const processData = data;
    const processId = this.apiService.api.getParentOdDetails.processId;
    const workflowId = this.apiService.api.getParentOdDetails.workflowId;
    const projectId = this.apiService.api.getParentOdDetails.projectId;
    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);
  
    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity, '--->get parent od details ');
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);

  
  }
  getOdDetails(data){
    const processData = data;
    const processId = this.apiService.api.getOdDetails.processId;
    const workflowId = this.apiService.api.getOdDetails.workflowId;
    const projectId = this.apiService.api.getOdDetails.projectId;
    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);
  
    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity, '--->get od details ');
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);

  
  }
}
