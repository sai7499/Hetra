import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { Observable } from 'rxjs';
import { storage } from '../storage/localstorage';
import { HttpService } from './http.service';
import { LoginService } from '../modules/login/login/login.service';
import { LoginStoreService } from './login-store.service';
import { UtilityService } from './utility.service';

@Injectable()
export class Authguard implements CanActivate {
    constructor(
        private httpService: HttpService,
        private loginService: LoginService,
        private loginStoreService: LoginStoreService,
        private utilityService: UtilityService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        if (storage.checkToken()) {

            return new Observable<boolean>(observer => {
                let data = { "userId": storage.getUserId() };
                this.loginService.getUserDetails(data).subscribe((res: any) => {
                    const response = res;
                    if (response.Error === '0') {
                        const roles = response.ProcessVariables.roles;
                        const userDetails = response.ProcessVariables.userDetails;
                        const businessDivisionList = response.ProcessVariables.businessDivisionLIst;
                        const activityList = response.ProcessVariables.activityList;
                        this.loginStoreService.setRolesAndUserDetails(roles, userDetails, businessDivisionList, activityList);
                        observer.next(true);
                    }
                });
            });
        }
        else {
            this.utilityService.logOut();
            return false;
        }
    }
}