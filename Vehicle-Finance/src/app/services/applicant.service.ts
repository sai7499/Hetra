import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { CreateLeadDataService } from '../modules/lead-creation/service/createLead-data.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  applicantList: {
    processId?: string;
    workflowId?: string;
  };
  applicantDetail: {
    processId?: string;
    workflowId?: string;
  };
  saveUpdateApplicant: {
    processId?: string;
    workflowId?: string;
  };
  private softDeleteDetail: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
    private createLeadDataService: CreateLeadDataService
  ) {
    this.applicantList = this.apiService.api.getApplicantList;
    this.applicantDetail = this.apiService.api.getApplicantDetail;
    this.saveUpdateApplicant = this.apiService.api.saveUpdateApplicant;
    this.softDeleteDetail = this.apiService.api.softDeleteApplicant;
  }

  getApplicantList(data) {
    const projectId = environment.projectIds.salesProjectId;
    const processId = this.applicantList.processId;
    const workflowId = this.applicantList.workflowId;
    const userId = localStorage.getItem('userId');
    const leadDetails: any = this.createLeadDataService.getLeadSectionData();
    // const leadId = leadDetails.leadId;
    const body = {
      projectId,
      processId,
      workflowId,
      ProcessVariables: {
        ...data,
        userId,
        // leadId,
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
    const leadDetails: any = this.createLeadDataService.getLeadSectionData();
    const leadId = leadDetails.leadId;

    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        userId,
        leadId,
        ...data,
      },
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  softDeleteApplicant(data) {
    const projectId = this.softDeleteDetail.projectId;
    const processId = this.softDeleteDetail.processId;
    const workflowId = this.softDeleteDetail.workflowId;

    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');

    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        userId,
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    console.log('url', url);
    console.log('body', JSON.stringify(body));
    return this.httpService.post(url, body);
  }
}
