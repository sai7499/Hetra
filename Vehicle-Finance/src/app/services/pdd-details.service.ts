import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class PddDetailsService {
  userId: any;

  constructor( private httpService: HttpService,  private apiService: ApiService) { }

  getPddDetails(data) {

    const processData = data;
    const processId = this.apiService.api.getPddDetails.processId;
    const workflowId = this.apiService.api.getPddDetails.workflowId;
    const projectId = this.apiService.api.getPddDetails.projectId;

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
updatePddDetails(data) {

  const processData = data;
  const processId = this.apiService.api.updatePddDetails.processId;
  const workflowId = this.apiService.api.updatePddDetails.workflowId;
  const projectId = this.apiService.api.updatePddDetails.projectId;

  this.userId = localStorage.getItem('userId');

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: {
        userId: this.userId,
        ...data
      },
      workflowId,
      projectId
  };
  console.log(requestEntity);
  
  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
  console.log(url);
  
  return this.httpService.post(url, requestEntity);
  
}
}
