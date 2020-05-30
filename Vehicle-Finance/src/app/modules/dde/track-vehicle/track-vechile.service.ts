import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { storage } from '../../../storage/localstorage';

@Injectable({
    providedIn: 'root'
})

export class TrackVechileService {
userId;
    constructor(
        private httpService: HttpService,) {
            this.userId =localStorage.getItem('userId');
         }
        
    saveUpdateFleetRtr(fleetRtrDetails,installmentDetails){
        const processId = environment.api.saveUpdateFleetRtr.processId;
        const workflowId = environment.api.saveUpdateFleetRtr.workflowId;
        const projectId = environment.projectId ;
        const body: RequestEntity = {
            processId: processId,          
            ProcessVariables: {
                "fleetRtr": fleetRtrDetails,
                "installment": installmentDetails,
                "fleetId" : 82 , 
                "userId": this.userId, 
                leadId:21,
            },
            workflowId: workflowId,
            projectId: projectId
        };
        console.log(body);
        // const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
    getFleetRtr(){
        const processId = environment.api.getFleetRtr.processId;
        const workflowId = environment.api.getFleetRtr.workflowId;
        const projectId = environment.projectId ;
        const body: RequestEntity = {
            processId: processId,          
            ProcessVariables: {
                "fleetId" : 82
            },
            workflowId: workflowId,
            projectId: projectId
        };
        // const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

   deleteFleetRtr(id){
        const processId = environment.api.deleteFleetRtr.processId;
        const workflowId = environment.api.deleteFleetRtr.workflowId;
        const projectId = environment.projectId ;
        const body: RequestEntity = {
            processId: processId,          
            ProcessVariables: {
                "id" : id,
                "userId": this.userId
            },
            workflowId: workflowId,
            projectId: projectId
        };
        // const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
}
