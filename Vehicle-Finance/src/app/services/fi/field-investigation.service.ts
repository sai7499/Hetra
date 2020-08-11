import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../../environments/environment';
import { ApiService } from './../api.service';
import RequestEntity from '@model/request.entity';

@Injectable({
  providedIn: 'root'
})
export class FieldInvestigationService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
  ) { }


  getFiList(data) {
    const processData = data;
    const processId = this.apiService.api.getFiList.processId;
    const workflowId = this.apiService.api.getFiList.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }

  getFiReportDetails(data) {

    const processData = data;
    const processId = this.apiService.api.getFiReportDetails.processId;
    const workflowId = this.apiService.api.getFiReportDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }


  saveOrUpdateFiReportDetails(data) {

    const processData = data;
    const processId = this.apiService.api.saveOrUpdateFiReportDetails.processId;
    const workflowId = this.apiService.api.saveOrUpdateFiReportDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }
  SumbitFiReportDetails(data) {
    const processData = data;
    const processId = this.apiService.api.submitFiReportDetais.processId;
    const workflowId = this.apiService.api.submitFiReportDetais.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }
  reinitiateFiReportDetails(data) {
    const processData = data;
    const processId = this.apiService.api.reinitiateFiDetails.processId;
    const workflowId = this.apiService.api.reinitiateFiDetails.workflowId;
    const projectId = environment.projectIds.reinititateFiApi;

    const body: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }
}
