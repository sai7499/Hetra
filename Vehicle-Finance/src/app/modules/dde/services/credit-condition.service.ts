import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CreditConditionService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService) { }


  getCreditConditions(data) {
    const processData = data;
    const processId = this.apiService.api.getCreditConditions.processId;
    const workflowId = this.apiService.api.getCreditConditions.workflowId;
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

  deleteCreditConditions(data) {
    const processData = data;
    const processId = this.apiService.api.deleteCreditConditions.processId;
    const workflowId = this.apiService.api.deleteCreditConditions.workflowId;
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
  submitReferDeclineCreditConditions(data){
    const processData = data;
    const processId = this.apiService.api.submitReferDeclineCreditConditions.processId;
    const workflowId = this.apiService.api.submitReferDeclineCreditConditions.workflowId;
    const projectId = this.apiService.api.submitReferDeclineCreditConditions.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  
  approveCreditConditions(data){
    const processData = data;
    const processId = this.apiService.api.approveCreditConditions.processId;
    const workflowId = this.apiService.api.approveCreditConditions.workflowId;
    const projectId = this.apiService.api.approveCreditConditions.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  // declinedCreditConditions(data){
  //   const processData = data;
  //   const processId = this.apiService.api.declineCreditConditions.processId;
  //   const workflowId = this.apiService.api.declineCreditConditions.workflowId;
  //   const projectId = this.apiService.api.declineCreditConditions.projectId;
  //   const body: RequestEntity = {
  //     processId: processId,
  //     ProcessVariables: processData,
  //     workflowId: workflowId,
  //     projectId: projectId
  //   };
  //   const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  //   return this.httpService.post(url, body);
  // }
  saveUpdateCreditConditions(data) {
    const processData = data;
    const processId = this.apiService.api.saveAndUpdateCreditConditions.processId;
    const workflowId = this.apiService.api.saveAndUpdateCreditConditions.workflowId;
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
  assignCDTaskFromSales(data){
    const processData = data;
    const processId = this.apiService.api.assignCDTaskFromSales.processId;
    const workflowId = this.apiService.api.assignCDTaskFromSales.workflowId;
    const projectId = environment.projectIds.submitToCredit;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  rejectCreditCondition(data){
    const processData = data;
    const processId = this.apiService.api.rejectCreditCondition.processId;
    const workflowId = this.apiService.api.rejectCreditCondition.workflowId;
    const projectId = environment.projectIds.submitToCredit;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  getLeadRejectReason(data){
    const processData = data;
    const processId = this.apiService.api.getLeadRejectReason.processId;
    const workflowId = this.apiService.api.getLeadRejectReason.workflowId;
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
}
