import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import RequestEntity from '@model/request.entity';
import { storage } from "../../storage/localstorage";

import { HttpClient } from '@angular/common/http';
import { HttpService } from '@services/http.service';
import { CommomLovService } from '@services/commom-lov-service';
import { ApiService } from '@services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  lovData: any;
  dashboardLeadsAction: Subject<string> = new Subject<string>();
  isCreditShow: Observable<string> = this.dashboardLeadsAction.asObservable();

  constructor(
    private httpService: HttpService,
    private commonLovService: CommomLovService,
    private apiService: ApiService
    ) { }

  leadsChange(value: string) {
    this.dashboardLeadsAction.next(value);
  }

  myLeads() {
    const processId = this.apiService.api.getMyLeads.processId;
    const workflowId = this.apiService.api.getMyLeads.workflowId;
    const projectId = this.apiService.api.getMyLeads.projectId;


    const body: RequestEntity = {
      processId : processId,
      ProcessVariables: {userId: Number(storage.getUserId()), perPage: 10},
      workflowId : workflowId,
      projectId : projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

}
