import { Injectable } from '@angular/core';
import { CommonDataService } from './common-data.service';

@Injectable({
    providedIn: 'root'
})

export class LoginStoreService {

    constructor(private cds: CommonDataService){}

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
    }

    getRolesAndUserDetails() {
        return this.roleAndUserDetails;
    }

    setEmailId(email) {
        this.emailId = email;
    }

    getEmailId(){
        return this.emailId;
    }

    setRole(role) {
        const roleArray = role;
        this.roleName = role ? role[0].name : '';
        this.roleId =  role ? role[0].roleId : '';
    }

    getRoleName(){
        return this.roleName ? this.roleName : '';
    }

    getRoleId(){
        return this.roleId ? this.roleId : '';
    }

}