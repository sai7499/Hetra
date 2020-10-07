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

export class CreateLeadService {

    constructor(
        private httpService: HttpService,
        private apiService: ApiService
    ) { }

    createLead(loanLeadDetails, applicantDetails, fromDedupe, isReject?, rejectReason?) {
        const processId = this.apiService.api.createLead.processId;
        const workflowId = this.apiService.api.createLead.workflowId;
        const projectId = this.apiService.api.createLead.projectId;

        const userId = storage.getUserId();
        let body: RequestEntity;

        if (fromDedupe) {
            if (isReject) {
                body = {
                    processId,
                    ProcessVariables: {
                        loanLeadDetails,
                        applicantDetails,
                        userId,
                        'toCreateNewLead': true,
                        'isLeadRejected': true,
                        rejectReason
                    },
                    workflowId,
                    projectId
                };

            } else {
                body = {
                    processId,
                    ProcessVariables: {
                        loanLeadDetails,
                        applicantDetails,
                        userId,
                        'toCreateNewLead': true
                    },
                    workflowId,
                    projectId
                };
            }
        } else {
            body = {
                processId,
                ProcessVariables: {
                    loanLeadDetails,
                    applicantDetails,
                    userId
                },
                workflowId,
                projectId
            };
        }
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    rejectLead(flowStage: string, product?, productCode?) {
        // let body;
        const processId = this.apiService.api.rejectLead.processId;
        const workflowId = this.apiService.api.rejectLead.workflowId;
        const projectId = this.apiService.api.rejectLead.projectId;

        // if (product) {
        //     body = {
        //         processId: processId,
        //         ProcessVariables: {
        //             product,
        //             flowStage
        //         },
        //         workflowId: workflowId,
        //         projectId: projectId
        //     };
        // }

        // if (productCode) {
        //     body = {
        //         processId: processId,
        //         ProcessVariables: {
        //             productCode,
        //             flowStage
        //         },
        //         workflowId: workflowId,
        //         projectId: projectId
        //     };
        // }

        const body: RequestEntity = {
            processId,
            workflowId,
            projectId,
            ProcessVariables: {}
        };
        if (product) {
            body['ProcessVariables'] = {
                product,
                flowStage
            }
        } else if (productCode) {
            body['ProcessVariables'] = {
                productCode,
                flowStage
            }
        }

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    getProductCategory(bizDivId) {
        const processId = this.apiService.api.getAssetProductCategory.processId;
        const workflowId = this.apiService.api.getAssetProductCategory.workflowId;
        const projectId = this.apiService.api.getAssetProductCategory.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                "bussinessDivision": bizDivId
            },
            workflowId: workflowId,
            projectId: projectId
        };

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    getSourcingChannel() {
        const processId = this.apiService.api.getSourcingChannel.processId;
        const workflowId = this.apiService.api.getSourcingChannel.workflowId;
        const projectId = this.apiService.api.getSourcingChannel.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {},
            workflowId: workflowId,
            projectId: projectId
        };

        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    getLeadById(leadId) {
        const processId = this.apiService.api.getLeadById.processId;
        const workflowId = this.apiService.api.getLeadById.workflowId;
        const projectId = this.apiService.api.getLeadById.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                'leadId': leadId
            },
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    sourcingCode(sourcingCodeType, sourcingCodeSubType, code) {
        const processId = this.apiService.api.sourcingCode.processId;
        const workflowId = this.apiService.api.sourcingCode.workflowId;
        const projectId = this.apiService.api.sourcingCode.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                'sourcingCodeType': sourcingCodeType,
                'sourcingCodeSubType': sourcingCodeSubType,
                'code': code
            },
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    fundingPrograming(productCode) {
        const processId = this.apiService.api.fundingProgram.processId;
        const workflowId = this.apiService.api.fundingProgram.workflowId;
        const projectId = this.apiService.api.fundingProgram.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                "productCode": productCode
            },
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

    dealerCode(code) {
        const processId = this.apiService.api.dealerCode.processId;
        const workflowId = this.apiService.api.dealerCode.workflowId;
        const projectId = this.apiService.api.dealerCode.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                "code": code
            },
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }

}
