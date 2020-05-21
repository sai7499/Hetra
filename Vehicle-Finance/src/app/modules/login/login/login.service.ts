import { Injectable } from '@angular/core';
import { LoginStoreService } from '@services/login-store.service';
import { HttpService } from '@services/http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';

@Injectable()

export class LoginService {

    constructor( 
        private httpService: HttpService,
        private loginService: LoginStoreService) { }

    getLogin(data) {
        const url = environment.host + 'account/' + environment.apiVersion.login + 'login';
        let body = {
            email: data.email,
            password: data.password
        }
        return this.httpService.post(url, body);
    }   

    getUserDetails(data?) {
        const processId = environment.api.getUserDetails.processId;
        const workflowId = environment.api.getUserDetails.workflowId;
        const projectId = environment.projectId;

        let email = data ? data.userId : this.loginService.getEmailId();
        let objectKey = data ? 'userId': 'loginId';
        const body: RequestEntity = {
            processId: processId, 
            ProcessVariables: {
                // "loginId": email
                [objectKey]:email
            },
            workflowId: workflowId,
            projectId: projectId
        };

        let url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

}