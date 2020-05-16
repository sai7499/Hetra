import { HttpService } from './../../../services/http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';

@Injectable()

export class LoginService {

    constructor( 
        private httpService: HttpService) { }

    getLogin(data) {
        const url = environment.host + 'account/' + environment.apiVersion.login + 'login';
        let body = {
            email: data.email,
            password: data.password
        }
        return this.httpService.post(url, body);
    }   

    getUserDetails() {
        const processId = environment.api.getUserDetails.processId;
        const workflowId = environment.api.getUserDetails.workflowId;
        const projectId = environment.projectId;

        let email = localStorage.getItem('email');

        const body: RequestEntity = {
            processId: processId, 
            ProcessVariables: {
                "loginId": email
            },
            workflowId: workflowId,
            projectId: projectId
        };

        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

}