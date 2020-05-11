import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LoginStoreService {

roleAndUserDetails ;

    setRolesAndUserDetails(roles, userDetails) {
        this.roleAndUserDetails = {
            roles,
            userDetails
        }
    }

    getRolesAndUserDetails() {
        return this.roleAndUserDetails;
    }
}