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

    const email = localStorage.getItem('email');

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

    const email = localStorage.getItem('email');

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }


}
