import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdcServiceService {

  constructor(private apiService: ApiService,
    private httpService: HttpService,) { }

  savePdcDetails(data) {
    const processData = data;
    const processId = this.apiService.api.savePdcDetails.processId;
    const workflowId = this.apiService.api.savePdcDetails.workflowId;
    const projectId = this.apiService.api.savePdcDetails.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    const url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }

  getPdcDetails(data) {
    const processData = data;
    const processId = this.apiService.api.getPdcDetails.processId;
    const workflowId = this.apiService.api.getPdcDetails.workflowId;
    const projectId = this.apiService.api.getPdcDetails.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    const url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }

  deletePdcDetails(data) {
    const processData = data;
    const processId = this.apiService.api.deletePdcDetails.processId;
    const workflowId = this.apiService.api.deletePdcDetails.workflowId;
    const projectId = this.apiService.api.deletePdcDetails.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    const url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }

  // 4. Get Users for receiving Cheque

  getUsersFilter(data) {
    const processId = this.apiService.api.getUsersFilter.processId;
    const workflowId = this.apiService.api.getUsersFilter.workflowId;
    const projectId = this.apiService.api.getUsersFilter.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    const url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }

  // 5. Submit Defferral PDC/SPDC

  submitDeferral(data) {
    const processId = this.apiService.api.submitDeferral.processId;
    const workflowId = this.apiService.api.submitDeferral.workflowId;
    const projectId = this.apiService.api.submitDeferral.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    const url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }


  // 6. Acknowledge Defferral PDC/SPDC

  acknowledgeDeferral(data) {
    const processId = this.apiService.api.acknowledgeDeferral.processId;
    const workflowId = this.apiService.api.acknowledgeDeferral.workflowId;
    const projectId = this.apiService.api.acknowledgeDeferral.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };

    // tslint:disable-next-line: max-line-length
    const url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }


}
