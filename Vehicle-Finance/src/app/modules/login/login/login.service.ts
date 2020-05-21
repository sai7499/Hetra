import { HttpService } from './../../../services/http.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import RequestEntity from '../../../model/request.entity';

@Injectable()

export class LoginService {

    constructor(private http: HttpClient,
                private httpService: HttpService) { }

    getLogin(data) {
        // let body = `email=${data.email}&password=${data.password}`;
        // const body =  JSON.stringify(req);
        const url = `${environment.host}account/login`;
        // const url = 'http://128.199.164.250/appiyo/account/' + environment.apiVersion.login + 'login';
        // const url = environment.host + 'account/' + environment.apiVersion.login + 'login';
        const body = {
            email: data.email,
            password: data.password
        };
        return this.httpService.post(url, body);
    }

    getUserDetails() {
        const processId = environment.api.getUserDetails.processId;
        const workflowId = environment.api.getUserDetails.workflowId;
        const projectId = environment.projectId;

        const email = localStorage.getItem('email');

        const requestEntity: RequestEntity = {
            processId,
            ProcessVariables: {
                'loginId': email
            },
            workflowId,
            projectId
        };

        const url = `${environment.host}d/workflows/${workflowId}/execute?projectId=${projectId}`;
        // let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
        const body = {
            processVariables:
            JSON.stringify(requestEntity)
        };
        return this.httpService.post(url, body);
    }

}
