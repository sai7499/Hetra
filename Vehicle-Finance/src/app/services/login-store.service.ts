import { Injectable } from '@angular/core';
import { CommonDataService } from './common-data.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { DashboardService } from './dashboard/dashboard.service';

@Injectable({
    providedIn: 'root'
})

export class LoginStoreService {

    constructor(private cds: CommonDataService,
        private dashBoardService: DashboardService) { }

    roleAndUserDetails;
    emailId: string;
    roleName: string;
    roleId: any;

    setRolesAndUserDetails(roles, userDetails, businessDivisionList, activityList) {
        this.roleAndUserDetails = {
            roles,
            userDetails,
            businessDivisionList,
            activityList
        }
        this.cds.changeCdsStatus(true);
        this.creditDashboardMethod({
            branchId: userDetails["branchId"],
            roleId: roles[0].roleId,
            roleType: roles[0].roleType,
            userName: userDetails.firstName,
            businessDivision: businessDivisionList[0].bizDivId
        });
    }

    getRolesAndUserDetails() {
        return this.roleAndUserDetails;
    }

    setEmailId(email) {
        this.emailId = email;
    }

    getEmailId() {
        return this.emailId;
    }

    public creditDashboard: BehaviorSubject<object> = new BehaviorSubject<object>({ branchId: '', roleId: '', roleType: '', userName: '', businessDivision: '' });
    isCreditDashboard = this.creditDashboard.asObservable();
    creditDashboardMethod(value: object) {
        this.creditDashboard.next(value);
    }
}