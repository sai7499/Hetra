import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class QueryModelService {

  constructor(private apiService: ApiService, private httpService: HttpService) { }

  // 1.method for getting queries

  getQueries(data) {

    const processId = this.apiService.api.getQueries.processId;
    const workflowId = this.apiService.api.getQueries.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body: RequestEntity = {

      processId: processId,
      ProcessVariables: data,
      workflowId: workflowId,
      projectId: projectId

    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

    // 2.method for save or update query

    saveOrUpdateVehcicleDetails(data) {

      const processId = this.apiService.api.saveorUpdateQueries.processId;
      const workflowId = this.apiService.api.saveorUpdateQueries.workflowId;
      const projectId = environment.projectIds.salesProjectId;
  
      const body: RequestEntity = {
  
        processId: processId,
        ProcessVariables: data,
        workflowId: workflowId,
        projectId: projectId
      };
  
      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
    }

}
