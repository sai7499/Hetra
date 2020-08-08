import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpResponse,
} from '@angular/common/http';
import { EncryptService } from './encrypt.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap, first, catchError } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  apiCount: number = 0;

  constructor(
    private encrytionService: EncryptService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private utilityService: UtilityService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log('auth', localStorage.getItem('token'))
    this.ngxUiLoaderService.start();
    this.apiCount++;
    let httpMethod = req.method;
    console.log('Before Encryption', req.body);
    console.log('req', req);

    if (httpMethod == 'POST') {
      if (req.url.includes('appiyo')) {
        if (environment.encryptionType == true) {
          const encryption = this.encrytionService.encrypt(
            req.body,
            environment.aesPublicKey
          );
          req = req.clone({
            setHeaders: encryption.headers,
            body: encryption.rawPayload,
            responseType: 'text',
          });
        }
      }
    } else {
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'authentication-token': localStorage.getItem('token')
            ? localStorage.getItem('token')
            : '',
        },
      });
    }

    let authReq;
    if (req.url.includes('appiyo')) {
      authReq = req.clone({
        headers: req.headers.set(
          'authentication-token',
          localStorage.getItem('token') ? localStorage.getItem('token') : ''
        ),
        //     .set('X-AUTH-SESSIONID',
        //      localStorage.getItem('X-AUTH-SESSIONID') ?
        //      localStorage.getItem('X-AUTH-SESSIONID').trim() : '')
      });
    } else {
      authReq = req;
    }

    return next.handle(authReq).pipe(
      map(
        (event: HttpEvent<any>) => {
          let res;
          this.apiCount--;
          if (event instanceof HttpResponse) {
            
            if (event.headers.get('content-type') == 'text/plain' ) {
              event = event.clone({
                body: JSON.parse(this.encrytionService.decryptResponse(event)),
              });
              res = event.body;
            } else {
              if (
                event.headers.get('content-type') != 'text/plain' &&
                typeof event.body != 'object'
              ) {
                res = JSON.parse(event.body);
              }
              if (res && res['login_required']) {
                this.utilityService.logOut();
              }
            }
            console.log('after Encryption: ', event.body);

            if (res && res['Error'] === '1') {
              alert(res['ErrorMessage']);
            }
            // this.ngxUiLoaderService.stop();
            this.checkApiCount();
            return event;
          } else {
            this.ngxUiLoaderService.stop();
          }
        },
        (err: any) => {
          console.log('err', err);
          this.checkApiCount();
        }
      )
      
    );

    
  }

  checkApiCount(){
    console.log("api count",this.apiCount)
    if(this.apiCount <= 0){
      this.ngxUiLoaderService.stop();
    }
  }
}
