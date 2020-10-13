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
import { Router,NavigationEnd,NavigationStart} from '@angular/router';
import { filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  apiCount: number = 0;
  refreshDetect: boolean;

  constructor(
    private encrytionService: EncryptService,
    private ngxUiLoaderService: NgxUiLoaderService,
    private utilityService: UtilityService,
    private toasterService: ToastrService,
    private router: Router
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

     /** while browser refresh it will trigger */
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects 
      ) {

        if(!this.refreshDetect) {
          this.refreshDetect = true;
          if (confirm('Are you sure you want to logout?')) {
            this.ngxUiLoaderService.stop();
            this.utilityService.removeAllLocalStorage();
          } else {
          }

        }
         
        
      }
    })

    /** while browser back/front button click it will trigger */

    this.router.events
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === 'popstate') {
          if(!this.refreshDetect) {
            this.refreshDetect = true;
            if (confirm('Are you sure you want to logout?')) {
              this.ngxUiLoaderService.stop();
              this.utilityService.removeAllLocalStorage();
            } else {
            }
          } 
        }
      });


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
    console.log('authReq', req);
    return next.handle(authReq).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status != 200) {
            if (err.status != 401 && err.status != 500) {
              console.log('httpErr', err);
              this.refreshDetect = false;
              this.ngxUiLoaderService.stop();
              this.toasterService.error(`${err.status}: ${err.statusText}`, 'Technical error..');
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
      this.refreshDetect = false;
      this.ngxUiLoaderService.stop();
    }
  }
}
