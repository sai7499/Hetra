import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpService } from './http.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceServiceService {

  constructor(private apiService: ApiService,
              private httpService: HttpService) { }

   saveInsuranceDetails(data) {
      const processData = data;
      const processId = this.apiService.api.saveInsuranceService.processId;
      const workflowId = this.apiService.api.saveInsuranceService.workflowId;
      const projectId = this.apiService.api.saveInsuranceService.projectId;

      const userId = localStorage.getItem('userId');

      const requestEntity: RequestEntity = {
                  processId,
                  ProcessVariables: processData,
                  workflowId,
                  projectId
                };

                // tslint:disable-next-line: max-line-length
      const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
      return this.httpService.post(url, requestEntity);
              }
   getInsuranceDetails(data) {
                const processData = data;
                const processId = this.apiService.api.getInsuranceDetails.processId;
                const workflowId = this.apiService.api.getInsuranceDetails.workflowId;
                const projectId = this.apiService.api.getInsuranceDetails.projectId;

                const userId = localStorage.getItem('userId');

                const requestEntity: RequestEntity = {
                            processId,
                            ProcessVariables: processData,
                            workflowId,
                            projectId
                          };

                          // tslint:disable-next-line: max-line-length
                const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
                return this.httpService.post(url, requestEntity);
                        }
   getInsuranceMasterDetails(data) {
        const processData = data;
        const processId = this.apiService.api.insuranceVehicleMaster.processId;
        const workflowId = this.apiService.api.insuranceVehicleMaster.workflowId;
        const projectId = this.apiService.api.insuranceVehicleMaster.projectId;

        const userId = localStorage.getItem('userId');

        const requestEntity: RequestEntity = {
                                      processId,
                                      ProcessVariables: processData,
                                      workflowId,
                                      projectId
                                    };

                                    // tslint:disable-next-line: max-line-length
        const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
        return this.httpService.post(url, requestEntity);
                                  }
    getInsuranceRtoDetails(data) {
         const processData = data;
         const processId = this.apiService.api.insuranceRTOMaster.processId;
         const workflowId = this.apiService.api.insuranceRTOMaster.workflowId;
         const projectId = this.apiService.api.insuranceRTOMaster.projectId;

         const userId = localStorage.getItem('userId');

         const requestEntity: RequestEntity = {
                                                processId,
                                                ProcessVariables: processData,
                                                workflowId,
                                                projectId
                                              };

                                              // tslint:disable-next-line: max-line-length
         const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
         return this.httpService.post(url, requestEntity);
                                            }
 getMotorInsuranceProviderDetails(data) {
                                              const processData = data;
                                              const processId = this.apiService.api.motorInsuranceProvider.processId;
                                              const workflowId = this.apiService.api.motorInsuranceProvider.workflowId;
                                              const projectId = this.apiService.api.motorInsuranceProvider.projectId;
                                     
                                              const userId = localStorage.getItem('userId');
                                     
                                              const requestEntity: RequestEntity = {
                                                                                     processId,
                                                                                     ProcessVariables: processData,
                                                                                     workflowId,
                                                                                     projectId
                                                                                   };
                                     
                                                                                   // tslint:disable-next-line: max-line-length
                                              const url =  environment.host + 'd/workflows/' + workflowId + '/' + environment.apiVersion.api + 'execute?projectId=' + projectId;
                                              return this.httpService.post(url, requestEntity);
                                                                                 }
                      }
