import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { ApiService } from '@services/api.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DisbursementService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService
) { }

getDisbLOV() { 
  const processId = this.apiService.api.disbursementLOV.processId;
  const workflowId = this.apiService.api.disbursementLOV.workflowId;
  const projectId = this.apiService.api.disbursementLOV.projectId;

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

getCoAppNames(leadId) { 
  const processId = this.apiService.api.fetchCoAppDetails.processId;
  const workflowId = this.apiService.api.fetchCoAppDetails.workflowId;
  const projectId = this.apiService.api.fetchCoAppDetails.projectId;

  const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        // "LeadID":leadId
        ...leadId          
      },
      workflowId: workflowId,
      projectId: projectId
  };
  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, body);
}
getDealerDetails(dealerCode) { 
  const processId = this.apiService.api.fetchDealerDetails.processId;
  const workflowId = this.apiService.api.fetchDealerDetails.workflowId;
  const projectId = this.apiService.api.fetchDealerDetails.projectId;

  const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "dealerCode":dealerCode          
      },
      workflowId: workflowId,
      projectId: projectId
  };
  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, body);
}
getApplicantDetails(leadID) { 
  const processId = this.apiService.api.fetchApplicantDetails.processId;
  const workflowId = this.apiService.api.fetchApplicantDetails.workflowId;
  const projectId = this.apiService.api.fetchApplicantDetails.projectId;

  const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "LeadID":leadID          
      },
      workflowId: workflowId,
      projectId: projectId
  };
  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, body);
}
saveUpdateDisbursement(inputData) { 
  const processId = this.apiService.api.saveUpdateDisburseDetails.processId;
  const workflowId = this.apiService.api.saveUpdateDisburseDetails.workflowId;
  const projectId = this.apiService.api.saveUpdateDisburseDetails.projectId;

  const body: RequestEntity = {
      processId: processId,
      ProcessVariables: inputData,
      workflowId: workflowId,
      projectId: projectId
  };
  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, body);
  }
fetchDisbursement(leadId) { 
    const processId = this.apiService.api.fetchDisburseDetails.processId;
    const workflowId = this.apiService.api.fetchDisburseDetails.workflowId;
    const projectId = this.apiService.api.fetchDisburseDetails.projectId;
  
    const body: RequestEntity = {
        processId: processId,
        ProcessVariables: {
          "LeadID":leadId
      },
        workflowId: workflowId,
        projectId: projectId
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
    }
    fetchLoanDetails(leadId) { 
      const processId = this.apiService.api.fetchLoanDetails.processId;
      const workflowId = this.apiService.api.fetchLoanDetails.workflowId;
      const projectId = this.apiService.api.fetchLoanDetails.projectId;
    
      const body: RequestEntity = {
          processId: processId,
          ProcessVariables: {
            "LeadID":leadId
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
