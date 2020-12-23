import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class QueryModelService {

  constructor(private apiService: ApiService, private httpService: HttpService) { }

  // 1.method for getting queries

  getQueries(data) {

    const processId = this.apiService.api.getQueries.processId;
    const workflowId = this.apiService.api.getQueries.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 2.method for save or update query

  saveOrUpdateVehcicleDetails(data) {

    const processId = this.apiService.api.saveorUpdateQueries.processId;
    const workflowId = this.apiService.api.saveorUpdateQueries.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 3.method for get leads

  getLeads(data) {

    const processId = this.apiService.api.getLeads.processId;
    const workflowId = this.apiService.api.getLeads.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 4.method for get users

  getUsers(data) {

    const processId = this.apiService.api.getUsers.processId;
    const workflowId = this.apiService.api.getUsers.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 5.method for get count

  getCountAcrossLeads(userId) {
    const processId = this.apiService.api.getCount.processId;
    const workflowId = this.apiService.api.getCount.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: {
        "userId": userId
      },
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // Update Query Status

  updateQueryStatus(data) {
    const processId = this.apiService.api.updateStatus.processId;
    const workflowId = this.apiService.api.updateStatus.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId,
      showLoader: false
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

}
