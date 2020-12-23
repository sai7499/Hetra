import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ApiService } from '@services/api.service';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class QueryDataResolverService implements Resolve<any>  {
    constructor(
        private httpService: HttpService,
        private apiService: ApiService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        let data = {
            "userId": localStorage.getItem('userId'),
            "currentPage": null,
            "perPage": 10000,
            "searchKey": '',
            "chatPerPage": 50,
            "chatCurrentPage":null,
            "chatSearchKey": ''
        }

        const processId = this.apiService.api.getLeads.processId;
        const workflowId = this.apiService.api.getLeads.workflowId;
        const projectId = environment.projectIds.salesProjectId;

        const body = {

            processId: processId,
            ProcessVariables: data,
            workflowId: workflowId,
            projectId: projectId,
            showLoader: false
        };

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

}