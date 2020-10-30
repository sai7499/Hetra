import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';

import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CamService {

  constructor(private httpService: HttpService, private apiService: ApiService) { }

  getCamDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getCamDetails.processId;
    const workflowId = this.apiService.api.getCamDetails.workflowId;
    const projectId = this.apiService.api.getCamDetails.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;

    return this.httpService.post(url, requestEntity);
  }

  getCamUsedCvDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getCamUsedCvDetails.processId;
    const workflowId = this.apiService.api.getCamUsedCvDetails.workflowId;
    const projectId = this.apiService.api.getCamUsedCvDetails.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;

    return this.httpService.post(url, requestEntity);
  }

  saveCamRemarks(data) {
    const processData = data;
    const processId = this.apiService.api.saveCamRemarks.processId;
    const workflowId = this.apiService.api.saveCamRemarks.workflowId;
    const projectId = this.apiService.api.saveCamRemarks.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;

    return this.httpService.post(url, requestEntity);
  }

  getCamUsedCarDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getCamUsedCarDetails.processId;
    const workflowId = this.apiService.api.getCamUsedCarDetails.workflowId;
    const projectId = this.apiService.api.getCamUsedCarDetails.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;

    return this.httpService.post(url, requestEntity);
  }

  getCamNewCvDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getCamNewCvDetails.processId;
    const workflowId = this.apiService.api.getCamNewCvDetails.workflowId;
    const projectId = this.apiService.api.getCamNewCvDetails.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;

    return this.httpService.post(url, requestEntity);
  }
  getBackToSales(data) {
    const processData = data;
    const processId = this.apiService.api.sendBackToSales.processId;
    const workflowId = this.apiService.api.sendBackToSales.workflowId;
    const projectId = this.apiService.api.sendBackToSales.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;

    return this.httpService.post(url, requestEntity);
  }
}
