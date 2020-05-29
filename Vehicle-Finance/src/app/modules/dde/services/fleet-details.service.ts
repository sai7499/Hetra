import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';


@Injectable({
  providedIn: 'root'
})
export class FleetDetailsService {

  constructor(
    private httpService: HttpService) { }

  saveOrUpdateFleetDetails(leadId, userId, fleets) {

    const processId = environment.api.saveOrUpdateFleet.processId;
    const workflowId = environment.api.saveOrUpdateFleet.workflowId;
    const projectId = environment.projectId;

    const email = localStorage.getItem('email');

    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {

        "leadId": leadId,
        "userId": userId,
        "fleets": fleets
      },
      workflowId: workflowId,
      projectId: projectId
    };

    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
