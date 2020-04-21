import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: "root"
})

export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('auth', localStorage.getItem('token'))
        req = req.clone({
            setHeaders: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'authentication-token': localStorage.getItem('token')
            }
        });
        return next.handle(req);
    }
}