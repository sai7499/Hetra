import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import RequestEntity from '@model/request.entity';
import { environment } from '../../../environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class TaskDashboard {

  constructor(
    private apiService: ApiService,
    private httpService: HttpService
  ) { }

  taskDashboard(data) {
    const processData = data;
    const processId = this.apiService.api.taskDashboard.processId;
    const workflowId = this.apiService.api.taskDashboard.workflowId;
    const projectId = this.apiService.api.taskDashboard.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, requestEntity);
  }

  assignTask(id) {
   const url = `http://10.101.10.153/appiyo/d/tasks/${id}/claim`;
  //  return this.httpService.post(url, );
  }

}
