import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import RequestEntity from '@model/request.entity';

@Injectable({
  providedIn: 'root'
})
export class LoanCreationService {

  constructor(private httpService: HttpService,
    private apiService: ApiService) { }

  setLoanCreation(data) {
    const processData = data;
    const processId = this.apiService.api.loanCreationWrapper.processId;
    const workflowId = this.apiService.api.loanCreationWrapper.workflowId;
    const projectId = this.apiService.api.loanCreationWrapper.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }
  getLoanProcessLogs(data) {
    const processData = data;
    const processId = this.apiService.api.getProcessLogs.processId;
    const workflowId = this.apiService.api.getProcessLogs.workflowId;
    const projectId = this.apiService.api.getProcessLogs.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }
}
