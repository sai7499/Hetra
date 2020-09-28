import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import * as  mLabelURL  from '../../assets/jsonData/label.json';
import * as  mLovURL  from '../../assets/jsonData/lov.json';
import { environment } from './../../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class LeadSectionService {
  isMobile: any;


  private currentPage$ = new BehaviorSubject(0);

  // private labelURL: string = "assets/jsonData/label.json";
  // private lovURL: string = "assets/jsonData/lov.json";
  
  constructor(private http: HttpClient) { 
    this.isMobile = environment.isMobile;
  }

  getLabels(): Observable<any> {
    // if(this.isMobile) {
      return this.createObservableObj(mLabelURL).pipe(
        catchError(error => this.errorHandler)
      );
    // }
    // return this.http.get<any>(this.labelURL)
    //   .pipe(
    //     catchError(error => this.errorHandler)
    //   );
  }

  getLovs(): Observable<any> {
    // if(this.isMobile) {
      return this.createObservableObj(mLovURL).pipe(
        catchError(error => this.errorHandler)
      );
    // }
    // return this.http.get<any>(this.lovURL)
    //   .pipe(
    //     catchError(error => this.errorHandler)
    //   );
  }

  //Handling the Error Message
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'SERVER Error');
  }

  setCurrentPage(pageNumber: number) {
    this.currentPage$.next(pageNumber)
  }

  getCurrentPage() {
    return this.currentPage$;
  }

  createObservableObj(labelsurl: object){
    const obs = new Observable(observer => {
      observer.next(labelsurl);
      observer.complete();
    });
    return obs;
  }

}
