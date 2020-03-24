import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadSectionService {

  private currentPage$ = new BehaviorSubject(0);

  private labelURL: string = "assets/jsonData/label.json";
  private lovURL: string = "assets/jsonData/lov.json";
  
  constructor(private http: HttpClient) { }

  getLabels(): Observable<any> {
    return this.http.get<any>(this.labelURL)
      .pipe(
        catchError(error => this.errorHandler)
      );
  }

  getLovs(): Observable<any> {
    return this.http.get<any>(this.lovURL)
      .pipe(
        catchError(error => this.errorHandler)
      );
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

}
