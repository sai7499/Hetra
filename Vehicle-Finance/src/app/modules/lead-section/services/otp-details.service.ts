import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { ApiService } from '../../../services/api.service';


@Injectable({
  providedIn: 'root'
})
export class OtpServiceService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService) { }


  // method to get otp 

  sendOtp(data) {

    const processData = data;
    const processId = this.apiService.api.sendOtp.processId;
    const workflowId = this.apiService.api.sendOtp.workflowId;
    const projectId = this.apiService.api.sendOtp.projectId;


    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  // method to validate otp
  validateOtp(data) {

    const processData = data;
    const processId = this.apiService.api.validateOtp.processId;
    const workflowId = this.apiService.api.validateOtp.workflowId;
    const projectId = environment.projectIds.externalApi;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: processData,
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

}


