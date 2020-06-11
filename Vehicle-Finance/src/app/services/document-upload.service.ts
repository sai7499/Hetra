import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {
  private saveToCredit:{
    projectId?: string;
    processId?: string;
    workflowId?: string;
  }


  constructor(private apiService: ApiService,
              private httpService: HttpService) { 
    this.saveToCredit = this.apiService.api.submitToCredit;
  }

  public submitToCredit(data){
    const projectId = this.saveToCredit.projectId;
    const processId = this.saveToCredit.processId;
    const workflowId = this.saveToCredit.workflowId;
    const body = {
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
  
}
