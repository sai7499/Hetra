import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TermAcceptanceService {

  constructor( private httpService: HttpService,
               private apiService: ApiService) { }

    acceptTerms(data) {
      const processData = data;
      const processId = this.apiService.api.termsAcceptance.processId;
      const workflowId = this.apiService.api.termsAcceptance.workflowId;
      const projectId = this.apiService.api.termsAcceptance.projectId;

      const requestEntity: RequestEntity = {
        processId,
        ProcessVariables: processData,
        workflowId,
        projectId,
      };

      // tslint:disable-next-line: max-line-length
      const url =
        environment.host +
        'd/workflows/' +
        workflowId +
        '/' +
        environment.apiVersion.api +
        'execute?projectId=' +
        projectId;
      return this.httpService.post(url, requestEntity);
    }
}
