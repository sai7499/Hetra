import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '@services/http.service';
import { ApiService } from '@services/api.service';
import { environment } from "../../../../../environments/environment"
import RequestEntity from '@model/request.entity';


@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  constructor(private http: HttpClient, private httpService: HttpService, private apiService: ApiService) { }

  getwelcomeLetterDetails(leadId) {

    const processId = this.apiService.api.welcomeLetter.processId;
    const workflowId = this.apiService.api.welcomeLetter.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "leadId": leadId
    },

      workflowId: workflowId,
      projectId: projectId
    }
    //const test = body;
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

// processVariables:
// {
//   "processId": processId,
//   "ProcessVariables": {
//     "leadId": 1372   (mandatory)
//   },
//   "workflowId": "d33a101af28911ea9cda00505695f93b",
//   "projectId": "8bfa8dba945b11eabdcaf2fa9bec3d63"
// }

getDeliveryLetterDetails(leadId) {

  const processId = this.apiService.api.deliveryLetter.processId;
  const workflowId = this.apiService.api.deliveryLetter.workflowId;
  const projectId = environment.projectIds.salesProjectId;

  const body: RequestEntity = {
    processId: processId,
    ProcessVariables: {
      "leadId": leadId
  },

    workflowId: workflowId,
    projectId: projectId
  }
  //const test = body;
  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, body);
}

}
