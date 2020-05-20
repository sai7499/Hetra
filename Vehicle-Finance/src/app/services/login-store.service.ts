import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LoginStoreService {

roleAndUserDetails ;

    setRolesAndUserDetails(roles, userDetails, businessDivisionList) {
        this.roleAndUserDetails = {
            roles,
            userDetails,
            businessDivisionList
        }
    }

    getRolesAndUserDetails() {
        return this.roleAndUserDetails;
    }
}