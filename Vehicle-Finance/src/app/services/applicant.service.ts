import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private applicantList: {
    processId?: string;
    workflowId?: string;
  };
  private applicantDetail: {
    processId?: string;
    workflowId?: string;
  };
  private saveUpdateApplicant: {
    processId?: string;
    workflowId?: string;
  };
  constructor(
    private httpService: HttpService,
    private apiService: ApiService
  ) {
    this.applicantList = this.apiService.api.getApplicantList;
    this.applicantDetail = this.apiService.api.getApplicantDetail;
    this.saveUpdateApplicant = this.apiService.api.saveUpdateApplicant;
  }

  getApplicantList(data) {
    const projectId = environment.projectIds.salesProjectId;
    const processId = this.applicantList.processId;
    const workflowId = this.applicantList.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      projectId,
      processId,
      workflowId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getApplicantDetail(data) {
    const projectId = environment.projectIds.salesProjectId;
    const processId = this.applicantDetail.processId;
    const workflowId = this.applicantDetail.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      projectId,
      processId,
      workflowId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  saveApplicant(data) {
    const projectId = environment.projectIds.salesProjectId;
    const processId = this.saveUpdateApplicant.processId;
    const workflowId = this.saveUpdateApplicant.workflowId;

    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');

    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        userId,
        leadId: 3,
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    console.log('url', url);
    console.log('body', JSON.stringify(body));
    return this.httpService.post(url, body);
  }
}
