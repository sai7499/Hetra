import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import RequestEntity from '@model/request.entity';
import { storage } from "../../storage/localstorage";

import { HttpClient } from '@angular/common/http';
import { HttpService } from '@services/http.service';
import { CommomLovService } from '@services/commom-lov-service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  lovData: any;
  userID = 1001;
  dashboardLeadsAction: Subject<boolean> = new Subject<boolean>();
  isCreditShow: Observable<boolean> = this.dashboardLeadsAction.asObservable();

  constructor(
    private httpService: HttpService,
    private commonLovService: CommomLovService
    ) { }

  leadsChange(value: boolean) {
    this.dashboardLeadsAction.next(value);
  }

  myLeads() {
    const processId = environment.api.getMyLeads.processId;
    const workflowId = environment.api.getMyLeads.workflowId;
    const projectId = environment.projectId;


    const body: RequestEntity = {
      processId,
      ProcessVariables: {userId: this.userID},
      workflowId,
      projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

    return this.httpService.post(url, body);
  }

}
