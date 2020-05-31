import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';

@Injectable({
  providedIn: 'root'
})
export class IncomeDetailsService {

  constructor( private httpService: HttpService, ) { }
  getAllIncomeDetails(data) {
    const processData = data;
    const processId = environment.api.getAllIncomeDetails.processId;
    const workflowId = environment.api.getAllIncomeDetails.workflowId;
    const projectId = environment.projectId;

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
  const processId = environment.api.setAllIncomeDetails.processId;
  const workflowId = environment.api.setAllIncomeDetails.workflowId;
  const projectId = environment.projectId;

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
}
