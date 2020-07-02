import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@services/dashboard/dashboard.service';
import { LoginService } from '../../login/login/login.service';
import { LoginStoreService } from '@services/login-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showFilter;
  roleType;
  constructor(
    private dashboardService: DashboardService,
    private loginService: LoginService,
    private loginStoreService: LoginStoreService
     ) { }

  ngOnInit() {
     this.loginStoreService.isCreditDashboard.subscribe((value: any) => {
       this.roleType = value.roleType;
       console.log('values For User', value);
      });
  }

}
