import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { HttpService } from '../services/http.service';
import { CommomLovService } from '../services/commom-lov-service';
import { ApiService } from './api.service';

@Injectable()
export class LovResolverService implements Resolve<any>{
    lovData: any;
    constructor(
        private httpService: HttpService,
        private commonLovService: CommomLovService,
        private apiService: ApiService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        const processId = this.apiService.api.getLOVs.processId;
        const workflowId = this.apiService.api.getLOVs.workflowId;
        const projectId = this.apiService.api.getLOVs.projectId;

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {},
            workflowId: workflowId,
            projectId: projectId
        };
        this.commonLovService.getLovData().subscribe(lov => this.lovData = lov);
        if (this.lovData) {
            return this.lovData;
        }
        return this.httpService.post(url, body);
    }
}


