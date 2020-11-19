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

getReportersList(data) {
    const processData = data;
    const processId = this.apiService.api.supervisorReporters.processId;
    const workflowId = this.apiService.api.supervisorReporters.workflowId;
    const projectId = this.apiService.api.supervisorReporters.projectId;

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId,
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, requestEntity);
}

getSupervisorUserDetails(data) {
  const processData = data;
  const processId = this.apiService.api.supervisorGetUsers.processId;
  const workflowId = this.apiService.api.supervisorGetUsers.workflowId;
  const projectId = this.apiService.api.supervisorGetUsers.projectId;

  const requestEntity: RequestEntity = {
    processId,
    ProcessVariables: processData,
    workflowId,
    projectId,
  };

  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, requestEntity);
}

supervisorReAssign(data) {
  const processData = data;
  const processId = this.apiService.api.supervisorReAssign.processId;
  const workflowId = this.apiService.api.supervisorReAssign.workflowId;
  const projectId = this.apiService.api.supervisorReAssign.projectId;

  const requestEntity = {
    processId,
    ProcessVariables: processData,
    workflowId,
    projectId,
    headers: 'JJsZjki6ofISkf/SIfKoHbt9O77X7kF/hy4O7ZshWR0fXZJCEMLuKFgxM9RtZPcl'
  };

  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, requestEntity);
}

}
