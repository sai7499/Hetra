import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import RequestEntity from '@model/request.entity';

@Injectable({
    providedIn: 'root'
})

export class ChildLoanApiService {

    constructor(
        private httpService: HttpService,
        private apiService: ApiService
    ) { }

    searchChildLoanApi(childLoanDatas) {
        // searchChildLoanApi(loanAccountNo) {
        const processId = this.apiService.api.childLoanSearch.processId;
        const workflowId = this.apiService.api.childLoanSearch.workflowId;
        const projectId = this.apiService.api.childLoanSearch.projectId;

        const requestEntity: RequestEntity = {
            processId,
            ProcessVariables: {
                childData: {
                    ...childLoanDatas
                }

                // loanAccountNo
            },
            workflowId,
            projectId
        };
        // tslint:disable-next-line: max-line-length
        let url = environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
        return this.httpService.post(url, requestEntity);
    }

}