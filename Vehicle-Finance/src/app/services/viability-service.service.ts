import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ApiService } from './api.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ViabilityServiceService {
  CollateralObj: any;
  collateralId: any;

  constructor(private httpService: HttpService,
              private apiService: ApiService,
              private route: ActivatedRoute) {
              }
      setViabilityDetails(data) {
      const processData = data;
      const processId = this.apiService.api.setViability.processId;
      const workflowId = this.apiService.api.setViability.workflowId;
      const projectId = this.apiService.api.setViability.projectId;

      const userId = localStorage.getItem('userId');

      const requestEntity: RequestEntity = {
        processId,
        ProcessVariables: processData,
        workflowId,
        projectId
      };

      const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
      return this.httpService.post(url, requestEntity);
    }
    getViabilityDetails(data) {
      const processData = data;
      const processId = this.apiService.api.getViability.processId;
      const workflowId = this.apiService.api.getViability.workflowId;
      const projectId = this.apiService.api.getViability.projectId;

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
    getViabilityList(data) {
      const body = {
        leadId : Number(data.leadId)
      };
      const processData = body;
      const processId = this.apiService.api.getViabilityList.processId;
      const workflowId = this.apiService.api.getViabilityList.workflowId;
      const projectId = this.apiService.api.getViabilityList.projectId;

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
    submitViabilityTask(data) {

      const processData = data;
      const processId = this.apiService.api.submitViabilityTask.processId;
      const workflowId = this.apiService.api.submitViabilityTask.workflowId;
      const projectId = this.apiService.api.submitViabilityTask.projectId;

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

     CollateralId(data) {
      this.CollateralObj = data;
      console.log(this.CollateralObj, this.collateralId, 'Coll obj');
    }
     getCollateralId() {
      return this.CollateralObj;
    }

}
