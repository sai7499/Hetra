import { Injectable } from '@angular/core';
import { CommonDataService } from './common-data.service';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from '@modules/shared/shared-service/shared-service';

@Injectable({
    providedIn: 'root',
})
export class LoginStoreService {

    constructor(private cds: CommonDataService,
        private sharedService: SharedService) { }

    roleAndUserDetails;
    emailId: string;
    roleName: string;
    roleId: any;
    userRoleActivityList: any;
    businessDivisionList: any;
    userDetails: any;

    setRolesAndUserDetails(roles, userDetails, businessDivisionList, activityList, userRoleActivityList) {
        this.roleAndUserDetails = {
            roles,
            userDetails,
            businessDivisionList,
            activityList,
            userRoleActivityList
        }

        this.sharedService.setSearchBarActivity(activityList)

        this.sharedService.getRolesActivityList({
            roles,
            userDetails,
            businessDivisionList,
            activityList,
            userRoleActivityList
        });
        this.cds.changeCdsStatus(true);
        this.creditDashboardMethod({
            branchId: userDetails["branchId"],
            roleId: roles[0].roleId,
            roleType: roles[0].roleType,
            userName: userDetails.firstName,
            businessDivision: businessDivisionList
        });
        this.userRoleActivityList = userRoleActivityList;
        this.userDetails = userDetails;
        this.businessDivisionList = businessDivisionList;

    }

    getUserRoleActivityList() {
        return this.userRoleActivityList;
    }

    getRolesAndUserDetails() {
        this.sharedService.roleAndActivityList$.subscribe((val: any) => {
            this.roleAndUserDetails = val;
        })
        return this.roleAndUserDetails;
    }

    getUserDetails() {
        return this.userDetails;
    }

    getBusinessDeviation() {
        return this.businessDivisionList;
    }

    setEmailId(email) {
        this.emailId = email;
    }

    getEmailId() {
        return this.emailId;
    }

    public creditDashboard: BehaviorSubject<object> = new BehaviorSubject<object>({ branchId: '', roleId: '', roleType: '', userName: '' });
    isCreditDashboard = this.creditDashboard.asObservable();
    creditDashboardMethod(value: object) {
        this.creditDashboard.next(value);
    }
}
