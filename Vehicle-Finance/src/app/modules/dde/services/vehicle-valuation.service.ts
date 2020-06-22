import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { ApiService } from '@services/api.service';
import RequestEntity from '@model/request.entity';
import { HttpService } from '@services/http.service';
import { LoginStoreService } from '@services/login-store.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleValuationService {

  constructor( private httpService: HttpService,
               private apiService: ApiService ) { }

  getVehicleValuation(data) {
    const processData = data;

    const processId = this.apiService.api.getVehicleValuation.processId;
    const workflowId = this.apiService.api.getVehicleValuation.workflowId;
    const projectId = this.apiService.api.getVehicleValuation.projectId;

    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId')

    const body: RequestEntity = {
        processId: processId,
        ProcessVariables:{
          leadId: processData
        },
        workflowId: workflowId,
        projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

}
