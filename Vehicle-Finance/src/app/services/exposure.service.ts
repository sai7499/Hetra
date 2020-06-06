import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
@Injectable({
  providedIn: 'root',
})
export class ExposureService {
  constructor(
    private httpService: HttpService,
    private apiService: ApiService
  ) {}

  setExposureDetails(data) {
    const processData = data;
    const processId = this.apiService.api.saveExposure.processId;
    const workflowId = this.apiService.api.saveExposure.workflowId;
    const projectId = this.apiService.api.saveExposure.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId,
    };

    // tslint:disable-next-line: max-line-length
    const url =
      environment.host +
      'd/workflows/' +
      workflowId +
      '/' +
      environment.apiVersion.api +
      'execute?projectId=' +
      projectId;
    return this.httpService.post(url, requestEntity);
  }
  getExposureDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getExposure.processId;
    const workflowId = this.apiService.api.getExposure.workflowId;
    const projectId = this.apiService.api.getExposure.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId,
    };

    // tslint:disable-next-line: max-line-length
    const url =
      environment.host +
      'd/workflows/' +
      workflowId +
      '/' +
      environment.apiVersion.api +
      'execute?projectId=' +
      projectId;
    return this.httpService.post(url, requestEntity);
  }
  deleteExposureDetails(data) {
    const processData = data;
    const processId = this.apiService.api.deleteExposure.processId;
    const workflowId = this.apiService.api.deleteExposure.workflowId;
    const projectId = this.apiService.api.deleteExposure.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId,
    };

    // tslint:disable-next-line: max-line-length
    const url =
      environment.host +
      'd/workflows/' +
      workflowId +
      '/' +
      environment.apiVersion.api +
      'execute?projectId=' +
      projectId;
    return this.httpService.post(url, requestEntity);
  }
}
