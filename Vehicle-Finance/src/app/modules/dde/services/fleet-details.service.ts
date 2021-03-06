import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FleetDetailsService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService) { }

  // method for save or update fleet detals

  saveOrUpdateFleetDetails(data) {

    const processData = data;
    const processId = this.apiService.api.saveUpdateFleetDetails.processId;
    const workflowId = this.apiService.api.saveUpdateFleetDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;



    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // method for get fleet details

  getFleetDetails(data) {

    const processData = data;
    const processId = this.apiService.api.getFleetDetails.processId;
    const workflowId = this.apiService.api.getFleetDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;



    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  deleteFleetDetails(data) {

    const processData = data;
    const processId = this.apiService.api.deleteFleetDetails.processId;
    const workflowId = this.apiService.api.deleteFleetDetails.workflowId;
    const projectId = this.apiService.api.deleteFleetDetails.projectId;


    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }


  validateFleetDetails(data) {
    const processData = data;
    const processId = this.apiService.api.validateFleetDetails.processId;
    const workflowId = this.apiService.api.validateFleetDetails.workflowId;
    const projectId = this.apiService.api.validateFleetDetails.projectId;


    const body: RequestEntity = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: processData,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  saveValidRecords(data) {
    const processData = data;
    const processId = this.apiService.api.saveValidRecords.processId;
    const workflowId = this.apiService.api.saveValidRecords.workflowId;
    const projectId = this.apiService.api.saveValidRecords.projectId;


    const body: RequestEntity = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: processData,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }


}
