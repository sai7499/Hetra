import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';


@Injectable()
export class UtilityService {
    constructor(
        private httpService: HttpService,
        private router: Router
    ) { }

    logOut() {
        this.httpService.logOut().subscribe(
            res => {
            },
            error => {
            }
        );
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('userId');
        console.clear();
        this.router.navigateByUrl('/login');

    }
}