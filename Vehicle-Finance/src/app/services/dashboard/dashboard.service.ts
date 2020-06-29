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

  

  constructor(
    private httpService: HttpService,
    private commonLovService: CommomLovService,
    private apiService: ApiService
    ) { }

  leadsChange(value: object) {
    console.log(value);
    this.dashboardLeadsAction.next(value);

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

}
