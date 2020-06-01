import { HttpService } from '../services/http.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BankTransactionsService {

  constructor(private httpService: HttpService,
    private apiService: ApiService) { }
  setTransactionDetails(data) {
    const processData = data;
    const processId = this.apiService.api.bankTransaction.processId;
    const workflowId = this.apiService.api.bankTransaction.workflowId;
    const projectId = this.apiService.api.bankTransaction.projectId;

    const userId = localStorage.getItem('userId');
    console.log('userid in service', userId);

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    console.log(requestEntity, 'bank transactions');

    // const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
    // tslint:disable-next-line: prefer-const
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    // const body = {
    //     JSON.stringify(requestEntity)
    // };
    return this.httpService.post(url, requestEntity);
  }
  getBankDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getBankTransaction.processId;
    const workflowId = this.apiService.api.getBankTransaction.workflowId;
    const projectId = this.apiService.api.getBankTransaction.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    console.log(requestEntity);
    // tslint:disable-next-line: prefer-const
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }
  getBankList(data) {
    const processData = data;
    const processId = this.apiService.api.getBankAccountList.processId;
    const workflowId = this.apiService.api.getBankAccountList.workflowId;
    const projectId = this.apiService.api.getBankAccountList.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    // tslint:disable-next-line: prefer-const
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }
}
