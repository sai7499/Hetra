import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import RequestEntity from '@model/request.entity';
import { environment } from '../../../environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class TvrDetailsService {

  constructor(
    private apiService: ApiService,
    private httpService: HttpService
  ) { }

  getTvrDetailsList(data) {
    const processData = data;
    const processId = this.apiService.api.getTvrList.processId;
    const workflowId = this.apiService.api.getTvrList.workflowId;
    const projectId = this.apiService.api.getTvrList.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, requestEntity);
  }

  setTvrDetails(data) {
    const processData = data;
    const processId = this.apiService.api.saveTvrDetails.processId;
    const workflowId = this.apiService.api.saveTvrDetails.workflowId;
    const projectId = this.apiService.api.saveTvrDetails.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, requestEntity);
  }

  getTvrDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getTvrDetails.processId;
    const workflowId = this.apiService.api.getTvrDetails.workflowId;
    const projectId = this.apiService.api.getTvrDetails.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      // ProcessVariables: {applicantId: 481},
      workflowId,
      projectId,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, requestEntity);
  }
}
