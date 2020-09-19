import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from './dashboard/dashboard.service';
import { ToggleDdeService } from './toggle-dde.service';

@Injectable()
export class UtilityService {
  constructor(private httpService: HttpService, private router: Router, private dashboardService: DashboardService,
    private ngxUiLoaderService: NgxUiLoaderService, private toggleDdeService: ToggleDdeService) { }

  logOut() {
    this.httpService.logOut().subscribe(
      (res) => {
        this.ngxUiLoaderService.stop();
      },
      (error) => {
        this.ngxUiLoaderService.stop();
      }

    );
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('userId');
    localStorage.removeItem('salesResponse');  
    localStorage.removeItem('isFiCumPd'); 
    localStorage.removeItem('lastAction'); 
    localStorage.removeItem('login_required'); 
    localStorage.removeItem('branchId'); 
    localStorage.removeItem('istermSheet');
    localStorage.removeItem('outputUsers');
    localStorage.removeItem('outputUsers');
    localStorage.removeItem('currentUrl');
    localStorage.removeItem('is_pred_done');
    localStorage.removeItem('isPreDisbursement');
    this.dashboardService.routingData = '';
    this.toggleDdeService.clearToggleData();
    console.clear();
    this.router.navigateByUrl('/login');
   
  }

  getDateFormat(date) {
    if (!date) {
      return;
    }
    const dateFormat: Date = new Date(date);
    const year = dateFormat.getFullYear();
    const month = Number(dateFormat.getMonth()) + 1;
    const month1 = month < 10 ? '0' + month.toString() : '' + month.toString(); // ('' + month) for string result
    let day = dateFormat.getDate().toString();
    day = Number(day) < 10 ? '0' + day : '' + day; // ('' + month) for string result
    // const formattedDate = year + '-' + month1 + '-' + day;
    const formattedDate = day + '/' + month1 + '/' + year;
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
    return formattedDate;
  }
  ageFromAsset(dateOfBirth: any): number {
    return moment().diff(dateOfBirth, 'months');
  }

  ageCalculation(dob) {
    return moment().diff(dob, 'years');
  }

  convertDateTimeTOUTC(date, format) {
    console.log(date);
    console.log(format);

    return moment.utc(date).local().format(format);
    
  }

  converDateToUTC(date) {
    return moment.utc(date).format('YYYY-MM-DD HH:MM');
  }

  getCommonUniqueValue(array, value: any) {
    let distinctThings = array.filter((thing, i, arr) => {
      return arr.indexOf(arr.find((t) => t[value] === thing[value])) === i;
    });
    return distinctThings;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        this.validateFormArray(control);
      }
    });
  }

  validateFormArray(formArray) {
    for (const control of formArray.controls) {
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        this.validateFormArray(control);
      }
    }
  }

  getUiquJson(jsonAry: Array<any>, keyValue) {
    let dataJosn: Array<any> = jsonAry;
    const key = keyValue;
    const arrayUniqueByKey = [
      ...new Map(dataJosn.map((data) => [data[key], data])).values(),
    ];
    return arrayUniqueByKey;
  }

  getValueFromJSON(JsonObj, key1, value1) {
    let arrayList = [];

    if (JsonObj) {
      JsonObj.map((data: any) => {
        if (data) {
          const val = {
            key: data[key1] ? data[key1] : 0,
            value: data[value1],
          };
          arrayList.push(val);
        }
      });
    }

    return this.getUiquJson(arrayList, 'key');
  }
  getDateFromString(dateIn) {
    if (!dateIn) {
      return;
    }
    let date: string  = dateIn;
    let dateArray: Array<any> = [];
    if(date.includes('/')) {
       dateArray = date.split('/');
    } else if(date.includes('-')) {
      dateArray = date.split('-');
    }
    //  dateArray = date.split('/');
    let getDate = new Date(
      dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2]
    );
    return getDate;
  }
}
