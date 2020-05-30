import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class PslDataService {

  constructor( private httpService: HttpService ) { }

  getActivity() {
    const processId = environment.api.pslLOVsDropdown.processId;
    const workflowId = environment.api.pslLOVsDropdown.workflowId;
    const projectId = environment.projectId;

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
