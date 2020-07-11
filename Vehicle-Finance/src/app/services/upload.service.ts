import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { HttpService } from '@services/http.service';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private httpService: HttpService) {}

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
}
