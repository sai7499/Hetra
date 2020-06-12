import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { CreateLeadDataService } from '../modules/lead-creation/service/createLead-data.service';
import { LeadStoreService } from '../modules/sales/services/lead.store.service';
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
  private geoMasterService: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  private applicantDedupe: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  private applicantUcic: {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  };
  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
    private createLeadDataService: CreateLeadDataService,
    private leadStoreService: LeadStoreService
  ) {
    this.applicantList = this.apiService.api.getApplicantList;
    this.applicantDetail = this.apiService.api.getApplicantDetail;
    this.saveUpdateApplicant = this.apiService.api.saveUpdateApplicant;
    this.softDeleteDetail = this.apiService.api.softDeleteApplicant;
    this.geoMasterService = this.apiService.api.geoMasterService;
    this.applicantDedupe = this.apiService.api.salesApplicantDedupe;
    this.applicantUcic = this.apiService.api.salesApplicantUcic;
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
    return this.httpService.post(url, body);
  }

  getGeoMasterValue(data) {
    const projectId = this.geoMasterService.projectId;
    const processId = this.geoMasterService.processId;
    const workflowId = this.geoMasterService.workflowId;
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  checkSalesApplicantDedupe(data) {
    const projectId = this.applicantDedupe.projectId;
    const processId = this.applicantDedupe.processId;
    const workflowId = this.applicantDedupe.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  checkSalesApplicantUcic(data) {
    const projectId = this.applicantUcic.projectId;
    const processId = this.applicantUcic.processId;
    const workflowId = this.applicantUcic.workflowId;
    const userId = localStorage.getItem('userId');
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
