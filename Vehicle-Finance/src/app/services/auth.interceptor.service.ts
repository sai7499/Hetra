import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse } from "@angular/common/http";
import { EncryptService } from './encrypt.service';
import { environment } from '../../environments/environment';
import { Observable } from "rxjs";
import { map, tap, first, catchError } from "rxjs/operators";



@Injectable({
    providedIn: "root"
})

export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private encrytionService: EncryptService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('auth', localStorage.getItem('token'))
        let httpMethod = req.method;
        console.log("Before Encryption", req.body);
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
            //     .set('X-AUTH-SESSIONID',
            //      localStorage.getItem('X-AUTH-SESSIONID') ? 
            //      localStorage.getItem('X-AUTH-SESSIONID').trim() : '')
        });
        return next.handle(authReq).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.headers.get("content-type") == "text/plain") {
                        event = event.clone({ body: JSON.parse(this.encrytionService.decryptResponse(event)) });
                        console.log("after Encryption: ", event.body);
                    }
                    return event;
                }
            }, (err: any) => {
                console.log('err', err)
            })
        );
    }
}