import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { storage } from '../storage/localstorage';

@Injectable({
    providedIn: 'root'
})

export class LoginActivateService implements CanActivate {
    constructor(
        private route: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!storage.checkToken()) {
            this.route.navigateByUrl('activity-search');
        } else {
            return false;
        }
    }
}