import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';
import { HttpService } from '../../../services/http.service';
import { storage } from '../../../storage/localstorage';
import { ApiService } from '@services/api.service';

@Injectable({
    providedIn: 'root'
})

export class TrackVechileService {
userId;
    constructor(
        private httpService: HttpService,
        private apiService: ApiService) {
            this.userId =localStorage.getItem('userId');
         }
        
    saveUpdateFleetRtr(data){
        const processId = this.apiService.api.saveUpdateFleetRtr.processId;
        const workflowId = this.apiService.api.saveUpdateFleetRtr.workflowId;
        const projectId = this.apiService.api.saveUpdateFleetRtr.projectId ;
        const body: RequestEntity = {
            processId: processId,          
            ProcessVariables: {
                ...data,
                userId: this.userId, 
            },
            workflowId: workflowId,
            projectId: projectId
        };
        console.log(body);
        // const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
    getFleetRtr(data){
        const processId = this.apiService.api.getFleetRtr.processId;
        const workflowId = this.apiService.api.getFleetRtr.workflowId;
        const projectId = this.apiService.api.getFleetRtr.projectId ;
        const body: RequestEntity = {
            processId: processId,          
            ProcessVariables: data,
            workflowId: workflowId,
            projectId: projectId
        };
        // const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

   deleteFleetRtr(id){
        const processId = this.apiService.api.deleteFleetRtr.processId;
        const workflowId = this.apiService.api.deleteFleetRtr.workflowId;
        const projectId = this.apiService.api.deleteFleetRtr.projectId ;
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
