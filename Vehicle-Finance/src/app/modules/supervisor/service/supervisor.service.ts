import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { ApiService } from '@services/api.service';
import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService
) { }

getTeamDetails() { //supervisorRelated
  const processId = this.apiService.api.supervisor.processId;
  const workflowId = this.apiService.api.supervisor.workflowId;
  const projectId = this.apiService.api.supervisor.projectId;

  const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
          
      },
      workflowId: workflowId,
      projectId: projectId
  };
  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, body);
}

}
