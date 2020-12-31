import { environment } from './../../environments/environment';
import { ErrorListenerService } from '@services/error-listener.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EncryptService } from './encrypt.service';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { DeviceDetectorService } from 'ngx-device-detector';

import { Router } from '@angular/router';
import { storage } from '../storage/localstorage';
import { ToastrService } from 'ngx-toastr';

export declare class myOptions {
  method: any;
  data?: any;
  params?: {
    [index: string]: string | number;
  };
  serializer?: 'json' | 'urlencoded' | 'utf8';
  timeout?: number;
  headers?: any;
  filePath?: string | string[];
  name?: string | string[];
  responseType?: any;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  isMobile: any;
  ionicOption: myOptions;
  sharedKsy =
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ+GJdSSEeaNFBLqyfM3DIOgQgWCwJ0INfeZZV7ITsLeuA7Yd02rrkYGIix1IWvoebWVmzhncUepYxHwK1ARCdUCAwEAAQ==';

  activeRequests: number = 0;

  constructor(
    private http: HttpClient,
    private httpIonic: HTTP,
    private ngxService: NgxUiLoaderService,
    private deviceService: DeviceDetectorService,
    private encrytionService: EncryptService,
    private errorListenerService: ErrorListenerService,
    private router: Router,
    private toasterService: ToastrService,
  ) {
    this.isMobile = environment.isMobile;
  }

  get(url?: string, params?: any) {
    if (this.isMobile) {
      return this.getM(url, params);
    } else {
      return this.http.get(url, params);
    }
  }

  docUpload(url, body) {
    if (this.isMobile) {
      const requestEntity = JSON.stringify(body);
      return this.uploadDocMobile(url, requestEntity);
    }
    return this.http.post(url, body);
  }

  post(
    url: string,
    requestEntity: any,
    showLoader: boolean = true,
    headers?: any
  ) {
    // if (requestEntity["processVariables"]){
    //   requestEntity["processVariables"]["userId"] = localStorage.getItem('userId')
    // }
    // if (showLoader) {
    //   this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
    // }
    if (this.isMobile) {
      const body = JSON.stringify(requestEntity);
      return this.postM(url, body);
    } else {
      if (headers) {
        return this.http.post(url, requestEntity, {
          headers: headers,
        });
      }
      // const body = new HttpParams({ "fromObject": requestEntity});
      const body = JSON.stringify(requestEntity);
      return this.http.post(url, body);
    }
  }

  postMWithoutEncryption(url, body) {
    const obs = new Observable((observer) => {
      const headers = {
        'Content-Type': 'text/html',
        'authentication-token': localStorage.getItem('token')
          ? localStorage.getItem('token')
          : '',
      };

      //this.httpIonic.setServerTrustMode('nocheck');

      this.httpIonic.setServerTrustMode('pinned').then((result) => {
        console.log("Pinned successfully", result);
      }).catch((error) => {
        console.log("Pinned successfully", error);
      });

      this.httpIonic.setDataSerializer('urlencoded');
      this.httpIonic
        .post(url, body, headers)
        .then((result) => {
          const data = JSON.parse(result.data);
          observer.next(data);
          observer.complete();
        })
        .catch((error) => {
          console.log('error', error);
        });
    });

    return obs;
  }

  postM(url?: string, params?: any) {
    let that = this;
    let reqEntity;

    const reqBody = typeof params === 'string' ? JSON.parse(params) : params;
    let token = '';

    reqEntity = params;

    // if (this.activeRequests === 0) {
    //   this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
    // }
    if (this.activeRequests === 0 && reqBody && reqBody.showLoader !== false) {
      this.ngxService.start();
    }
    this.activeRequests++;

    const obs = new Observable((observer) => {
      let data;

      // this.httpIonic.setServerTrustMode('nocheck');

      this.httpIonic.setServerTrustMode('pinned').then((result) => {
        console.log("Pinned successfully", result);
      }).catch((error) => {
        console.log("Pinned successfully", error);
      });


      let encryption = this.encrytionService.encrypt(
        reqEntity,
        environment.aesPublicKey
      );

      if (reqBody && reqBody.headers !== undefined) {
        token = reqBody.headers;
      } else if (reqBody) {
        token = storage.getToken()
          ? storage.getToken()
          : ''
      }
      encryption.headers['authentication-token'] = token;
      // encryption.headers['authentication-token'] = storage.getToken()
      //   ? storage.getToken()
      //   : '';

      this.ionicOption = {
        method: 'post',
        data: encryption.rawPayload,
        headers: encryption.headers,
        serializer: 'utf8',
        responseType: 'text',
      };

      this.httpIonic
        .sendRequest(url, this.ionicOption)
        .then((result) => {
          if (
            result['headers']['content-type'] != 'text/plain' &&
            typeof (result['data'] != 'object')
          ) {
            data = JSON.parse(result['data']);
          } else {
            let decritedData = that.encrytionService.decryptMobileResponse(
              result
            );
            data = JSON.parse(decritedData);
          }

          /* When request Timeout */
          // if(data['responseStatus'] == '400'){
          //   let cdsData = data['ProcessVariables']['errorCode'];
          //   let msg = data['ProcessVariables']['errorMessage'];
          //   this.errorListenerService.setError({
          //     msg,
          //     errorCode: cdsData,
          //   });
          //   this.activeRequests--;
          //   if (this.activeRequests === 0) {
          //     this.ngxService.stop();
          //   }
          // }

          if (
            data['Error'] == '0' &&
            data['Error'] != undefined &&
            data['ProcessVariables'] != '' &&
            data['ProcessVariables'] != undefined &&
            data['ProcessVariables']['status'] == true &&
            data['ProcessVariables']['status'] != undefined &&
            data['ProcessVariables']['errorCode'] == '' &&
            data['ProcessVariables']['errorCode'] != undefined
          ) {
            // console.log("There are no Errors");
          } else if (
            data['Error'] == '0' &&
            data['Error'] != undefined &&
            data['ProcessVariables'] != '' &&
            data['ProcessVariables'] != undefined &&
            data['ProcessVariables']['status'] == false &&
            data['ProcessVariables']['status'] != undefined &&
            data['ProcessVariables']['errorCode'] != '' &&
            data['ProcessVariables']['errorCode'] != undefined
          ) {
            let cdsData = data['ProcessVariables']['errorCode'];
            let msg = data['ProcessVariables']['errorMessage'];
            if (
              data['ProcessVariables']['errorMessage'] != undefined &&
              data['ProcessVariables']['errroMessage'] != ''
            ) {
              // this.cds.setErrorData(true, cdsData, msg);
              this.errorListenerService.setError({
                msg,
                errorCode: cdsData,
              });
            } else {
              // this.cds.setErrorData(true, data);
              this.errorListenerService.setError({
                errorCode: cdsData,
              });
            }
          } else if (
            data['Error'] == '0' &&
            data['Error'] != undefined &&
            data['ProcessVariables'] != '' &&
            data['ProcessVariables'] != undefined &&
            data['ProcessVariables']['status'] == false &&
            data['ProcessVariables']['status'] != undefined
          ) {
            if (
              data['ProcessName'] != 'Required documents' &&
              data['ProcessName'] != 'Authenticate User Login'
            ) {
              let data = 'DEF';
              // this.cds.setErrorData(true, data);
              this.errorListenerService.setError({
                errorCode: data,
              });
            }
          } else if (
            (data['Error'] == '1' && data['Error'] != undefined) ||
            (data['status'] === false && data['status'] != undefined)
          ) {
            let data = 'APP001';
            // this.cds.setErrorData(true, data);
            this.errorListenerService.setError({
              errorCode: data,
            });
          }

          observer.next(data);
          observer.complete();

          /* Authentication token expired */
          if (data && data['login_required']) {
            // storage.removeToken();
            // storage.removeToken();
            // storage.removeToken();
            // this.utilService.clearCredentials();
            this.errorListenerService.setError({
              errorCode: 'SESSION_EXPIRED',
            });
            storage.removeToken();
            // storage.removeRoles();
            storage.removeUserId();
            // storage.removeBootData();
            // storage.removeBranchData();
            this.router.navigate(['/login']);
          }

          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.ngxService.stop();
          }
        })
        .catch((error) => {
          console.log('~~~***Response error***~~~', error);

          if (error['status'] == '-3' || error['status'] == '-4') {
            this.toasterService.error(`${error['status']}: ${error['error']}`, 'Technical error..');
            this.ngxService.stop();
            data = JSON.parse(error['error']);
            observer.error(data);
            observer.complete();
            this.activeRequests--;  
          }

          if (error['headers']['content-type'] && error['headers']['content-type'] == 'text/plain') {
            let decritedData = that.encrytionService.decryptMobileResponse(
              error
            );
            data = JSON.parse(decritedData);
          }

          if (error['headers']['content-type'] &&
            error['headers']['content-type'] != 'text/plain' &&
            typeof (error['data'] != 'object')
          ) {
            data = JSON.parse(error['data']);
          }

          observer.error(data);
          observer.complete();
          this.activeRequests--;
          if (this.activeRequests === 0) {
            this.ngxService.stop();
          }
        });
    });

    return obs;
  }

  uploadDocMobile(url?: string, body?: any) {
    this.ngxService.start();

    // let JsonToArray = function(json){
    //   var str = JSON.stringify(json, null, 0);
    //   var ret = new Uint8Array(str.length);
    //   for (var i = 0; i < str.length; i++) {
    //     ret[i] = str.charCodeAt(i);
    //   }
    //   return ret
    // };


    // let binArrayToJson = function(binArray) {
    //   var str = "";
    //   for (var i = 0; i < binArray.length; i++) {
    //     str += String.fromCharCode(parseInt(binArray[i]));
    //   }
    //   return JSON.parse(str)
    // }

    const obs = new Observable((observer) => {
      const headers = {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
      };

      // this.httpIonic.setServerTrustMode('nocheck');

      this.httpIonic.setServerTrustMode('pinned').then((result) => {
        console.log("Pinned successfully", result);
      }).catch((error) => {
        console.log("Pinned successfully", error);
      });

      this.httpIonic.setDataSerializer('utf8');




      this.ionicOption = {
        method: 'post',
        data: body,
        headers: headers
      };

      this.httpIonic
        .sendRequest(url, this.ionicOption)
        .then((result) => {
          const data = JSON.parse(result.data);
          observer.next(data);
          observer.complete();
          this.ngxService.stop();
        }).catch((error) => {
          observer.error(error);
          observer.complete();
          this.ngxService.stop();
        });

      // let dataUint8Array = binArrayToJson(body);
      // console.log("dataUint8Array", dataUint8Array);
      // console.log("JsonToArray", JsonToArray(dataUint8Array));

      // let data = this.str2ab(body);

      // this.httpIonic
      //   .post(url, data, headers)
      //   .then((result) => {
      //     const data = JSON.parse(result.data);
      //     observer.next(data);
      //     observer.complete();
      //     this.ngxService.stop();
      //   })
      //   .catch((error) => {
      //     console.log('Data-error', error);
      //     observer.error(error);
      //     observer.complete();
      //     this.ngxService.stop();
      //   });
    });

    return obs;
  }

  str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }


  getM(url?: string, params?: any) {
    this.ngxService.start();

    const obs = new Observable((observer) => {
      const headers = {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'authentication-token': storage.getToken() ? storage.getToken() : '',
      };

      //this.httpIonic.setServerTrustMode('nocheck');

      this.httpIonic.setServerTrustMode('pinned').then((result) => {
        console.log("Pinned successfully", result);
      }).catch((error) => {
        console.log("Pinned successfully", error);
      });

      this.httpIonic
        .get(url, {}, headers)
        .then((result) => {
          const data = JSON.parse(result.data);
          observer.next(data);
          observer.complete();
          this.ngxService.stop();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
          this.ngxService.stop();
        });
    });

    return obs;
  }

  downloadMFile(uri, savePath) {
    this.ngxService.start();

    const obs = new Observable((observer) => {
      let header = {
        'authentication-token': localStorage.getItem('token')
          ? localStorage.getItem('token')
          : '',
      };
      //this.httpIonic.setServerTrustMode('nocheck');

      this.httpIonic.setServerTrustMode('pinned').then((result) => {
        console.log("Pinned successfully", result);
      }).catch((error) => {
        console.log("Pinned successfully", error);
      });

      this.httpIonic
        .downloadFile(uri, {}, header, savePath)
        .then((result) => {
          observer.next(result);
          observer.complete();
          this.ngxService.stop();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
          this.ngxService.stop();
        });
    });

    return obs;
  }

  logOut() {
    let url = environment.host + '/account/logout';
    return this.http.get(url);
  }
}
