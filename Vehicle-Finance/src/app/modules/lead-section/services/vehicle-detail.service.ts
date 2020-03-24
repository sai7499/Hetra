import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { VehicleDetailModel } from '../model/vehicle-detail-model';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleDetailService {

  private currentPage$ = new BehaviorSubject(0);

  private url: string = "../assets/vehicle-details-data/vehicle-details-label.json";

  constructor(private http: HttpClient) { }

  getVehicleDetailLabels(): Observable<VehicleDetailModel[]> {
    return this.http.get<VehicleDetailModel[]>(this.url)
      .pipe(
        catchError(error => this.errorHandler)
      );
  }
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || 'SERVER Error');
  }

  setCurrentPage(pageNumber: number) {
    this.currentPage$.next(pageNumber)
  }

  getCurrentPage() {
    return this.currentPage$;
  }



}
