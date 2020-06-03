import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse } from "@angular/common/http";
import { EncryptService } from './encrypt.service';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UtilityService } from './utility.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
    providedIn: "root"
})

export class AuthInterceptor implements HttpInterceptor {

    apiCount: number = 0;

    constructor(
        private encrytionService: EncryptService,
        private utilityService: UtilityService,
        private ngxUiLoaderService: NgxUiLoaderService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.ngxUiLoaderService.start();
        this.apiCount++;
        let httpMethod = req.method;
        if (httpMethod == 'POST') {
            if (environment.encryptionType == true) {
                const encryption = this.encrytionService.encrypt(req.body, environment.aesPublicKey);
                req = req.clone(
                    {
                        setHeaders: encryption.headers,
                        body: encryption.rawPayload,
                        responseType: "text"
                    }
                );
            }
        } else {
            req = req.clone({
                setHeaders: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'authentication-token': localStorage.getItem('token') ? localStorage.getItem('token') : ''
                }
            });
        }
        const authReq = req.clone({
            headers: req.headers.set('authentication-token', localStorage.getItem('token') ?
                localStorage.getItem('token') : '')

        });
        return next.handle(authReq).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.headers.get("content-type") == "text/plain") {
                        event = event.clone({ body: JSON.parse(this.encrytionService.decryptResponse(event)) });
                    } else {
                        let res;
                        if (event.headers.get("content-type") != "text/plain" && typeof (event.body) != "object") {
                            res = JSON.parse(event.body);
                        }
                        if (res && res['login_required']) {
                            this.utilityService.logOut();
                        }
                    }
                    this.apiCount--;
                    if (this.apiCount === 0) {
                        this.ngxUiLoaderService.stop();
                    }
                    return event;
                } else {
                    if (this.apiCount === 0) {
                        this.ngxUiLoaderService.stop();
                    }
                }

            }, (err: any) => {
                console.log('err', err)
            })
        );
    }
}