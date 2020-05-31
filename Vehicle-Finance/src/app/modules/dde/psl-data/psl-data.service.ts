import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../services/api.service';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PslDataService {

  constructor( private httpService: HttpService,
               private apiService: ApiService ) { }

  getDependentDropdownLOV() {
    const processId = this.apiService.api.pslLOVsDropdown.processId;
    const workflowId = this.apiService.api.pslLOVsDropdown.workflowId;
    const projectId = this.apiService.api.pslLOVsDropdown.projectId;

    const body: RequestEntity = {
        processId: processId,
        ProcessVariables: {
          "productCode": 1001
        },
        workflowId: workflowId,
        projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
