import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LoginStoreService {

roleAndUserDetails ;

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
}