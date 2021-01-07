import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CpcRolesService {

  constructor(private apiService: ApiService,
    private httpService: HttpService) { }

  getCPCRolesDetails(data) {
    const processData = data;
    const processId = this.apiService.api.assignCPCRules.processId;
    const workflowId = this.apiService.api.assignCPCRules.workflowId;
    const projectId = this.apiService.api.assignCPCRules.projectId;

    const userId = localStorage.getItem('userId');

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

  getAssetRemarks(data){
    const processData = data;
    const processId = this.apiService.api.getAssetRemarks.processId;
    const workflowId = this.apiService.api.getAssetRemarks.workflowId;
    const projectId = this.apiService.api.getAssetRemarks.projectId;

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

  saveAssetRemarks(data){
    const processData = data;
    const processId = this.apiService.api.saveAssetRemarks.processId;
    const workflowId = this.apiService.api.saveAssetRemarks.workflowId;
    const projectId = this.apiService.api.saveAssetRemarks.projectId;

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

  assignCPCMaker(data){
    const processData = data;
    const processId = this.apiService.api.assignCPCMaker.processId;
    const workflowId = this.apiService.api.assignCPCMaker.workflowId;
    const projectId = this.apiService.api.assignCPCMaker.projectId;

    

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
// save for declient flow
  saveDeclientRemarks(data){
    const processData = data;
    const processId = this.apiService.api.saveDeclientRemards.processId;
    const workflowId = this.apiService.api.saveDeclientRemards.workflowId;
    const projectId = this.apiService.api.saveDeclientRemards.projectId;

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
  // get declinet remarks
  getDeclientRemarks(data){
    const processData = data;
    const processId = this.apiService.api.getDeclientRemards.processId;
    const workflowId = this.apiService.api.getDeclientRemards.workflowId;
    const projectId = this.apiService.api.getDeclientRemards.projectId;

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

  getRejectRemarks(data){
    const processData = data;
    const processId = this.apiService.api.rejectRemarks.processId;
    const workflowId = this.apiService.api.rejectRemarks.workflowId;
    const projectId = this.apiService.api.rejectRemarks.projectId;

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
}
