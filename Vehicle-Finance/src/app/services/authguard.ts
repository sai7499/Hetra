import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from 'src/environments/environment';
import RequestEntity from '@model/request.entity';
import { Observable } from 'rxjs';
import { storage } from '../storage/localstorage';
import { HttpService } from './http.service';
import { LoginService } from '../modules/login/login/login.service';
import { LoginStoreService } from './login-store.service';
import { UtilityService } from './utility.service';
import { CommonDataService } from './common-data.service';
import { DashboardService } from './dashboard/dashboard.service';

@Injectable()
export class Authguard implements CanActivate {
  cdsStatus;
  constructor(
    private httpService: HttpService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService,
    private utilityService: UtilityService,
    private cds: CommonDataService

  ) {
    this.cds.cdsStatus$.subscribe((value) => (this.cdsStatus = value));
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (storage.checkToken()) {
      return new Observable<boolean>((observer) => {
        if (!this.cdsStatus) {
          let data = { userId: storage.getUserId() };
          this.loginService.getUserDetails(data).subscribe((res: any) => {
            const response = res;
            if (response.Error === '0') {
              const roles = response.ProcessVariables.roles;
              const userDetails = response.ProcessVariables.userDetails;
              const businessDivisionList =
                response.ProcessVariables.businessDivisionLIst;
              const activityList = response.ProcessVariables.activityList;
              const userRoleActivityList = response.ProcessVariables.userRoleActivityList;

              this.loginStoreService.setRolesAndUserDetails(
                roles,
                userDetails,
                businessDivisionList,
                activityList,
                userRoleActivityList
              );
              observer.next(true);
            }
          });
        } else {
          observer.next(true);
        }
      });
    } else {
      this.utilityService.logOut();
      return false;
    }
  }
}
