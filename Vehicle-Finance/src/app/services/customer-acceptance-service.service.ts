import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CustomerAcceptanceServiceService {

  constructor(private apiService: ApiService,
              private httpService: HttpService ) { }

              sendAcceptanceDetails(data) {
                const processData = data;
                const processId = this.apiService.api.customerAcceptance.processId;
                const workflowId = this.apiService.api.customerAcceptance.workflowId;
                const projectId = this.apiService.api.customerAcceptance.projectId;

                const userId = localStorage.getItem('userId');

                const requestEntity: RequestEntity = {
                  processId,
                  ProcessVariables: processData,
                  workflowId,
                  projectId
                };

                // tslint:disable-next-line: max-line-length
                const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
                return this.httpService.post(url, requestEntity);
              }
}
