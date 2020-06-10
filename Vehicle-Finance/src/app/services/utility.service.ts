import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Injectable()
export class UtilityService {
  constructor(private httpService: HttpService, private router: Router) { }

  logOut() {
    this.httpService.logOut().subscribe(
      (res) => { },
      (error) => { }
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
    // const formattedDate = year + '-' + month1 + '-' + day;
    const formattedDate = day + '/' + month1 + '/' + year;
    console.log('return Date', formattedDate);
    return formattedDate;
  }
  getNewDateFormat(date) {
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    const formattedDate = year + '-' + month1 + '-' + day;
    // const formattedDate = day + '/' + month1 + '/' + year;
    console.log('return Date', formattedDate);
    return formattedDate;
  }
  ageFromAsset(dateOfBirth: any): number {
    return moment().diff(dateOfBirth, 'months');
  }

  convertDateTimeTOUTC(date) {
    return moment.utc(date).local().format('DD/MM/YYYY');
  }

  converDateToUTC(date) {
    // console.log('Outpur date', moment.utc(date).format('DD-MM-YYYYT00:00:00.000Z'))
    return moment.utc(date).format('EEE MM/DD/YYYY T00:00:00.000Z')
    // var d = new Date( date + 'T00:00:00.000Z');
    // console.log('D', d)
    // return moment.utc(date).format('YYYY-MM-DD HH:MM')
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
    const arrayUniqueByKey = [
      ...new Map(dataJosn.map((data) => [data[key], data])).values(),
    ];
    console.log('uqi ', arrayUniqueByKey);
    return arrayUniqueByKey;
  }

  getValueFromJSON(JsonObj, key1, value1) {
    let arrayList = [];
    console.log('JsonObj', JsonObj);
    console.log('key1', key1);
    console.log('value1', value1);
    JsonObj.map((data) => {
      if (data) {
        const val = {
          key: data[key1] ? data[key1] : 0,
          value: data[value1],
        };
        arrayList.push(val);
      }
    });
    return this.getUiquJson(arrayList, 'key');
  }
}
