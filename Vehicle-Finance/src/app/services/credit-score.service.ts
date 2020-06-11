import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { ApiService } from './api.service';
import { HttpService } from '../services/http.service';


@Injectable({
  providedIn: 'root'
})
export class CreditScoreService {
 resObj: any;
  constructor(private httpService: HttpService,
              private apiService: ApiService) { }
  getCreditScore(data) {
    const processData = data;
    const processId = this.apiService.api.creditBureau.processId;
    const workflowId = this.apiService.api.creditBureau.workflowId;
    const projectId = this.apiService.api.creditBureau.projectId;

    const userId = localStorage.getItem('userId');

    const requestEntity: RequestEntity = {
      processId,
      ProcessVariables: processData,
      workflowId,
      projectId
    };

    const url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
    return this.httpService.post(url, requestEntity);
  }
  setResponseForCibil(data: any) {
    this.resObj = data;
  }
  getResponseForCibil() {
    return this.resObj;
  }
}
