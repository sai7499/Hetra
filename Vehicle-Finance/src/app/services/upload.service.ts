import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { HttpService } from '@services/http.service';
import { ApiService } from '@services/api.service';
import { DocumentDetails } from '@model/upload-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(
    private httpService: HttpService,
    private apiService: ApiService
  ) {}

  constructUploadModel(addDocRq) {
    const appId = 'WIZ';
    const today = moment().format('YYYYMd');
    const unix = moment().unix();
    const dateFormat = `${appId}${today}${unix}`;
    const data = {
      addDocumentReq: {
        msgHdr: {
          appId,
          cnvId: dateFormat,
          bizObjId: dateFormat,
          msgId: dateFormat,
          extRefId: dateFormat,
          timestamp: moment.utc().format(),
          authInfo: {
            brnchId: 1001,
            usrId: 474,
          },
        },
        msgBdy: {
          ssnAuth: {
            usrTkn: 'newgen',
            usrNm: '1',
            usrPwd: '1',
          },
          addDocRq,
        },
      },
    };
    console.log(JSON.stringify(data));
    return this.httpService.docUpload(
      'http://10.101.10.153/addDigiDocument/',
      data
    );
  }

  saveOrUpdateDocument(documentDetails: DocumentDetails[]) {
    const processId = this.apiService.api.saveOrUpdateDocument.processId;
    const workflowId = this.apiService.api.saveOrUpdateDocument.workflowId;
    const projectId = environment.projectIds.salesProjectId;

    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        documentDetails,
        userId: localStorage.getItem('userId'),
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  getDocumentDetails(id: string) {
    const processId = '5ed3d854c78311eab03700505695f93b';
    const workflowId = '5eb62296c78311ea887700505695f93b';
    const projectId = '8bfa8dba945b11eabdcaf2fa9bec3d63';
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        userId: localStorage.getItem('userId'),
        associatedId: id,
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }

  softDeleteDocument(documentId: string) {
    const processId = '5ed873e6c78311eaaa7d00505695f93b';
    const workflowId = '5eb62296c78311ea887700505695f93b';
    const projectId = '8bfa8dba945b11eabdcaf2fa9bec3d63';
    const body = {
      processId,
      workflowId,
      projectId,
      ProcessVariables: {
        userId: localStorage.getItem('userId'),
        documentId: Number(documentId),
      },
    };
    const url = `${environment.host}d/workflows/${workflowId}/${environment.apiVersion.api}execute?projectId=${projectId}`;
    return this.httpService.post(url, body);
  }
}
