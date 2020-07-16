import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginStoreService } from './login-store.service';
import { Location } from '@angular/common';


@Injectable()

export class CanActivateService implements CanActivate {

    user: number;

    constructor(
        private route: Router,
        private loginStoreService: LoginStoreService,
        private location: Location
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const userDetails = this.loginStoreService.getRolesAndUserDetails();
        const currentUser = userDetails[0].roleType;

        const currentUrl = this.location.path();
        this.user = currentUrl.includes('dde') ? 2 : 1;
        if (currentUser === this.user) {
            return true;
        } else {
            this.route.navigateByUrl('login');
            return false;
        }
    }
}