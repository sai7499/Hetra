import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
@Injectable({
  providedIn: 'root'
})
export class CollateralService {

  constructor(private http: HttpClient, private httpService: HttpService, private apiService: ApiService) { }

  // methods for getting additional collaterals data from api

  // 1.method for getting additional collaterals details

  getAdditionalCollateralsDetails(data) {

    const processId = this.apiService.api.getAdditionalCollateralsDetails.processId;
    const workflowId = this.apiService.api.getAdditionalCollateralsDetails.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId
    }
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // 2.method for Save/Update Additional Collaterals

  saveOrUpdateAdditionalCollaterals(data) {

    const processId = this.apiService.api.saveOrUpdateAdditionalCollaterals.processId;
    const workflowId = this.apiService.api.saveOrUpdateAdditionalCollaterals.workflowId;
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

  // 3.method for delete Additional Collaterals

  getDeleteAdditionalCollaterals(id, userId) {

    const processId = this.apiService.api.getDeleteAdditionalCollaterals.processId;
    const workflowId = this.apiService.api.getDeleteAdditionalCollaterals.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: {
        "collateralId": id,
        "userId": userId
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);

  }

}
