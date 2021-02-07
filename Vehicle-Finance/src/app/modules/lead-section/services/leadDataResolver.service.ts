import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import RequestEntity from '@model/request.entity';
import { ApiService } from '@services/api.service';
import { HttpService } from '@services/http.service';
import { environment } from 'src/environments/environment';
import { SharedService } from '@modules/shared/shared-service/shared-service';
import { LoanViewService } from '@services/loan-view.service';

@Injectable()
export class LeadDataResolverService implements Resolve<any> {
  leadId: any;
  udfGroupId: string = 'LDG001';
  udfScreenId: any;
  loanAccountDetails: any;

  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
    private router: Router,
    private sharedService: SharedService,
    private loanViewService: LoanViewService
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    this.leadId = route.params.leadId;


    let isChangeStatus = null;

    this.sharedService.isdedupdeStatus$.subscribe((res: any) => {
      console.log(res, 'res')
      isChangeStatus = res;
    })

    this.udfScreenId = this.router.getCurrentNavigation().extras.state ? this.router.getCurrentNavigation().extras.state : null;

    const processId = this.apiService.api.getLeadById.processId;
    const workflowId = this.apiService.api.getLeadById.workflowId;
    const projectId = this.apiService.api.getLeadById.projectId;
    let data: any;
   
      data = {
        leadId: Number(this.leadId),
        udfDetails: [{
          "udfGroupId": this.udfGroupId,
          // "udfScreenId": this.udfScreenId.udfScreenId
        }]
      }
    


    let resolveData = data

    if (isChangeStatus) {
      data['isChangeStatus'] = isChangeStatus;
    }

    const body: RequestEntity = {
      processId,
      ProcessVariables: data,
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
