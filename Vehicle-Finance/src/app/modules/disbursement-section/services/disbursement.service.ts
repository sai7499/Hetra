import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { ApiService } from '@services/api.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DisbursementService {

  constructor(
    private httpService: HttpService,
    private apiService: ApiService,
    private http: HttpClient
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
getDealerDetails(dealerCode,productCode) { 
  const processId = this.apiService.api.fetchDealerDetails.processId;
  const workflowId = this.apiService.api.fetchDealerDetails.workflowId;
  const projectId = this.apiService.api.fetchDealerDetails.projectId;

  const body: RequestEntity = {
      processId: processId,
      ProcessVariables: {
        "dealerCode":dealerCode,
        "productCatCode": productCode          
      },
      workflowId: workflowId,
      projectId: projectId
  };
  const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
  return this.httpService.post(url, body);
}
getApplicantDetails(data) { 
  const processId = this.apiService.api.fetchApplicantDetails.processId;
  const workflowId = this.apiService.api.fetchApplicantDetails.workflowId;
  const projectId = this.apiService.api.fetchApplicantDetails.projectId;

  const body: RequestEntity = {
      processId: processId,
      ProcessVariables: data,
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
      dealerCode(code,productCode?) {
        const processId = this.apiService.api.dealerCode.processId;
        const workflowId = this.apiService.api.dealerCode.workflowId;
        const projectId = this.apiService.api.dealerCode.projectId;

        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: {
                "code": code,
                "productCatCode": productCode
            },
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
    }
    BnfBankName(name) {
      const processId = this.apiService.api.disbBankName.processId;
      const workflowId = this.apiService.api.disbBankName.workflowId;
      const projectId = this.apiService.api.disbBankName.projectId;

      const body: RequestEntity = {
          processId: processId,
          ProcessVariables: {
              "bankName": name
          },
          workflowId: workflowId,
          projectId: projectId
      };
      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
  }
  getBankNameDetails(bankName) {
    const processId = this.apiService.api.disbBankDetails.processId;
      const workflowId = this.apiService.api.disbBankDetails.workflowId;
      const projectId = this.apiService.api.disbBankDetails.projectId;

      const body: RequestEntity = {
          processId: processId,
          ProcessVariables: {
              "bankName": bankName
          },
          workflowId: workflowId,
          projectId: projectId
      };
      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
  }
  getTDDetails(reqData,val){
      if(val == '2'){
        const processId = this.apiService.api.getTDDetailsByTask.processId;
        const workflowId = this.apiService.api.getTDDetailsByTask.workflowId;
        const projectId = this.apiService.api.getTDDetailsByTask.projectId;
    
      const body: RequestEntity = {
          processId: processId,
          ProcessVariables: reqData,
          workflowId: workflowId,
          projectId: projectId
      };
      const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
      return this.httpService.post(url, body);
      } else {
        const processId = this.apiService.api.getTDDetails.processId;
        const workflowId = this.apiService.api.getTDDetails.workflowId;
        const projectId = this.apiService.api.getTDDetails.projectId;
      
        const body: RequestEntity = {
            processId: processId,
            ProcessVariables: reqData,
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
      }
      }
      submitToMaker(inputData){
        const processId = this.apiService.api.submitTDToMaker.processId;
        const workflowId = this.apiService.api.submitTDToMaker.workflowId;
        const projectId = this.apiService.api.submitTDToMaker.projectId;
      
        const body: RequestEntity = {
            processId: processId,
            ProcessVariables:inputData,
            workflowId: workflowId,
            projectId: projectId
        };
        const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
        return this.httpService.post(url, body);
        }
        tdReverseToMaker(inputTask,remarks,roleID,flag,trnachJSON){
          const processId = this.apiService.api.reverseTDToMaker.processId;
          const workflowId = this.apiService.api.reverseTDToMaker.workflowId;
          const projectId = this.apiService.api.reverseTDToMaker.projectId;
        
          const body: RequestEntity = {
              processId: processId,
              ProcessVariables: {
                "remarks":remarks,
                "taskID":inputTask,
                "roleID":roleID,
                "isReversed":flag,
                "trancheDisbJson":trnachJSON
            },
              workflowId: workflowId,
              projectId: projectId
          };
          const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
          return this.httpService.post(url, body);
          }
        tdApprove(inputTask,leadId,loanAccountNumber){
          const processId = this.apiService.api.tdApprove.processId;
          const workflowId = this.apiService.api.tdApprove.workflowId;
          const projectId = this.apiService.api.tdApprove.projectId;
        
          const body: RequestEntity = {
              processId: processId,
              ProcessVariables: {
                "taskID":inputTask,
                "leadID":leadId,
                "loanAccountNumber":loanAccountNumber
            },
              workflowId: workflowId,
              projectId: projectId
          };
          const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
          return this.httpService.post(url, body);
          }
          startTask(id){
          const url = `${environment.host}d/tasks/${id}/start`;
           const requestBody = {};
          return this.http.put(url, requestBody);
          }
          completeTask(id,remarks){
            const url = `${environment.host}d/tasks/${id}/complete`;
            const requestBody = "variables=" + JSON.stringify({
              state: 1,reversalState:0,remarks:remarks})
            return this.http.put(url, requestBody);
            }
}
