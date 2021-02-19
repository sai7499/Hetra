import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { EncryptService } from './encrypt.service';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, tap, first, catchError } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilityService } from './utility.service';
import { ToastrService } from 'ngx-toastr';
import { IdleTimerService } from '@services/idle-timer.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  apiCount: number = 0;

  constructor(
    private encrytionService: EncryptService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private utilityService: UtilityService,
    private toasterService: ToastrService,
    private idleTimerService: IdleTimerService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // this.ngxUiLoaderService.start();
    this.idleTimerService.updateExpiredTime();
    this.apiCount++;
    let httpMethod = req.method;
    const reqBody = typeof (req.body) === 'string' && !req.url.includes('/complete') ? JSON.parse(req.body) : req.body;

    if (reqBody && reqBody.showLoader !== false) {
      this.ngxUiLoaderService.start();
    } else if (!reqBody) {
      this.ngxUiLoaderService.start();
    }
    console.log('Before Encryption', req.body);
    console.log('req', req);

    let token = '';
    let userId = localStorage.getItem('userId')
    // req.body.userId = userId;

    if (reqBody && reqBody.headers !== undefined) {
      token = reqBody.headers;
    } else if (reqBody) {
      token = localStorage.getItem('token')
        ? localStorage.getItem('token')
        : ''
    }

    if (reqBody && reqBody.ProcessVariables && reqBody.ProcessVariables['userId']) {
    } else if (reqBody && reqBody.ProcessVariables && userId) {
      const parsedBody = JSON.parse(req.body);

      if (parsedBody.ProcessVariables) {
        parsedBody.ProcessVariables.userId = userId;
      } else {
        parsedBody.ProcessVariables = { 'userId': userId }
      }

      req = req.clone({
        body: JSON.stringify(parsedBody),
      });
    }

    if (httpMethod == 'POST') {
      if (req.url.includes('appiyo')) {

        if (environment.encryptionType == true) {
          const encryption = this.encrytionService.encrypt(
            req.body,
            environment.aesPublicKey
          );

          console.log(reqBody, 'Body', req.body)

          req = req.clone({
            setHeaders: encryption.headers,
            body: encryption.rawPayload,
            responseType: 'text',
          });
          console.log('setHeadera', req)
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
          token
        ),
        // localStorage.getItem('token') ? localStorage.getItem('token') : ''
        //     .set('X-AUTH-SESSIONID',
        //      localStorage.getItem('X-AUTH-SESSIONID') ?
        //      localStorage.getItem('X-AUTH-SESSIONID').trim() : '')
      });
    } else {
      authReq = req;
      console.log('wizard api', JSON.stringify(req));

    }
    console.log('authReq', req);
    return next.handle(authReq).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          console.log("error url **** ",err.url)
          if (err.status != 200 && !err.url.includes('logout')) {
            console.log('httpErr', err);
            this.ngxUiLoaderService.stop();
            if (err.status != 401 && err.status != 500) {
              if (err.status === 0) {
                this.toasterService.error(`Connection not available! Please try again later.`, 'Technical error..');
              } else {
                this.toasterService.error(`${err.status}: ${err.statusText}`, 'Technical error..');
              }
            }
          }
        }
        return throwError(err);
      }),
      map(
        (event: HttpEvent<any>) => {
          let res;
          this.apiCount--;
          if (event instanceof HttpResponse) {
           
            if (event.headers.get('content-type') == 'text/plain') {
              event = event.clone({
                body: JSON.parse(this.encrytionService.decryptResponse(event)),
              });
              res = event.body;
            } else {
              if (
                event.headers.get('content-type') != 'text/plain' &&
                event.headers.get('content-type') != "text/html" &&
                typeof event.body != 'object'
              ) {
                res = JSON.parse(event.body);
              }
              if (res && res['login_required']) {
                // this.utilityService.logOut();
                this.utilityService.removeAllLocalStorage();
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
            // this.ngxUiLoaderService.stop();
            console.log('authenticateErrorevent', event);
          }
        },
        (err: any) => {
          console.log('authenticateError', err);
          this.checkApiCount();
        }
      )

    );


  }

  checkApiCount() {
    if (this.apiCount <= 0) {
      console.log('this.apiCount', this.apiCount)
      this.ngxUiLoaderService.stop();
      this.apiCount = 0;
    }
  }
}
