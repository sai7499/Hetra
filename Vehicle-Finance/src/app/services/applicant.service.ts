import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  constructor(private httpService: HttpService) {}

  getApplicantList(data) {
    const projectId = environment.projectId;
    const processId = environment.api.getApplicantList.processId;
    const workflowId = environment.api.getApplicantList.workflowId;
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
    const projectId = environment.projectId;
    const processId = environment.api.getApplicantDetail.processId;
    const workflowId = environment.api.getApplicantDetail.workflowId;
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
    const processId = environment.api.saveUpdateApplicant.processId;
    const workflowId = environment.api.saveUpdateApplicant.workflowId;
    const projectId = environment.projectId;

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
    return this.httpService.post(url, body);
  }
}
