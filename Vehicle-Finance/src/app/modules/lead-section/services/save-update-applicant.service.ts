import { Injectable } from '@angular/core';
import {HttpService} from '../../../services/http.service';
import RequestEntity from '../../../model/request.entity';
import {environment} from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SaveUpdateApplicantService {

  constructor(
    private httpService : HttpService) { }

    saveApplicant(applicantDetails) {
        const processId = environment.api.saveUpdateApplicant.processId;
        const workflowId = environment.api.saveUpdateApplicant.workflowId;
        const projectId = environment.projectId;

        const email = localStorage.getItem('email');

        const body : RequestEntity = {
          processId : processId,
          ProcessVariables: {
            'applicantDetails' : applicantDetails
          },
          workflowId : workflowId,
          projectId : projectId
        };

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
}
