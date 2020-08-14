import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import RequestEntity from '../model/request.entity';

@Injectable({
  providedIn: 'root'
})
export class DeviationService {

  constructor(private apiService: ApiService, private httpService: HttpService) { }


  getDeviationsDetails(leadId) {

    const processId = this.apiService.api.getDeviations.processId;
    const workflowId = this.apiService.api.getDeviations.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {
        "leadId": leadId
      },
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  autoDeviationDetails(data) {
    // 

    const processId = this.apiService.api.autoDeviation.processId;
    const workflowId = this.apiService.api.autoDeviation.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }

  getDeviationsMaster(data) {

    const processId = this.apiService.api.getDeviationsMaster.processId;
    const workflowId = this.apiService.api.getDeviationsMaster.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  saveOrUpdateDeviations(leadId, data, userId) {

    const processId = this.apiService.api.saveorUpdateDeviation.processId;
    const workflowId = this.apiService.api.saveorUpdateDeviation.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "leadId": leadId,
        "deviations": data,
        "userId": userId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getDeleteDeviation(id) {

    const processId = this.apiService.api.deleteDeviation.processId;
    const workflowId = this.apiService.api.deleteDeviation.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {
        "rule_dev_id": id
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }

  getReferNextLevel(data) {

    const processId = this.apiService.api.getReferDeviation.processId;
    const workflowId = this.apiService.api.getReferDeviation.workflowId;
    const projectId = this.apiService.api.getReferDeviation.projectId

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }

  approveDeclineDeviation(data) {
    const processId = this.apiService.api.approveDecline.processId;
    const workflowId = this.apiService.api.approveDecline.workflowId;
    const projectId = this.apiService.api.approveDecline.projectId

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }

  approveDeviation(data) {
    const processId = this.apiService.api.approveDeviation.processId;
    const workflowId = this.apiService.api.approveDeviation.workflowId;
    const projectId = this.apiService.api.approveDeviation.projectId

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  sendBackToCredit(data) {
    const processId = this.apiService.api.sendBacktoCredit.processId;
    const workflowId = this.apiService.api.sendBacktoCredit.workflowId;
    const projectId = this.apiService.api.sendBacktoCredit.projectId

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

}
