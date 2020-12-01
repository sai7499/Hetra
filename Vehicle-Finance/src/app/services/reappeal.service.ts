import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReappealService {

  constructor(private apiService: ApiService,
              private httpService: HttpService, ) { }

              saveReappealData(data) {
                const processData = data;
                const processId = this.apiService.api.reAppeal.processId;
                const workflowId = this.apiService.api.reAppeal.workflowId;
                const projectId = this.apiService.api.reAppeal.projectId;

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
