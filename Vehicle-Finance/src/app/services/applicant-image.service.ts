import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ApiService } from './api.service';
import RequestEntity from '@model/request.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicantImageService {

  constructor(private httpService: HttpService,
              private apiService: ApiService) { }

              getApplicantImageDetails(data: any) {
                const processData = data;
                const processId = this.apiService.api.getApplicantDataImage.processId;
                const workflowId = this.apiService.api.getApplicantDataImage.workflowId;
                const projectId = this.apiService.api.getApplicantDataImage.projectId;

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
