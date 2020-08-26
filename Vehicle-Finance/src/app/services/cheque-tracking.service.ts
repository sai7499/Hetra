import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
@Injectable({
  providedIn: 'root'
})
export class ChequeTrackingService {

  private getChequeTrackingData : {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }
  private saveUpdateChequeTrackingData : {
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }

  constructor(private httpService: HttpService,
              private apiService: ApiService) { 
    this.getChequeTrackingData= this.apiService.api.getChequeTracking;
    this.saveUpdateChequeTrackingData= this.apiService.api.saveUpdateChequeTracking;
  }

  getChequeTracking(data){
    const processId = this.getChequeTrackingData.processId;
    const workflowId = this.getChequeTrackingData.workflowId;
    const projectId = this.getChequeTrackingData.projectId;
    const body={
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  } 
  
  saveUpdateChequeTracking(data){
    const processId = this.saveUpdateChequeTrackingData.processId;
    const workflowId = this.saveUpdateChequeTrackingData.workflowId;
    const projectId = this.saveUpdateChequeTrackingData.projectId;
    const userId = localStorage.getItem('userId');
    const body={
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        ...data,
        userId,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
