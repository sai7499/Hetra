import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import RequestEntity from '../../model/request.entity';
import { environment } from '../../../environments/environment';
import { HttpService } from '../../services/http.service';
// import { environment } from '../../../../environments/environment';
// import RequestEntity from '../../../model/request.entity';
// import { HttpService } from '../../../services/http.service';
// import { storage } from '../../../storage/localstorage';
import { ApiService } from '../../services/api.service';
@Injectable({
  providedIn: 'root'
})
export class NegotiationService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService
  ) { }
  getInsuranceLOV(data) {
    const processId = this.apiService.api.getInsuranceLOV.processId;
    const workflowId = this.apiService.api.getInsuranceLOV.workflowId;
    const projectId = this.apiService.api.getInsuranceLOV.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        // "ProductCode": "UC"
        ...data
      },
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  getmotorInsuranceData() {
    const processId = this.apiService.api.getmotorInsuranceLOV.processId;
    const workflowId = this.apiService.api.getmotorInsuranceLOV.workflowId;
    const projectId = this.apiService.api.getmotorInsuranceLOV.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {

      },
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  getAssetDetails(leadId) {
    const processId = this.apiService.api.getAssetDetails.processId;
    const workflowId = this.apiService.api.getAssetDetails.workflowId;
    const projectId = this.apiService.api.getAssetDetails.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "LeadId": leadId
      },
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  viewNegotiationData(NegotiationId)
  {
    const processId = this.apiService.api.getNegotiationData.processId;
    const workflowId = this.apiService.api.getNegotiationData.workflowId;
    const projectId = this.apiService.api.getNegotiationData.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "NegotiationId":NegotiationId
      },
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
  submitNegotiation(leadID,userId,NegotiationId, Applicants, CombinedLoan, Deductions, Asset, CrossSellIns, CrossSellOthers) {
    const processId = this.apiService.api.submitNegotiation.processId;
    const workflowId = this.apiService.api.submitNegotiation.workflowId;
    const projectId = this.apiService.api.submitNegotiation.projectId;
    const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "LeadId": leadID,
        "userId": userId,
        "NegotiationId": NegotiationId?NegotiationId:null,
        "IsInsert": true,
        "Applicants": Applicants,
        "deductions": Deductions,
        "CombinedLoan": CombinedLoan,
        "Asset": Asset,
        "CrossSellIns": CrossSellIns,
        "CrossSellOthers": CrossSellOthers
      },
      workflowId: workflowId,
      projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
