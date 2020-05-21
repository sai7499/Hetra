import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LoginStoreService {

    roleAndUserDetails;
    emailId: string;

    setRolesAndUserDetails(roles, userDetails, businessDivisionList, activityList) {
        this.roleAndUserDetails = {
            roles,
            userDetails,
            businessDivisionList,
            activityList
        }
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
}