import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import RequestEntity from '@model/request.entity';
import { storage } from "../../storage/localstorage";

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  dashboardLeadsAction: Subject<boolean> = new Subject<boolean>();
  isCreditShow: Observable<boolean> = this.dashboardLeadsAction.asObservable();

  constructor(private http: HttpClient) { }

  leadsChange(value: boolean) {
    this.dashboardLeadsAction.next(value);
  }

  myLeads() {
    const processId = environment.api.getMyLeads.processId;
    const workflowId = environment.api.getMyLeads.workflowId;
    const projectId = environment.projectId;

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {"userId": storage.getUserId()},
      workflowId: workflowId,
      projectId: projectId
    };
    return this.http.post(url, body);
  }

}
