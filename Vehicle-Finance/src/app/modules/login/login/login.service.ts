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
        const body = {
            email: data.email,
            password: data.password
        };
        return this.httpService.post(url, body);
    }

    getUserDetails(data?) {
        const processId = environment.api.getUserDetails.processId;
        const workflowId = environment.api.getUserDetails.workflowId;
        const projectId = environment.projectId;

        const email = data ? data.userId : this.loginService.getEmailId();
        const objectKey = data ? 'userId' : 'loginId';
        const body: RequestEntity = {
            processId,
            ProcessVariables: {
                [objectKey]: email
            },
            workflowId,
            projectId
        };

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

}
