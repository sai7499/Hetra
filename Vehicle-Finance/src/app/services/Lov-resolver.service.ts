import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import RequestEntity from '@model/request.entity';
import { HttpService } from '../services/http.service';
import { CommomLovService } from '../services/commom-lov-service';

@Injectable()
export class LovResolverService implements Resolve<any>{

    constructor(
        private httpService: HttpService,
        private commonLovService : CommomLovService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {

        const processId = environment.api.getLOVs.processId;
        const workflowId = environment.api.getLOVs.workflowId;
        const projectId = environment.projectId;

        let url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;

        let qdeRequestEntity: RequestEntity = {
            processId: processId,
            ProcessVariables: {},
            workflowId: workflowId,
            projectId: projectId
        };

        const body = {
            'processVariables':
                JSON.stringify(qdeRequestEntity)
        }

        // if(this.commonLovService.getLovData()){
        //     return this.commonLovService.getLovData()
        // }
        return this.httpService.post(url, body);
    }
}


