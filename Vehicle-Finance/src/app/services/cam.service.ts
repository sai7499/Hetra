import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CamService {

  constructor( private httpService: HttpService,  private apiService: ApiService) { }
  
  getCamDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getCamDetails.processId;
    const workflowId = this.apiService.api.getCamDetails.workflowId;
    const projectId = this.apiService.api.getCamDetails.projectId;

    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);

    const requestEntity: RequestEntity = {
        processId,
        ProcessVariables:  processData,
        workflowId,
        projectId
    };
    console.log(requestEntity, 'cam details');

    
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    
    return this.httpService.post(url, requestEntity);
}

getCamUsedCvDetails(data) {
  const processData = data;
  const processId = this.apiService.api.getCamUsedCvDetails.processId;
  const workflowId = this.apiService.api.getCamUsedCvDetails.workflowId;
  const projectId = this.apiService.api.getCamUsedCvDetails.projectId;

  const userId = localStorage.getItem('userId');
  console.log('userid in service', userId);

  const requestEntity: RequestEntity = {
      processId,
      ProcessVariables:  processData,
      workflowId,
      projectId
  };
  console.log(requestEntity, 'cam used cv details');

  
  let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
  
  return this.httpService.post(url, requestEntity);
}


}
