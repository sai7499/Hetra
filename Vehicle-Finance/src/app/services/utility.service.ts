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
        this.router.navigateByUrl('/login');

    }

    getDateFormat(date) {
        console.log('in date conversion ' + date);

        const dateFormat: Date = new Date(date);
        const year = dateFormat.getFullYear();
        const month = Number(dateFormat.getMonth()) + 1;
        const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
        let day = dateFormat.getDate().toString();
        day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
        const formattedDate = year + '-' + month1 + '-' + day;
        console.log('final Value ' + formattedDate);
        return formattedDate;
      }
}
