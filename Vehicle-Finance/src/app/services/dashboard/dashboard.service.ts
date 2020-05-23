import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = `http://128.199.164.250/appiyo/d/workflows/a8f86a64959a11eabdcff2fa9bec3d63/execute?projectId=74c36bec6da211eabdc2f2fa9bec3d63
  `;
  dashboardLeadsAction: Subject<boolean> = new Subject<boolean>();
  isCreditShow: Observable<boolean> = this.dashboardLeadsAction.asObservable();

  constructor(private http: HttpClient) { }

  leadsChange(value: boolean) {
    this.dashboardLeadsAction.next(value);
  }

  myLeads() {
   return this.http.get(this.url);
  }

}
