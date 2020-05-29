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
  setTransactionDetails(data) {
    const processData = data;
    const processId = environment.api.incomeDetails.processId;
    const workflowId = environment.api.incomeDetails.workflowId;
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

    // const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
    // tslint:disable-next-line: prefer-const
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    // const body = {
    //     JSON.stringify(requestEntity)
    // };
    return this.httpService.post(url, requestEntity);
}
}
