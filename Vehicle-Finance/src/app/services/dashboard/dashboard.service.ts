import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import RequestEntity from '@model/request.entity';
import { storage } from '../../storage/localstorage';

import { HttpClient } from '@angular/common/http';
import { HttpService } from '@services/http.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  lovData: any;
  dashboardLeadsAction: Subject<object> = new Subject<object>();
  isCreditShow: Observable<object> = this.dashboardLeadsAction.asObservable();

  responseData: Subject<any> = new Subject<any>();
  isFilterData: Observable<any> = this.responseData.asObservable();

  routingData;


  constructor(
    private httpService: HttpService,
    private commonLovService: CommomLovService,
    private apiService: ApiService
    ) { }

  leadsChange(value: object) {
    this.dashboardLeadsAction.next(value);

  }

  filterData(value: any) {
    this.responseData.next(value);
  }


  myLeads(data) {
    const processId = this.apiService.api.getMyLeads.processId;
    const workflowId = this.apiService.api.getMyLeads.workflowId;
    const projectId = this.apiService.api.getMyLeads.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

  getCreditDashboard(data) {
    const processId = this.apiService.api.creditDashboard.processId;
    const workflowId = this.apiService.api.creditDashboard.workflowId;
    const projectId = this.apiService.api.creditDashboard.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

  dashboardFilter(data) {
    const processId = this.apiService.api.dashboardFilter.processId;
    const workflowId = this.apiService.api.dashboardFilter.workflowId;
    const projectId = this.apiService.api.dashboardFilter.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }


  getKycDetails(data) {
    const processId = this.apiService.api.requestKYC.processId;
    const workflowId = this.apiService.api.requestKYC.workflowId;
    const projectId = this.apiService.api.requestKYC.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

  getTrancheDisburseDetails(data) {
    const processId = this.apiService.api.requestTrancheDisburse.processId;
    const workflowId = this.apiService.api.requestTrancheDisburse.workflowId;
    const projectId = this.apiService.api.requestTrancheDisburse.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

  getTaskTrancheDisburseDetails(data) {
    const processId = this.apiService.api.requestTaskTrancheDisburse.processId;
    const workflowId = this.apiService.api.requestTaskTrancheDisburse.workflowId;
    const projectId = this.apiService.api.requestTaskTrancheDisburse.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

  getExternalUserDetails(data) {
    const processId = this.apiService.api.externalUser.processId;
    const workflowId = this.apiService.api.externalUser.workflowId;
    const projectId = this.apiService.api.externalUser.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }


  getExternalUserDashboardDetails(data) {
    const processId = this.apiService.api.externalUserDashboard.processId;
    const workflowId = this.apiService.api.externalUserDashboard.workflowId;
    const projectId = this.apiService.api.externalUserDashboard.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

  getApproveOrRejectDocumentDeferral(data) {
    const processId = this.apiService.api.approveOrRejectDocumentDeferral.processId;
    const workflowId = this.apiService.api.approveOrRejectDocumentDeferral.workflowId;
    const projectId = this.apiService.api.approveOrRejectDocumentDeferral.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

  fetchDashboardTabs(data) {
    const processId = this.apiService.api.fetchDashboardTabs.processId;
    const workflowId = this.apiService.api.fetchDashboardTabs.workflowId;
    const projectId = this.apiService.api.fetchDashboardTabs.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

}
