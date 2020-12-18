import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import RequestEntity from '@model/request.entity';
import { ApiService } from '@services/api.service';
import { HttpService } from '@services/http.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CreateLeadDataService } from '@modules/lead-creation/service/createLead-data.service';

@Injectable()
export class LeadDataResolverService implements Resolve<any> {
  leadId: any;
  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
    private createLeadDataService: CreateLeadDataService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.leadId = route.params.leadId;

    const processId = this.apiService.api.getLeadById.processId;
    const workflowId = this.apiService.api.getLeadById.workflowId;
    const projectId = this.apiService.api.getLeadById.projectId;

    const body: RequestEntity = {
      processId,
      ProcessVariables: {
        leadId: Number(this.leadId),
      },
      workflowId,
      projectId,
    };
    // this.commonLovService.getLovData().subscribe(lov => this.lovData = lov);
    // if (this.lovData) {
    //     return this.lovData;
    // }

    // const leadData = this.createLeadDataService.getLeadSectionData();
    // if (leadData) {
    //   return (leadData as any);
    // } else {
    //   const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    //   return this.httpService.post(url, body);
    // }
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}