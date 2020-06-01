import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import RequestEntity from '@model/request.entity';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SaveUpdateApplicantService {
  constructor(private httpService: HttpService) {}

  saveApplicant(data) {
    // const processId = environment.api.saveUpdateApplicant.processId;
    // const workflowId = environment.api.saveUpdateApplicant.workflowId;
    // const projectId = environment.projectId;
    // const email = localStorage.getItem('email');
    // console.log('Applicant ID in service', data.applicantId)
    // const body: RequestEntity = {
    //   processId,
    //   workflowId,
    //   projectId,
    //   ProcessVariables: {
    //     userId: 1001,
    //     loginId: email,
    // 	  //applicantId: 0,
    // 	  leadId: 61,
    //     ...data,
    //   },
    // };
    // const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    // return this.httpService.post(url, body);
  }
}
