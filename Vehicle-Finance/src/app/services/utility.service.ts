import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

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

    getDateFormat(date) {
        const dateFormat: Date = new Date(date);
        const year = dateFormat.getFullYear();
        const month = Number(dateFormat.getMonth()) + 1;
        const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
        let day = dateFormat.getDate().toString();
        day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
        const formattedDate = year + '-' + month1 + '-' + day;
        // const formattedDate = day + '-' + month1 + '-' + year;
        return formattedDate;
    }

    public ageFromAsset(dateOfBirth: any): number {
        return moment().diff(dateOfBirth, 'months');
    }

    getCommonUniqueValue(array, value: any) {
        let distinctThings = array.filter((thing, i, arr) => {
            return arr.indexOf(arr.find(t => t[value] === thing[value])) === i;
        });
        return distinctThings;
    }


    getUiquJson(jsonAry: Array<any>, keyValue) {
        let dataJosn: Array<any> = jsonAry;
        const key = keyValue;
        const arrayUniqueByKey = [...new Map(dataJosn.map(data =>
            [data[key], data])).values()];
        return arrayUniqueByKey;
    }

    getValueFromJSON(JsonObj, key1, value1) {
        let arrayList = [];

        JsonObj.map(data => {
            if (data) {
                const val = {
                    key: data[key1] ? data[key1] : 0,
                    value: data[value1]
                };
                arrayList.push(val);
            }
        });
        return this.getUiquJson(arrayList, "key");
    }
}
